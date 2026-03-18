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
import { Music, MoreHorizontal, Upload, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, CheckSquare, ListChecks } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi"; 
import MVProductionUserPage from "@/components/mv-production/MVProductionUserPage"; 
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Bulk actions state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

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
    setSelectedIds([]); // Clear selection when page changes
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

const toggleSelection = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

const toggleAll = () => {
  if (selectedIds.length === productions.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(productions.map((p) => p._id));
  }
};

const handleBulkDeleteAction = async () => {
  if (!selectedIds.length) return;
  if (!window.confirm(`Are you sure you want to permanently delete these ${selectedIds.length} productions?`)) {
    return;
  }

  try {
    await GlobalApi.bulkDeleteMVProductions({ productionIds: selectedIds });
    toast.success("Productions permanently deleted");
    setSelectedIds([]);
    setBulkMode(false);
    fetchProductions();
  } catch (err) {
    console.error("Bulk delete error:", err);
    toast.error(err?.response?.data?.message || "Failed to perform bulk delete");
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
          <Button
            variant={isDark ? "outline" : "secondary"}
            className="flex items-center gap-2 rounded-full px-5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
          {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5">
            + Add New Production
          </Button> */}
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

          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedIds([]);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition ${
              bulkMode ? "bg-red-100 text-red-700" : isDark ? "bg-[#1C252E] hover:bg-gray-700 border border-gray-700" : "bg-white hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <ListChecks className="w-4 h-4" />
            {bulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
          </button>
          {bulkMode && selectedIds.length > 0 && (
            <button
              onClick={handleBulkDeleteAction}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

  
<div className={`rounded-lg shadow-md w-full overflow-x-auto ${cardBg}`}>
  <table className={`w-full min-w-full text-sm`}>
    <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
      <tr>
        {bulkMode && (
          <th className="px-4 py-3 w-12">
            <input
              type="checkbox"
              checked={productions.length > 0 && selectedIds.length === productions.length}
              onChange={toggleAll}
              className="w-4 h-4 cursor-pointer accent-red-600 rounded border-gray-400"
            />
          </th>
        )}
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
              } ${selectedIds.includes(p._id) ? (isDark ? "bg-red-900/10" : "bg-red-50") : ""}`}
            >
              {bulkMode && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p._id)}
                    onChange={() => toggleSelection(p._id)}
                    className="w-4 h-4 cursor-pointer accent-red-600 rounded border-gray-400"
                  />
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-3 font-medium">{p.accountId || "-"}</td>
              <td className="whitespace-nowrap px-4 py-3">{accountName || "-"}</td>
              <td className="whitespace-nowrap px-4 py-3">{projectTitle}</td>

              <td className="whitespace-nowrap px-4 py-3">
                {"₹" +
                  (typeof budget === "number"
                    ? budget.toLocaleString("en-IN")
                    : budget)}
              </td>

              <td className="whitespace-nowrap px-4 py-3">{email}</td>

              <td className="whitespace-nowrap px-4 py-3">
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

              <td className="whitespace-nowrap px-4 py-3">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>

              <td className="whitespace-nowrap px-4 py-3  flex gap-2 items-center ">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(p)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(p)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
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
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalCount || 0}
        headers={[
          { label: "S.No.", key: "sno" },
          // Identity
          { label: "Account ID", key: "accountId" },
          { label: "Account Name", key: "accountName" },
          { label: "Email", key: "email" },
          // Owner Info
          { label: "Copyright Owner", key: "copyrightOwnerName" },
          { label: "Mobile Number", key: "mobileNumber" },
          { label: "Copyright Email", key: "emailOfCopyrightHolder" },
          // Project Overview
          { label: "Project Title", key: "projectTitle" },
          { label: "Artist Name", key: "artistName" },
          { label: "Label Name", key: "labelName" },
          { label: "Genre", key: "genres" },
          { label: "Mood", key: "mood" },
          { label: "Theme", key: "theme" },
          { label: "Language", key: "language" },
          { label: "Release Timeline", key: "releaseTimeline" },
          { label: "Part of Album/EP", key: "isPartOfAlbumOrEP" },
          { label: "Location Preference", key: "locationPreference" },
          // Budget
          { label: "Total Budget (₹)", key: "totalBudgetRequested" },
          { label: "Ownership Dilution (%)", key: "proposedOwnershipDilution" },
          { label: "Pre-Production (₹)", key: "preProduction" },
          { label: "Shoot Day (₹)", key: "shootDay" },
          { label: "Post-Production (₹)", key: "postProduction" },
          { label: "Misc/Contingency (₹)", key: "miscellaneousContingency" },
          { label: "Personal Funds", key: "willContributePersonalFunds" },
          { label: "Personal Funds Amount (₹)", key: "personalFundsAmount" },
          { label: "Revenue Sharing Model", key: "revenueSharingModelProposed" },
          // Marketing
          { label: "MV Distribution", key: "willBeReleasedViaMVDistribution" },
          { label: "Brand/Merch Tie-Ins", key: "anyBrandOrMerchTieIns" },
          { label: "Brand Description", key: "brandOrMerchTieInsDescription" },
          { label: "Ads/Influencer Campaigns", key: "planToRunAdsOrInfluencerCampaigns" },
          // Legal
          { label: "Full Creative Ownership", key: "confirmFullCreativeOwnership" },
          { label: "Credit MV Production", key: "agreeToCreditMVProduction" },
          { label: "Share Final Assets", key: "agreeToShareFinalAssets" },
          { label: "NDA Required", key: "requireNDAOrCustomAgreement" },
          // Status
          { label: "Status", key: "status" },
          { label: "Rejection Reason", key: "rejectionReason" },
          { label: "Admin Notes", key: "adminNotes" },
          { label: "Submitted", key: "submittedDate" },
        ]}
        fetchData={async (page, limit) => {
          try {
            const params = {
              page,
              limit,
              status: statusFilter === "all" ? undefined : statusFilter,
              search: debouncedSearch || undefined,
            };
            const res = await GlobalApi.getAllMVProductions(params);
            const data = res?.data?.data || {};
            const productionsToExport = data.productions || [];

            const yn = (val) => (val ? "Yes" : "No");
            const toTitleCase = (str) =>
              str ? String(str).toLowerCase().split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "—";

            return productionsToExport.map((p) => ({
              accountId: p.accountId || "—",
              accountName: `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim() || "—",
              email: p.userId?.emailAddress || "—",
              // Owner Info
              copyrightOwnerName: p.ownerInfo?.copyrightOwnerName || "—",
              mobileNumber: p.ownerInfo?.mobileNumber || "—",
              emailOfCopyrightHolder: p.ownerInfo?.emailOfCopyrightHolder || "—",
              // Project Overview
              projectTitle: p.projectOverview?.projectTitle || "—",
              artistName: p.projectOverview?.artistName || "—",
              labelName: p.projectOverview?.labelName || "—",
              genres: Array.isArray(p.projectOverview?.genres)
                ? p.projectOverview.genres.map(toTitleCase).join(", ")
                : toTitleCase(p.projectOverview?.genres) || "—",
              mood: toTitleCase(p.projectOverview?.mood) || "—",
              theme: toTitleCase(p.projectOverview?.theme) || "—",
              language: toTitleCase(p.projectOverview?.language) || "—",
              releaseTimeline: p.projectOverview?.releaseTimeline || "—",
              isPartOfAlbumOrEP: yn(p.projectOverview?.isPartOfAlbumOrEP),
              locationPreference: Array.isArray(p.projectOverview?.locationPreference)
                ? p.projectOverview.locationPreference.map(toTitleCase).join(", ")
                : "—",
              // Budget
              totalBudgetRequested: p.budgetRequestAndOwnershipProposal?.totalBudgetRequested ?? "—",
              proposedOwnershipDilution: p.budgetRequestAndOwnershipProposal?.proposedOwnershipDilution ?? "—",
              preProduction: p.budgetRequestAndOwnershipProposal?.breakdown?.preProduction ?? "—",
              shootDay: p.budgetRequestAndOwnershipProposal?.breakdown?.shootDay ?? "—",
              postProduction: p.budgetRequestAndOwnershipProposal?.breakdown?.postProduction ?? "—",
              miscellaneousContingency: p.budgetRequestAndOwnershipProposal?.breakdown?.miscellaneousContingency ?? "—",
              willContributePersonalFunds: yn(p.budgetRequestAndOwnershipProposal?.willContributePersonalFunds),
              personalFundsAmount: p.budgetRequestAndOwnershipProposal?.personalFundsAmount || "—",
              revenueSharingModelProposed: p.budgetRequestAndOwnershipProposal?.revenueSharingModelProposed || "—",
              // Marketing
              willBeReleasedViaMVDistribution: yn(p.marketingAndDistributionPlan?.willBeReleasedViaMVDistribution),
              anyBrandOrMerchTieIns: yn(p.marketingAndDistributionPlan?.anyBrandOrMerchTieIns),
              brandOrMerchTieInsDescription: p.marketingAndDistributionPlan?.brandOrMerchTieInsDescription || "—",
              planToRunAdsOrInfluencerCampaigns: yn(p.marketingAndDistributionPlan?.planToRunAdsOrInfluencerCampaigns),
              // Legal
              confirmFullCreativeOwnership: yn(p.legalAndOwnershipDeclaration?.confirmFullCreativeOwnership),
              agreeToCreditMVProduction: yn(p.legalAndOwnershipDeclaration?.agreeToCreditMVProduction),
              agreeToShareFinalAssets: yn(p.legalAndOwnershipDeclaration?.agreeToShareFinalAssets),
              requireNDAOrCustomAgreement: yn(p.legalAndOwnershipDeclaration?.requireNDAOrCustomAgreement),
              // Status
              status: p.status || "pending",
              rejectionReason: p.rejectionReason || "—",
              adminNotes: p.adminNotes || "—",
              submittedDate: new Date(p.createdAt).toLocaleDateString(),
            }));
          } catch (err) {
            toast.error("Failed to fetch data for export.");
            return [];
          }
        }}
        filename="mv_productions"
        title="Export MV Productions"
        description="Select a data range to export as a CSV file."
      />
    </div>
  );
}
