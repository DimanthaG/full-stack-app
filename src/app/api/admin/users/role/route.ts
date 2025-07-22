import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { logAuditEvent } from "@/lib/audit";
import { sendSecurityNotification } from "@/lib/notifications";

export async function PATCH(req: Request) {
  const session = await getServerSession(options);

  // Check if user is admin
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, newRole } = await req.json();

  // Validate role
  if (!["admin", "user"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Edge Case 1: Prevent self-demotion
  if (session.user.id === userId && newRole !== "admin") {
    return NextResponse.json(
      { error: "Admin cannot demote themselves" },
      { status: 400 }
    );
  }

  // Edge Case 2: Prevent removal of last admin
  const adminCount = await db
    .collection("users")
    .countDocuments({ role: "admin" });

  const targetUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (targetUser?.role === "admin" && newRole !== "admin" && adminCount <= 1) {
    return NextResponse.json(
      { error: "Cannot demote the last remaining admin" },
      { status: 400 }
    );
  }

  // Apply the role update
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );

  // Log the audit event
  await logAuditEvent({
    actorId: session.user.id,
    action: "UPDATE_ROLE",
    targetUserId: userId,
    details: {
      previousRole: targetUser?.role,
      newRole,
    },
  });

  // Send notifications for admin role changes
  if (targetUser?.role === "admin" || newRole === "admin") {
    await sendSecurityNotification(
      "Admin Role Change",
      {
        actor: session.user.email,
        target: targetUser?.email,
        fromRole: targetUser?.role,
        toRole: newRole,
        timestamp: new Date().toISOString(),
      }
    );
  }

  return NextResponse.json({ success: true, role: newRole });
} 