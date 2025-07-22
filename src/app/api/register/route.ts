import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check for existing user
    const existing = await db.collection("users").findOne({ 
      email: email.toLowerCase() 
    });
    
    // Hash password
    const hashedPassword = await hash(password, 12);

    if (existing) {
      // If user exists but only has Google auth (no password)
      if (existing.googleId && !existing.password) {
        // Update the existing user to add password authentication
        await db.collection("users").updateOne(
          { email: email.toLowerCase() },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date()
            },
            $addToSet: { 
              providers: "credentials" 
            }
          }
        );

        return NextResponse.json({
          success: true,
          userId: existing._id,
          merged: true
        });
      }

      // If user already has password auth, return error
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Create new user if no existing account found
    const result = await db.collection("users").insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      providers: ["credentials"]
    });

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user. Please try again later." },
      { status: 500 }
    );
  }
} 