"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface PendingChange {
  userId: string;
  newRole: string;
  currentRole: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => setError("Access denied or failed to load users."));
  }, []);

  async function handleRoleChange(userId: string, newRole: string, currentRole: string) {
    setPendingChange({ userId, newRole, currentRole });
  }

  async function confirmRoleChange() {
    if (!pendingChange) return;
    
    setUpdating(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: pendingChange.userId,
          newRole: pendingChange.newRole
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setUsers(users.map(user => 
        user._id === pendingChange.userId ? { ...user, role: pendingChange.newRole } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
    } finally {
      setUpdating(false);
      setPendingChange(null);
    }
  }

  // Check if current user is the only admin
  const adminCount = users.filter(user => user.role === "admin").length;
  const isLastAdmin = adminCount === 1;

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Email</th>
            <th className="text-left py-2 px-3">Name</th>
            <th className="text-left py-2 px-3">Role</th>
            <th className="text-left py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user._id === session?.user?.id;
            const isUserLastAdmin = isLastAdmin && user.role === "admin";
            const showWarning = isSelf || isUserLastAdmin;

            return (
              <tr key={user._id} className="border-b">
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3">{user.name}</td>
                <td className="py-2 px-3 capitalize">{user.role}</td>
                <td className="py-2 px-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value, user.role)}
                    disabled={updating || (isUserLastAdmin && user.role === "admin")}
                    className="border px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {showWarning && (
                    <span className="text-sm text-gray-500 ml-2">
                      {isSelf ? "You cannot demote yourself" : "Last admin account"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pendingChange && (
        <ConfirmModal
          title="Confirm Role Change"
          message={`Are you sure you want to change this user's role from ${pendingChange.currentRole} to ${pendingChange.newRole}?`}
          onConfirm={confirmRoleChange}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </main>
  );
} 