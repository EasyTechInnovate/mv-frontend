import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Edit } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import jsonToCsv, { exportToCsv } from "@/lib/csv";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function KycManagement({ theme }) {
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    artists: 0,
    labels: 0,
  });

  const fetchKycData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (statusFilter !== "all") {
        params.isActive = statusFilter;
      }
      if (typeFilter !== "all") {
        params.userType = typeFilter;
      }
      const res = await GlobalApi.getKycUsers(params);
      const data = res.data.data;
      setKycData(data.users || []);
      setPagination(data.pagination || { totalPages: 1, totalItems: 0 });
      
      // I am assuming the stats will come from a separate endpoint or calculated here.
      // For now, I'll calculate from the fetched data, but this is not ideal for pagination.
      // A dedicated stats endpoint would be better.
      setStats({
        totalUsers: data.pagination.totalCount || 0,
        activeUsers: data.users.filter(u => u.isActive).length,
        artists: data.users.filter(u => u.userType === "Artist").length,
        labels: data.users.filter(u => u.userType === "Label").length,
      })

    } catch (err) {
      console.error("Failed to load KYC data:", err);
      toast.error("Failed to load KYC data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, [page, debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, typeFilter]);


  const badgeClass = (bg, text) =>
    `px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${bg} ${text}`;

  const accountBadge = (type) => {
    switch (type) {
      case "artist": return badgeClass("bg-purple-500/20", "text-purple-400");
      case "label": return badgeClass("bg-blue-500/20", "text-blue-400");
      default: return badgeClass("bg-orange-500/20", "text-orange-400");
    }
  };

  const statusBadge = (status) =>
    status 
      ? badgeClass("bg-green-500/20", "text-green-400")
      : badgeClass("bg-red-500/20", "text-red-400");

  const membershipBadge = (membership) => {
    if (membership === "Not Applicable") {
      return badgeClass("bg-gray-500/20", "text-gray-400");
    }
    return membership === "active"
      ? badgeClass("bg-green-500/20", "text-green-400")
      : badgeClass("bg-red-500/20", "text-red-400");
  };

  const handleExport = () => {
    if (kycData.length === 0) {
      toast.warning("No data to export.");
      return;
    }

    const headers = [
      { label: "S.No.", key: "sno" },
      { label: "Account ID", key: "id" },
      { label: "User Name", key: "userName" },
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

    const dataToExport = kycData.map((row, index) => ({
      ...row,
      sno: index + 1,
      id: row.accountId,
      userName: `${row.personalInfo.firstName} ${row.personalInfo.lastName}`,
      stageName: `${row.personalInfo.firstName} ${row.personalInfo.lastName}`,
      accountType: row.userType,
      status: row.isActive ? 'Active' : 'Inactive',
      email: row.emailAddress,
      aadhaar: row.kyc?.aadhaar?.number || 'N/A',
      pan: row.kyc?.pan?.number || 'N/A',
      bankInfo: row.bankInfo?.bankName || 'N/A',
      kycStatus: row.kyc?.status || 'Pending',
      joinDate: new Date(row.createdAt).toLocaleDateString(),
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
          { label: "Total Users", value: stats.totalUsers },
          { label: "Active Users", value: stats.activeUsers, color: "text-green-500" },
          { label: "Artists", value: stats.artists },
          { label: "Labels", value: stats.labels },
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
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
          >
            <option value="all">All Types</option>
            <option value="Artist">Artist</option>
            <option value="Label">Label</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-x-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
      {loading ? (
          <div className="p-6 text-center text-gray-400">Loading KYC data...</div>
        ) : (
        <table className="w-full text-sm min-w-[900px]">
          <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
            <tr>
              {["Account ID", "User Name", "Stage Name", "Account Type", "Status", "Membership Status", "Email", "Adhaar Number", "Pan Number", "Bank Information", "KYC Status", "Join Date", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kycData.length > 0 ? kycData.map((u) => (
              <tr key={u._id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <td className="px-4 py-3">{u.accountId}</td>
                <td className="px-4 py-3 whitespace-nowrap">{`${u.firstName || ""} ${u.lastName || ""}`}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={u.personalInfo?.profileImage || '/avatar-placeholder.png'} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
                  {u.personalInfo?.firstName} {u.personalInfo?.lastName}
                </td>
                <td className="px-4 py-3"><span className={accountBadge(u.userType)}>{u.userType}</span></td>
                <td className="px-4 py-3"><span className={statusBadge(u.isActive)}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3"><span className={membershipBadge(u.subscription?.status || "Not Applicable")}>{u.subscription?.status || "Not Applicable"}</span></td>
                <td className="px-4 py-3">{u.emailAddress}</td>
                <td className="px-4 py-3">{u.kyc?.aadhaar?.number || 'N/A'}</td>
                <td className="px-4 py-3">{u.kyc?.pan?.number || 'N/A'}</td>
                <td className="px-4 py-3">{u.bankInfo?.bankName || 'N/A'}</td>
                <td className="px-4 py-3"><span className={statusBadge(u.kyc?.status === 'verified')}>{u.kyc?.status || 'Pending'}</span></td>
                <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant={isDark ? "outline" : "secondary"} className="rounded-full px-4 flex items-center gap-1">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="12" className="text-center py-6 text-gray-400">
                  No KYC data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <Button
            disabled={page === 1}
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            disabled={page >= pagination.totalPages}
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
