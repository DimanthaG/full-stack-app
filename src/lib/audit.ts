import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type AuditAction = "UPDATE_ROLE" | "DELETE_USER" | "RESET_PASSWORD";

export async function logAuditEvent({
  actorId,
  action,
  targetUserId,
  details = {}
}: {
  actorId: string;
  action: AuditAction;
  targetUserId: string;
  details?: Record<string, unknown>;
}) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection("audit_logs").insertOne({
    timestamp: new Date(),
    actorId: new ObjectId(actorId),
    targetUserId: new ObjectId(targetUserId),
    action,
    details,
  });
} 