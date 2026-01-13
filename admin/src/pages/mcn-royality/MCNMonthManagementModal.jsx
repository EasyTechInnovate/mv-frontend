import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

export default function MCNMonthManagementModal({ theme = "light", data = [], onBack }) {
  const isDark = theme === "dark";

  // State
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All Users");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const dropdownRef = useRef();

  // Safely handle data
  const analyticsData = Array.isArray(data) ? data : [];

  // Stats
  const totalRecords = analyticsData.length;
  const totalUnits = analyticsData.reduce((sum, r) => sum + (r.totalUnits || 0), 0);
  const totalRevenue = analyticsData.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const activeRecords = analyticsData.filter((r) => r.active).length;

  // Unique Dropdown Options
  const uniqueUsers = useMemo(() => ["All Users", ...new Set(analyticsData.map((i) => i.user))], [analyticsData]);
  const uniqueMonths = useMemo(() => ["All Months", ...new Set(analyticsData.map((i) => i.month))], [analyticsData]);
  const uniqueTypes = useMemo(() => ["All Types", ...new Set(analyticsData.map((i) => i.usageType))], [analyticsData]);

  // Filtering Logic
  const filteredData = useMemo(() => {
  return analyticsData.filter((item) => {
    const query = search.toLowerCase();

    // ✅ Search across multiple fields that exist in your data
    const matchesSearch =
      item.trackTitle?.toLowerCase().includes(query) ||
      item.artist?.toLowerCase().includes(query) ||
      item.label?.toLowerCase().includes(query) ||
      item.album?.toLowerCase().includes(query) ||
      item.licensor?.toLowerCase().includes(query) ||
      item.licence?.toLowerCase().includes(query);

    const matchesUser =
      userFilter === "All Users" || item.user === userFilter; // keep if you have user field in data
    const matchesMonth =
      monthFilter === "All Months" || item.month === monthFilter;
    const matchesType =
      typeFilter === "All Types" || item.usageType === typeFilter;
    const matchesAccount =
      accountFilter === "All Accounts" || item.accountId === accountFilter;

    return matchesSearch && matchesUser && matchesMonth && matchesType && matchesAccount;
  });
}, [analyticsData, search, userFilter, monthFilter, typeFilter, accountFilter]);


  const handleExport = () => {
    console.log("Export clicked");
    // TODO: implement CSV/Excel export
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // close dropdowns if you add custom ones later
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`p-4 md:p-6 space-y-6 min-h-[80vh] rounded-2xl shadow-lg transition-colors duration-300 ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-white text-[#151F28]"
      }`}
    >
      {/* Header */}  
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isDark ? "border border-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
          }`}
        >
          ← Back
        </button>
        <div>
          <h1 className="text-xl font-semibold">MCN Royalty Overview</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
            View, filter and analyze your distribution data
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: totalRecords },
          { label: "Total Units", value: totalUnits },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "text-green-500" },
          { label: "Active Records", value: activeRecords },
        ].map((stat, i) => (
          <div key={i} className={`rounded-lg p-4 shadow-md ${isDark ? "bg-[#151F28]" : "bg-gray-50"}`}>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
            <p className={`text-xl font-semibold ${stat.color || ""}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search + Export */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-[40%]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name, ID, or description..."
            className={`h-9 text-sm w-full ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full md:w-[60%]">
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className={`rounded-md px-3 py-1 text-sm ${isDark ? "bg-[#151F28] border-gray-700" : "bg-white border border-gray-300"}`}>
            {uniqueUsers.map((u, idx) => (
              <option key={idx}>{u}</option>
            ))}
          </select>

          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className={`rounded-md px-3 py-1 text-sm ${isDark ? "bg-[#151F28] border-gray-700" : "bg-white border border-gray-300"}`}>
            {uniqueMonths.map((m, idx) => (
              <option key={idx}>{m}</option>
            ))}
          </select>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`rounded-md px-3 py-1 text-sm ${isDark ? "bg-[#151F28] border-gray-700" : "bg-white border border-gray-300"}`}>
            {uniqueTypes.map((t, idx) => (
              <option key={idx}>{t}</option>
            ))}
          </select>

          <Button onClick={handleExport} variant="outline" className="h-9 px-4 flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg shadow-md p-4 ${isDark ? "bg-[#151F28]" : "bg-gray-50"}`}>
        <h2 className="text-lg font-semibold mb-1">Pending Bonus Payments</h2>
        <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Royalties awaiting approval and processing
        </p>

        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-sm min-w-[1400px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
              <tr>
                {[
                  "Licence",
                  "Licensor",
                  "Music Service",
                  "Month",
                  "Account ID",
                  "Label",
                  "Artist",
                  "Track Title",
                  "Album",
                  "UPC",
                  "ISRC",
                  "Total Units",
                  "SR (₹)",
                  "Country",
                  "Usage Type",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={17} className="text-center py-12 text-gray-500">
                    No data available. Import a CSV/Excel to populate this table.
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr key={r.id} className={`border-t hover:bg-gray-800/30 transition ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <td className="px-4 py-3">{r.licence}</td>
                    <td className="px-4 py-3">{r.licensor}</td>
                    <td className="px-4 py-3">{r.musicService}</td>
                    <td className="px-4 py-3">{r.month}</td>
                    <td className="px-4 py-3">{r.accountId}</td>
                    <td className="px-4 py-3">{r.label}</td>
                    <td className="px-4 py-3">{r.artist}</td>
                    <td className="px-4 py-3">{r.trackTitle}</td>
                    <td className="px-4 py-3">{r.album}</td>
                    <td className="px-4 py-3">{r.upc}</td>
                    <td className="px-4 py-3">{r.isrc}</td>
                    <td className="px-4 py-3">{Number(r.totalUnits || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">{Number(r.sr || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">{r.country}</td>
                    <td className="px-4 py-3">{r.usageType}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-green-900/30">{r.status || "Active"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:underline">Edit</button>
                        <button className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
