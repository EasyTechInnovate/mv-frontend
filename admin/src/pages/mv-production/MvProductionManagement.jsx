import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Music, MoreHorizontal, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi"; 
import MVProductionUserPage from "@/components/mv-production/MVProductionUserPage"; 
import ConfirmDialog from "@/components/common/ConfirmDialog";
export default function MVProductionManagement({ theme = "dark" }) {
  const isDark = theme === "dark";

  
  const containerBg = isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]";
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const inputCls = isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300 text-black";
  const tableBorder = isDark ? "border-gray-700" : "border-gray-200";

 
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;
  
  const [activePage, setActivePage] = useState("list");
  const [selectedProduction, setSelectedProduction] = useState(null);
 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      };
      const res = await GlobalApi.getAllMVProductions(params);
      const data = res?.data?.data || {};
      setProductions(data.productions || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("API ERROR →", err);
      toast.error(err?.response?.data?.message || "Failed to load productions");
      setProductions([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, [currentPage, debouncedSearch, statusFilter]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  
  const stats = [
    { label: "Total Productions", value: pagination?.totalCount || 0 },
    { label: "Pending", value: productions.filter((p) => p.status === "pending").length },
    { label: "Accepted", value: productions.filter((p) => p.status === "accept").length },
    { label: "Rejected", value: productions.filter((p) => p.status === "reject").length },
  ];

 
  const handleViewDetails = (prod) => {
    setSelectedProduction(prod);
    setActivePage("modal");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleBack = () => {
    setActivePage("list");
    setSelectedProduction(null);
  };

  const handleRefreshAfterUpdate = () => {
  fetchProductions(); 
};

const handleDeleteConfirm = async () => {
  if (!itemToDelete) return;
  setDeleteLoading(true);

  try {
    await GlobalApi.deleteMVProduction(itemToDelete._id);

    toast.success("MV Production deleted successfully");

    setShowDeleteDialog(false);
    setItemToDelete(null);

    fetchProductions();
  } catch (err) {
    console.error("DELETE ERROR →", err);
    toast.error(err?.response?.data?.message || "Failed to delete");
  } finally {
    setDeleteLoading(false);
  }
};


  
  if (activePage === "modal") {
    return (
      <MVProductionUserPage
        theme={theme}
        defaultData={selectedProduction} 
        onBack={handleBack}
         onRefresh={handleRefreshAfterUpdate}
      />
    );
  }

  
  return (
    <div className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${containerBg}`}>
     
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">MV Production Management</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage music & video production proposals
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={isDark ? "outline" : "secondary"} className="flex items-center gap-2 rounded-full px-5">
            <Upload className="h-4 w-4" /> Import CSV/Excel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5">
            + Add New Production
          </Button>
        </div>
      </div>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-lg p-4 shadow-md ${cardBg}`}>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <Input
          placeholder="Search by account id, account name, project title, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full md:w-1/3 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}`}
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accept">Accepted</option>
            <option value="reject">Rejected</option>
          </select>

          <Button variant={isDark ? "outline" : "secondary"} className="flex items-center gap-2 px-5">
            <Upload className="h-4 w-4" /> Bulk Action
          </Button>
        </div>
      </div>

  
<div className={`rounded-lg shadow-md w-full overflow-x-auto ${cardBg}`}>
  <table className={`w-full min-w-full text-sm`}>
    <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
      <tr>
        {[
          "Account ID",
          "Account Name",
          "Project Title",
          "Budget",
          "Email",
          "Status",
          "Submitted",
          "Actions",
        ].map((h) => (
          <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
            {h}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan={8} className="text-center py-6 text-gray-400">
            Loading...
          </td>
        </tr>
      ) : productions.length === 0 ? (
        <tr>
          <td colSpan={8} className="text-center py-6 text-gray-400 italic">
            No records found
          </td>
        </tr>
      ) : (
        productions.map((p) => {
          const accountName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
          const projectTitle = p.projectOverview?.projectTitle || "-";
          const budget = p.budgetRequestAndOwnershipProposal?.totalBudgetRequested ?? "-";
          const email = p.userId?.emailAddress || "-";
          const status = p.status || "pending";

          return (
            <tr
              key={p._id}
              className={`border-t ${tableBorder} ${
                isDark ? "hover:bg-gray-800/10" : "hover:bg-gray-100"
              }`}
            >
              <td className="px-4 py-3 font-medium">{p.accountId || "-"}</td>
              <td className="px-4 py-3">{accountName || "-"}</td>
              <td className="px-4 py-3">{projectTitle}</td>

              <td className="px-4 py-3">
                {"₹" +
                  (typeof budget === "number"
                    ? budget.toLocaleString("en-IN")
                    : budget)}
              </td>

              <td className="px-4 py-3">{email}</td>

              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize ${
                    status === "accept"
                      ? "bg-green-600/20 text-green-400"
                      : status === "reject"
                      ? "bg-red-600/20 text-red-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  {status}
                </span>
              </td>

              <td className="px-4 py-3">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>

             <td className="px-4 py-3 whitespace-nowrap flex gap-2">

  
  <Button
    size="sm"
    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 rounded-full px-5"
    onClick={() => handleViewDetails(p)}
  >
    <Music className="h-4 w-4" />
    MV Production
  </Button>

  
  <Button
    size="sm"
    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4"
    onClick={() => {
      setItemToDelete(p);
      setShowDeleteDialog(true);
    }}
  >
    Delete
  </Button>
</td>

            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>


   
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} productions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={pageNum === currentPage ? `bg-purple-600 hover:bg-purple-700 ${isDark ? "text-white" : ""}` : (isDark ? "text-white bg-[#151F28] border-gray-700" : "")}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {showDeleteDialog && (
  <ConfirmDialog
    theme={theme}
    title="Delete MV Production"
    message={`Are you sure you want to delete this MV Production?\nThis action cannot be undone.`}
    confirmLabel="Delete"
    cancelLabel="Cancel"
    loading={deleteLoading}
    
    onConfirm={handleDeleteConfirm}
    onCancel={() => {
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }}
  />
)}
    </div>
  );
}
