"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaSearch, FaFilter, FaCalendar, FaUser, FaEye } from "react-icons/fa";
import PageTransition from "@/components/PageTransition";

interface AuditEntry {
  _id: string;
  actorId: string;
  targetUserId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
  actorEmail?: string;
  targetEmail?: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setLogs(data.logs);
        setFilteredLogs(data.logs);
      })
      .catch(() => setError("Failed to load audit logs"));
  }, []);

  // Filter logs based on search term and filters
  useEffect(() => {
    let filtered = logs;
    
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetUserId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter);
    }
    
    if (dateFilter !== "all") {
      const now = new Date();
      const logDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(log => {
            logDate.setTime(new Date(log.timestamp).getTime());
            return logDate.toDateString() === now.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => new Date(log.timestamp) >= weekAgo);
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => new Date(log.timestamp) >= monthAgo);
          break;
      }
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter, dateFilter]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "UPDATE_ROLE":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "DELETE_USER":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "RESET_PASSWORD":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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
                <FaClipboardList className="w-8 h-8 text-[#8A9B9C] mr-4" />
                <h1 className="text-4xl font-bold text-white">Audit Logs</h1>
              </div>
              <p className="text-gray-300">Review system audit logs and administrative actions</p>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Logs</p>
                    <p className="text-2xl font-bold text-white">{logs.length}</p>
                  </div>
                  <FaClipboardList className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today</p>
                    <p className="text-2xl font-bold text-white">
                      {logs.filter(log => {
                        const logDate = new Date(log.timestamp);
                        const today = new Date();
                        return logDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <FaCalendar className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">This Week</p>
                    <p className="text-2xl font-bold text-white">
                      {logs.filter(log => {
                        const logDate = new Date(log.timestamp);
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return logDate >= weekAgo;
                      }).length}
                    </p>
                  </div>
                  <FaCalendar className="w-8 h-8 text-[#8A9B9C]" />
                </div>
              </div>

              <div className="bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Unique Actors</p>
                    <p className="text-2xl font-bold text-white">
                      {new Set(logs.map(log => log.actorId)).size}
                    </p>
                  </div>
                  <FaUser className="w-8 h-8 text-[#8A9B9C]" />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C]"
                  >
                    <option value="all">All Actions</option>
                    <option value="UPDATE_ROLE">Role Updates</option>
                    <option value="DELETE_USER">User Deletions</option>
                    <option value="RESET_PASSWORD">Password Resets</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-gray-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#2A3B4C]/50 border border-[#4A5B6C] rounded-md text-white focus:outline-none focus:ring-[#6A7B8C] focus:border-[#6A7B8C]"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
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

            {/* Audit Logs Table */}
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
                      <th className="text-left py-4 px-6 text-white font-semibold">Timestamp</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Action</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Actor</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Target</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((entry, index) => (
                      <motion.tr
                        key={entry._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-[#4A5B6C]/30 hover:bg-[#4A5B6C]/10 transition-colors"
                      >
                        <td className="py-4 px-6 text-white">
                          <div className="flex items-center">
                            <FaCalendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{formatTimestamp(entry.timestamp)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(entry.action)}`}>
                            {entry.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white">
                          <div className="flex items-center">
                            <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{entry.actorId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white">
                          <div className="flex items-center">
                            <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{entry.targetUserId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <FaEye className="w-4 h-4 text-gray-400 mr-2" />
                            <details className="text-sm">
                              <summary className="cursor-pointer text-white hover:text-[#8A9B9C]">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-[#2A3B4C]/50 rounded text-xs text-gray-300 whitespace-pre-wrap">
                                {JSON.stringify(entry.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* No results message */}
            {filteredLogs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-[#8A9B9C]" />
                <p>No audit logs found matching your criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </>
    </PageTransition>
  );
} 