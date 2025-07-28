"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";
import { motion } from "framer-motion";
import { FaUsers, FaSearch, FaFilter, FaEye, FaEdit } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

interface PendingChange {
  userId: string;
  newRole: string;
  currentRole: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setFilteredUsers(data.users);
      })
      .catch(() => setError("Access denied or failed to load users."));
  }, []);

  // Filter users based on search term and role filter
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

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
    <PageTransition>
      <>
        <div className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center mb-4">
                <FaUsers className="w-8 h-8 text-[#8A9B9C] mr-4" />
                <h1 className="text-4xl font-bold text-white">User Management</h1>
              </div>
              <p className="text-gray-300">Manage user accounts, roles, and permissions</p>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Admin Users</p>
                    <p className="text-2xl font-bold text-white">{users.filter(u => u.role === "admin").length}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Regular Users</p>
                    <p className="text-2xl font-bold text-white">{users.filter(u => u.role === "user").length}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C]"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#2A3B4C]/20 backdrop-blur-sm rounded-lg border border-[#4A5B6C]/30 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#4A5B6C]/20">
                    <tr>
                      <th className="text-left py-4 px-6 text-white font-semibold">User</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Role</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const isSelf = user._id === session?.user?.id;
                      const isUserLastAdmin = isLastAdmin && user.role === "admin";
                      const showWarning = isSelf || isUserLastAdmin;

                      return (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-[#4A5B6C]/30 hover:bg-[#4A5B6C]/10 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#4A5B6C] rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <p className="text-white font-medium">{user.name || "No name"}</p>
                                <p className="text-gray-400 text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-white">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" 
                                ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                                : "bg-green-500/20 text-green-400 border border-green-500/30"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value, user.role)}
                                disabled={updating || (isUserLastAdmin && user.role === "admin")}
                                className="px-3 py-1 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white text-sm focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C] disabled:opacity-50"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              {showWarning && (
                                <span className="text-xs text-yellow-400">
                                  {isSelf ? "You cannot demote yourself" : "Last admin account"}
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* No results message */}
            {filteredUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <FaUsers className="w-12 h-12 mx-auto mb-4 text-[#8A9B9C]" />
                <p>No users found matching your criteria</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {pendingChange && (
          <ConfirmModal
            title="Confirm Role Change"
            message={`Are you sure you want to change this user's role from ${pendingChange.currentRole} to ${pendingChange.newRole}?`}
            onConfirm={confirmRoleChange}
            onCancel={() => setPendingChange(null)}
          />
        )}
      </>
    </PageTransition>
  );
} 