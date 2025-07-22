"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    enableNotifications: true,
    enableAuditLog: true,
    maxUsersPerPage: 10
  });

  if (!session?.user || session.user.role !== "admin") {
    return <div className="p-4">Access Denied</div>;
  }

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-gray-500 text-sm">Enable email and Slack notifications for high-risk operations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.enableNotifications}
              onChange={e => handleSettingChange("enableNotifications", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Audit Logging</h3>
            <p className="text-gray-500 text-sm">Log all administrative actions for security tracking</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.enableAuditLog}
              onChange={e => handleSettingChange("enableAuditLog", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <h3 className="font-medium mb-2">Users Per Page</h3>
          <p className="text-gray-500 text-sm mb-2">Number of users to display per page in user management</p>
          <select 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={settings.maxUsersPerPage}
            onChange={e => handleSettingChange("maxUsersPerPage", parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="pt-4">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => alert("Settings saved!")}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 