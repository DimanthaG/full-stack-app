"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  params: { username: string };
}

export default function UserProfile({ params }: Props) {
  return (
    <main>
      <h1>User Profile: {params.username}</h1>
      <p>Welcome to the profile of {params.username}.</p>
    </main>
  );
} 