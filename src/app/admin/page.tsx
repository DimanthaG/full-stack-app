"use client";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUsers, FaClipboardList, FaChartLine, FaCog } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';
import { useState, useEffect } from "react";

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentAuditLogs: number;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentAuditLogs: 0
  });

  useEffect(() => {
    if (session?.user?.role === "admin") {
      // Fetch admin statistics
      fetch("/api/admin/stats")
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Failed to load stats:", err));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </PageTransition>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-[#2A3B4C]/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-[#4A5B6C]/30">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const adminFeatures = [
    {
      title: "User Management",
      description: "View, manage, and modify user roles and permissions",
      icon: <FaUsers className="w-6 h-6" />,
      href: "/admin/users",
      color: "bg-[#4A5B6C] hover:bg-[#6A7B8C]"
    },
    {
      title: "Audit Logs",
      description: "Review system audit logs and administrative actions",
      icon: <FaClipboardList className="w-6 h-6" />,
      href: "/admin/audit",
      color: "bg-[#4A5B6C] hover:bg-[#6A7B8C]"
    },
    {
      title: "System Settings",
      description: "Configure application settings and preferences",
      icon: <FaCog className="w-6 h-6" />,
      href: "/admin/settings",
      color: "bg-[#4A5B6C] hover:bg-[#6A7B8C]"
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {session.user?.name || session.user?.email}</p>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Admin Users</p>
                    <p className="text-2xl font-bold text-white">{stats.adminUsers}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Regular Users</p>
                    <p className="text-2xl font-bold text-white">{stats.regularUsers}</p>
                  </div>
                  <FaUsers className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Recent Logs</p>
                    <p className="text-2xl font-bold text-white">{stats.recentAuditLogs}</p>
                  </div>
                  <FaClipboardList className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>
            </motion.div>

            {/* Admin Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {adminFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30 hover:bg-[#2A3B4C]/30 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-lg bg-[#4A5B6C] text-white mr-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="text-gray-300">
                <p>• Last login: {new Date().toLocaleDateString()}</p>
                <p>• System status: Operational</p>
                <p>• Active sessions: {stats.totalUsers}</p>
              </div>
            </motion.div>
          </div>
        </div>
    </PageTransition>
  );
} 