import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import AggregatorRequestReviewModal from "@/components/aggregator-management/AggregatorRequestReviewModal";
import CreateAccountModal from "@/components/aggregator-management/CreateAccountModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";

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
      setPagination(data.pagination || { totalPages: 1, totalItems: 0 });
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


  const exportHeaders = [
    { label: "S.No.", key: "sno" },
    { label: "Name", key: "name" },
    { label: "Email", key: "emailAddress" },
    { label: "Company", key: "companyName" },
    { label: "Status", key: "applicationStatus" },
    { label: "Submitted Date", key: "createdAt" },
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
        createdAt: new Date(app.createdAt).toLocaleDateString(),
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 ${
            isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"
          }`}
        />
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
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className={`border-t ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="px-4 py-3">{`${app.firstName} ${app.lastName}`}</td>
                      <td className="px-4 py-3">{app.emailAddress}</td>
                      <td className="px-4 py-3">{app.companyName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            app.applicationStatus === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : app.applicationStatus === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {app.isAccountCreated ? "Created" : "Not Created"}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => handleView(app._id)}
                        >
                          View
                        </Button>
                        {app.applicationStatus === 'approved' && !app.isAccountCreated && (
                          <Button
                            size="sm"
                            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                            onClick={() => handleOpenCreateAccount(app._id)}
                          >
                            Create Account
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No applications found.
                    </td>
                  </tr>
                )}
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
