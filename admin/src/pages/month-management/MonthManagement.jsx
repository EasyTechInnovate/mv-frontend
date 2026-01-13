"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, CheckCircle2, BarChart3 } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";

import AnalyticsMonthManagement from "../../components/month-management/AnalyticsMonthManagement";
import RoyaltyMonthManagement from "../../components/month-management/RoyaltyMonthManagement";
import BonusMonthManagement from "../../components/month-management/BonusMonthManagement";
import McnRoyaltyMonthManagement from "../../components/month-management/McnRoyaltyMonthManagement";
import AddMonthModal from "../../components/month-management/MonthModal";

export default function MonthManagement({ theme }) {
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showAnalyticsPage, setShowAnalyticsPage] = useState(false);
  const [showRoyaltyPage, setShowRoyaltyPage] = useState(false);
  const [showBonusPage, setShowBonusPage] = useState(false);
  const [showMcnRoyaltyPage, setShowMcnRoyaltyPage] = useState(false);

  // 🔥 Fetch Stats From API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await GlobalApi.getMonthsStats();
        setStats(res.data.data);
      } catch (err) {
        console.log("Error loading stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (showAnalyticsPage) {
    return <AnalyticsMonthManagement theme={theme} onBack={() => setShowAnalyticsPage(false)} />;
  }

  if (showRoyaltyPage) {
    return <RoyaltyMonthManagement theme={theme} onBack={() => setShowRoyaltyPage(false)} />;
  }

  if (showBonusPage) {
    return <BonusMonthManagement theme={theme} onBack={() => setShowBonusPage(false)} />;
  }

  if (showMcnRoyaltyPage) {
    return <McnRoyaltyMonthManagement theme={theme} onBack={() => setShowMcnRoyaltyPage(false)} />;
  }

  return (
    <div
      className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
      }`}
    >
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Month Management</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Organize monthly royalty and analytics data
          </p>
        </div>

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Month
        </Button>
      </div>

      {/* ---------------- Stats Section ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ---------- Overview Stats ---------- */}
        <div
          className={`rounded-lg p-4 shadow-md flex flex-col gap-2 ${
            isDark ? "bg-[#151F28]" : "bg-white"
          }`}
        >
          <Calendar className="h-6 w-6 opacity-70" />
          <p className="text-sm opacity-70">Total Months</p>
          <p className="text-2xl font-semibold">
            {loadingStats ? "..." : stats?.overview?.totalMonths}
          </p>
        </div>

        <div
          className={`rounded-lg p-4 shadow-md flex flex-col gap-2 ${
            isDark ? "bg-[#151F28]" : "bg-white"
          }`}
        >
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <p className="text-sm opacity-70">Active Months</p>
          <p className="text-2xl font-semibold text-green-400">
            {loadingStats ? "..." : stats?.overview?.activeMonths}
          </p>
        </div>

        <div
          className={`rounded-lg p-4 shadow-md flex flex-col gap-2 ${
            isDark ? "bg-[#151F28]" : "bg-white"
          }`}
        >
          <BarChart3 className="h-6 w-6 text-red-400" />
          <p className="text-sm opacity-70">Inactive Months</p>
          <p className="text-2xl font-semibold text-red-400">
            {loadingStats ? "..." : stats?.overview?.inactiveMonths}
          </p>
        </div>

        {/* ---------- Type-Based Summary ---------- */}
        <div
          className={`rounded-lg p-4 shadow-md flex flex-col gap-3 ${
            isDark ? "bg-[#151F28]" : "bg-white"
          }`}
        >
          <p className="text-sm opacity-70">By Type</p>

          {loadingStats ? (
            <p className="opacity-50 text-sm">Loading...</p>
          ) : (
            stats?.byType?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="capitalize">{item.type}</span>
                <span className="font-semibold">
                  {item.active}/{item.total} active
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------------- Search Bar ---------------- */}
      <Input
        placeholder="Search months..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full ${
          isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"
        }`}
      />

      {/* ---------------- List of Month Types ---------------- */}
      <div
        className={`rounded-lg shadow-md p-4 ${
          isDark ? "bg-[#151F28]" : "bg-white"
        }`}
      >
        <h2 className="text-sm font-semibold mb-3">Month Types</h2>

        <ul className="divide-y divide-gray-700 dark:divide-gray-700">
          <li
            className="p-3 text-sm cursor-pointer hover:bg-gray-700/40"
            onClick={() => setShowAnalyticsPage(true)}
          >
            Analytics Month Management
          </li>

          <li
            className="p-3 text-sm cursor-pointer hover:bg-gray-700/40"
            onClick={() => setShowRoyaltyPage(true)}
          >
            Royalty Month Management
          </li>

          <li
            className="p-3 text-sm cursor-pointer hover:bg-gray-700/40"
            onClick={() => setShowBonusPage(true)}
          >
            Bonus Royalty Month Management
          </li>

          <li
            className="p-3 text-sm cursor-pointer hover:bg-gray-700/40"
            onClick={() => setShowMcnRoyaltyPage(true)}
          >
            MCN Royalty Month Management
          </li>
        </ul>
      </div>

      {showAddModal && (
        <AddMonthModal
          theme={theme}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
