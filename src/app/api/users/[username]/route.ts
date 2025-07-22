import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    // Get the current session
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Extract username from email (everything before @)
    const usernameFromEmail = params.username;

    // Find user by matching the username part of their email
    const user = await db.collection("users").findOne({
      email: new RegExp(`^${usernameFromEmail}@`, "i"), // Case insensitive match for email starting with username
    }, {
      projection: {
        email: 1,
        name: 1,
        role: 1,
        createdAt: 1,
        _id: 0
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 