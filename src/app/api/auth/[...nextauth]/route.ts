import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

if (!process.env.NEXTAUTH_URL) {
  console.warn("Warning: NEXTAUTH_URL is not set. This might cause session issues in production.");
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Error: NEXTAUTH_SECRET is not set");
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });
        
        if (!user) throw new Error("User not found");
        
        // If user has googleId but no password (OAuth-only user)
        if (user.googleId && !user.password) {
          throw new Error("Please sign in with Google");
        }
        
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          const client = await clientPromise;
          const db = client.db();
          
          // Check if user already exists
          const existingUser = await db.collection("users").findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            const result = await db.collection("users").insertOne({
              email: user.email,
              name: user.name,
              role: "user",
              createdAt: new Date(),
              googleId: (profile as any).sub,
              image: user.image,
              providers: ["google"]
            });
            
            user.id = result.insertedId.toString();
            user.role = "user";
          } else {
            // Update existing user with Google info
            await db.collection("users").updateOne(
              { email: user.email },
              {
                $set: {
                  googleId: (profile as any).sub,
                  image: user.image || existingUser.image,
                  name: user.name || existingUser.name
                },
                $addToSet: { providers: "google" }
              }
            );
            
            user.id = existingUser._id.toString();
            user.role = existingUser.role || "user";
          }
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 