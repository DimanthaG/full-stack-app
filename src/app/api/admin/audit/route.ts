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

  const logs = await db
    .collection("audit_logs")
    .find({})
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json({ logs });
} 