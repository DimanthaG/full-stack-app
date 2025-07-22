"use client";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminOnly({ children, fallback = <p>Access Denied</p> }: AdminOnlyProps) {
  const { data: session } = useSession();

  if (!session || session.user?.role !== "admin") {
    return fallback;
  }

  return <>{children}</>;
} 