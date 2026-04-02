import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search, Trash2, ListChecks } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import AggregatorRequestReviewModal from "@/components/aggregator-management/AggregatorRequestReviewModal";
import CreateAccountModal from "@/components/aggregator-management/CreateAccountModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import AddNewAggregatorRequestModal from "@/components/aggregator-management/AddNewAggregatorRequestModal";

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

export default function AggregatorManagement({ theme }) {
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [selectedAppIdForCreation, setSelectedAppIdForCreation] = useState(null);
  const [isAddNewAggregatorModalOpen, setIsAddNewAggregatorModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);


  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: debouncedSearch,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const res = await GlobalApi.getAllAggregatorApplications(params);
      const data = res.data.data;
      setApplications(data.applications || []);
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalApplications || data.pagination?.totalCount || data.pagination?.totalItems || 0,
      });
      // setSelectedIds([]); // Removed to allow selection across pages
    } catch (err) {
      console.error("Failed to load applications:", err);
      toast.error("Failed to load aggregator applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleView = (appId) => {
    setSelectedAppId(appId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppId(null);
  };

  const handleReviewed = () => {
    fetchApplications();
  };

  const handleOpenCreateAccount = (appId) => {
    setSelectedAppIdForCreation(appId);
    setIsCreateAccountModalOpen(true);
  };

  const handleAccountCreated = () => {
    fetchApplications();
  };

  const handleApplicationCreated = () => {
    fetchApplications();
  };

  const handleSelectAll = (e) => {
    // Only select/deselect icons that are on the current page and NOT restricted (account created)
    const deletableOnPage = applications
      .filter(app => !app.isAccountCreated)
      .map(app => app._id);

    if (e.target.checked) {
      setSelectedIds(prev => [...new Set([...prev, ...deletableOnPage])]);
    } else {
      setSelectedIds(prev => prev.filter(id => !deletableOnPage.includes(id)));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this application?")) {
      try {
        await GlobalApi.deleteAggregatorApplication(id);
        toast.success("Application deleted successfully");
        setSelectedIds(prev => prev.filter(i => i !== id)); // Remove from selection
        fetchApplications();
      } catch (err) {
        toast.error("Failed to delete application");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} applications?`)) {
      try {
        await GlobalApi.bulkDeleteAggregatorApplications({ applicationIds: selectedIds });
        toast.success("Applications deleted successfully");
        setSelectedIds([]); // Clear all selections
        fetchApplications();
      } catch (err) {
        toast.error("Failed to delete applications");
      }
    }
  };


  const exportHeaders = [
    { label: "S.No.", key: "sno" },
    { label: "Name", key: "name" },
    { label: "Email", key: "emailAddress" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Company", key: "companyName" },
    { label: "Website", key: "websiteLink" },
    { label: "Instagram", key: "instagramUrl" },
    { label: "Facebook", key: "facebookUrl" },
    { label: "LinkedIn", key: "linkedinUrl" },
    { label: "YouTube", key: "youtubeLink" },
    { label: "Total Releases", key: "totalReleases" },
    { label: "Release Frequency", key: "releaseFrequency" },
    { label: "Monthly Plans", key: "monthlyReleasePlans" },
    { label: "Additional Services", key: "formattedServices" },
    { label: "How Did You Know", key: "howDidYouKnow" },
    { label: "Brief Info", key: "briefInfo" },
    { label: "Status", key: "applicationStatus" },
    { label: "Account Created", key: "isAccountCreated" },
    { label: "Admin Notes", key: "adminNotes" },
    { label: "Submitted Date", key: "createdAt" },
    { label: "Popular Release Links", key: "formattedReleaseLinks" },
    { label: "Popular Artist Links", key: "formattedArtistLinks" },
    { label: "Associated Labels", key: "formattedLabels" },
  ];

  const fetchDataForExport = async (exportPage, exportLimit) => {
    try {
      const params = {
        page: exportPage,
        limit: exportLimit,
        search: debouncedSearch,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const res = await GlobalApi.getAllAggregatorApplications(params);
      const data = res.data.data.applications || [];
      return data.map((app) => ({
        ...app,
        name: `${app.firstName} ${app.lastName}`,
        isAccountCreated: app.isAccountCreated ? "Yes" : "No",
        formattedServices: (app.additionalServices || []).join(", "),
        formattedReleaseLinks: (app.popularReleaseLinks || []).join(", "),
        formattedArtistLinks: (app.popularArtistLinks || []).join(", "),
        formattedLabels: (app.associatedLabels || []).join(", "),
        createdAt: new Date(app.createdAt).toLocaleString(),
      }));
    } catch (err) {
      toast.error("Failed to fetch data for export.");
      return [];
    }
  };

  return (
    <div
      className={`p-4 md:p-6 space-y-6 ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Aggregator Management</h1>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Review and manage aggregator applications.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isDark ? "outline" : "secondary"}
            className="flex items-center gap-2 rounded-full px-5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
          <Button
            variant={isDark ? "outline" : "secondary"}
            className="flex items-center gap-2 rounded-full px-5"
            onClick={() => setIsAddNewAggregatorModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Aggregator Request
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-70" />
          <Input
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-9 ${
              isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"
            }`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`rounded-md px-3 py-2 text-sm ${
            isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200"
              : "bg-white border border-gray-300"
          }`}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="flex items-center gap-2">
          <Button
            variant={isDark ? "outline" : "secondary"}
            onClick={() => {
              setBulkMode(!bulkMode);
              if (bulkMode) setSelectedIds([]);
            }}
            className={`flex items-center gap-2 rounded-lg ${
              bulkMode ? "bg-red-500/10 text-red-500 border-red-500/50" : ""
            }`}
          >
            <ListChecks className="h-4 w-4" />
            {bulkMode ? "Exit Bulk Actions" : "Bulk Actions"}
          </Button>

          {bulkMode && selectedIds.length > 0 && (
            <Button
              variant="destructive"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg animate-in fade-in slide-in-from-left-2"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <div
        className={`rounded-lg shadow-md ${
          isDark ? "bg-[#151F28]" : "bg-white"
        }`}
      >
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading applications...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead
                className={`${
                  isDark ? "text-gray-400" : "text-gray-600"
                } text-left`}
              >
                <tr>
                  {bulkMode && (
                    <th className="px-4 py-3 w-12 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-400 accent-red-600 cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          applications.length > 0 &&
                          applications.every(app => app.isAccountCreated || selectedIds.includes(app._id)) &&
                          applications.some(app => !app.isAccountCreated && selectedIds.includes(app._id))
                        }
                      />
                    </th>
                  )}
                  {["Name", "Email", "Company", "Status", "Account Created", "Submitted", "Actions"].map(
                    (header) => (
                      <th key={header} className="px-4 py-3 font-medium">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={bulkMode ? 8 : 7} className="text-center py-10 opacity-60">
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  )}
                {applications.length > 0 && applications.map((app) => (
                    <tr
                      key={app._id}
                      className={`border-t ${
                        isDark ? "border-gray-700" : "border-gray-200 border-b"
                      } ${selectedIds.includes(app._id) ? (isDark ? 'bg-red-500/5' : 'bg-red-50/50') : 'hover:bg-gray-800/40'}`}
                    >
                      {bulkMode && (
                        <td className="px-4 py-3 text-center">
                          {!app.isAccountCreated ? (
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-400 accent-red-600 cursor-pointer"
                              checked={selectedIds.includes(app._id)}
                              onChange={() => handleSelectRow(app._id)}
                            />
                          ) : (
                            <div className="w-4 h-4 mx-auto opacity-20 bg-gray-400/20 rounded" />
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium">{`${app.firstName} ${app.lastName}`}</td>
                      <td className="px-4 py-3 text-gray-500">{app.emailAddress}</td>
                      <td className="px-4 py-3">{app.companyName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ${
                            app.applicationStatus === "pending"
                              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                              : app.applicationStatus === "approved"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {app.isAccountCreated ? (
                          <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Created
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 opacity-60">Not Created</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`rounded-full h-8 px-4 ${isDark ? "bg-[#1E293B] hover:bg-[#334155] border-gray-600 text-gray-100" : ""}`}
                          onClick={() => handleView(app._id)}
                        >
                          View
                        </Button>
                        {app.applicationStatus === 'approved' && !app.isAccountCreated && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 px-4"
                            onClick={() => handleOpenCreateAccount(app._id)}
                          >
                            Create Account
                          </Button>
                        )}
                        {!app.isAccountCreated && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full w-8 h-8 p-0"
                            onClick={() => handleDelete(app._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3">
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

      {isModalOpen && (
        <AggregatorRequestReviewModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          applicationId={selectedAppId}
          onReviewed={handleReviewed}
        />
      )}
      
      {isCreateAccountModalOpen && (
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          applicationId={selectedAppIdForCreation}
          onSuccess={handleAccountCreated}
        />
      )}

      <AddNewAggregatorRequestModal
        isOpen={isAddNewAggregatorModalOpen}
        onClose={() => setIsAddNewAggregatorModalOpen(false)}
        onSuccess={handleApplicationCreated}
        theme={theme}
      />

      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalItems}
        headers={exportHeaders}
        fetchData={fetchDataForExport}
        filename="aggregator_applications"
        title="Export Aggregator Applications"
        description="Select a data range to export as a CSV file."
      />
    </div>
  );
}
