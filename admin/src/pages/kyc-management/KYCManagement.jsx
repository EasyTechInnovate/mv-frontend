import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Edit } from "lucide-react";
import { mockKycData } from "./KYCManagementData";
import jsonToCsv, { exportToCsv } from "@/lib/csv";
import { toast } from "sonner";

export default function KycManagement({ theme }) {
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [kycData] = useState(mockKycData);

  // Stats
  const totalUsers = kycData.length;
  const activeUsers = kycData.filter(u => u.status === "Active").length;
  const artists = kycData.filter(u => u.accountType === "Artist").length;
  const labels = kycData.filter(u => u.accountType === "Label").length;

  // Filters
  const filteredData = kycData.filter(u =>
    u.stageName.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Badge classes
  const badgeClass = (bg, text) =>
    `px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${bg} ${text}`;

  const accountBadge = (type) => {
    switch (type) {
      case "Artist": return badgeClass("bg-purple-500/20", "text-purple-400");
      case "Label": return badgeClass("bg-blue-500/20", "text-blue-400");
      default: return badgeClass("bg-orange-500/20", "text-orange-400");
    }
  };

  const statusBadge = (status) =>
    status === "Active"
      ? badgeClass("bg-green-500/20", "text-green-400")
      : badgeClass("bg-red-500/20", "text-red-400");

  const membershipBadge = (membership) => {
    if (membership === "Not Applicable") {
      return badgeClass("bg-gray-500/20", "text-gray-400");
    }
    return membership === "Active"
      ? badgeClass("bg-green-500/20", "text-green-400")
      : badgeClass("bg-red-500/20", "text-red-400");
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.warning("No data to export.");
      return;
    }

    const headers = [
      { label: "S.No.", key: "sno" },
      { label: "User ID", key: "id" },
      { label: "Stage Name", key: "stageName" },
      { label: "Account Type", key: "accountType" },
      { label: "Status", key: "status" },
      { label: "Membership Status", key: "membershipStatus" },
      { label: "Email", key: "email" },
      { label: "Aadhaar Number", key: "aadhaar" },
      { label: "PAN Number", key: "pan" },
      { label: "Bank Information", key: "bankInfo" },
      { label: "KYC Status", key: "kycStatus" },
      { label: "Join Date", key: "joinDate" },
    ];

    const dataToExport = filteredData.map((row, index) => ({
      ...row,
      sno: index + 1,
    }));

    const csvString = jsonToCsv(dataToExport, headers);
    exportToCsv("kyc_management.csv", csvString);
    toast.success(`${dataToExport.length} records exported successfully.`);
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">KYC Management</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage artists, labels, and aggregators in Maheshwari Visuals
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={isDark ? "outline" : "secondary"} 
            className="flex items-center gap-2 rounded-full px-5"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5">
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Active Users", value: activeUsers, color: "text-green-500" },
          { label: "Artists", value: artists },
          { label: "Labels", value: labels },
        ].map((stat, i) => (
          <div key={i} className={`rounded-lg p-4 shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color || ""}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <Input
          placeholder="Search users by name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}`}
        />
        <div className="flex flex-wrap gap-2">
          <select className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}>
            <option>All Status</option>
          </select>
          <select className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}>
            <option>All Types</option>
          </select>
          {/* <Button variant={isDark ? "outline" : "secondary"} className="flex items-center gap-2 rounded-full px-5">
            <Download className="h-4 w-4" /> Export
          </Button> */}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-x-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
        <table className="w-full text-sm min-w-[900px]">
          <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
            <tr>
              {["User ID", "Stage Name", "Account Type", "Status", "Membership Status", "Email", "Adhaar Number", "Pan Number", "Bank Information", "KYC Status", "Join Date", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((u) => (
              <tr key={u.id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={u.avatar} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
                  {u.stageName}
                </td>
                <td className="px-4 py-3"><span className={accountBadge(u.accountType)}>{u.accountType}</span></td>
                <td className="px-4 py-3"><span className={statusBadge(u.status)}>{u.status}</span></td>
                <td className="px-4 py-3"><span className={membershipBadge(u.membershipStatus)}>{u.membershipStatus}</span></td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.aadhaar}</td>
                <td className="px-4 py-3">{u.pan}</td>
                <td className="px-4 py-3">{u.bankInfo}</td>
                <td className="px-4 py-3"><span className={statusBadge(u.kycStatus)}>{u.kycStatus}</span></td>
                <td className="px-4 py-3">{u.joinDate}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant={isDark ? "outline" : "secondary"} className="rounded-full px-4 flex items-center gap-1">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
