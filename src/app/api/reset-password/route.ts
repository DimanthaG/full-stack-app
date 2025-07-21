import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { randomBytes } from "crypto";

// Generate a random reset token
function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Find user and update with reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const user = await db.collection("users").findOneAndUpdate(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      },
      { returnDocument: "after" }
    );

    if (!user.value) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    // TODO: Send reset email with token
    // In production, integrate with your email service
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    return NextResponse.json({
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Error processing password reset" },
      { status: 500 }
    );
  }
} 