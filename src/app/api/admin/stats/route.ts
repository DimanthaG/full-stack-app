import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    // Get user statistics
    const totalUsers = await db.collection("users").countDocuments();
    const adminUsers = await db.collection("users").countDocuments({ role: "admin" });
    const regularUsers = await db.collection("users").countDocuments({ role: "user" });

    // Get recent audit logs count (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentAuditLogs = await db.collection("audit_logs").countDocuments({
      timestamp: { $gte: yesterday }
    });

    return NextResponse.json({
      totalUsers,
      adminUsers,
      regularUsers,
      recentAuditLogs
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
} 