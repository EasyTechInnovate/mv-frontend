import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Eye,
  Music2,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
} from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import PlaylistPitchingReviewModal from "@/components/playlist-pitching/PlaylistPitchingReviewModal";
import EditPlaylistPitchingModal from "@/components/playlist-pitching/EditPlaylistPitchingModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";

function MoodBadge({ mood }) {
  const map = {
    Editorial: "bg-purple-500/20 text-purple-300",
    "Genre-specific": "bg-green-500/20 text-green-300",
    Featured: "bg-blue-500/20 text-blue-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[mood] || "bg-gray-500/20 text-gray-300"
        }`}
    >
      {mood}
    </span>
  );
}

export default function PlaylistPitching({ theme }) {
  const isDark = theme === "dark";
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState(""); // "" for all status
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  const [selectedPitch, setSelectedPitch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPitchForEdit, setSelectedPitchForEdit] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const normalizeResponse = (res) => {
    if (!res || !res.data || !res.data.data) return { submissions: [], pagination: {} };

    const payload = res.data.data;

    return {
      submissions: payload.submissions || [],
      pagination: payload.pagination || {},
    };
  };

  const fetchPlaylistPitches = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: status === "" ? undefined : status, // Send status only if not "All Status"
        search: debouncedSearch || undefined, // Send search only if not empty
      };
      const res = await GlobalApi.getPlayPitching(params);
      const { submissions, pagination } = normalizeResponse(res);
      setPitches(submissions || []);
      setPagination(pagination || {});
    } catch (err) {
      console.error("Failed to load playlist pitches:", err);
      setError("Failed to load submissions.");
      setPitches([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistPitches();
  }, [currentPage, debouncedSearch, status]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleModalClose = (shouldRefresh = false) => {
    setIsModalOpen(false);
    setSelectedPitch(null);
    if (shouldRefresh) fetchPlaylistPitches();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedPitchForEdit(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const total = pagination.totalCount || 0;
  const pending = Array.isArray(pitches)
    ? pitches.filter((p) => p.status === "pending").length
    : 0;
  const approved = Array.isArray(pitches)
    ? pitches.filter((p) => p.status === "approved").length
    : 0;
  const rejected = Array.isArray(pitches)
    ? pitches.filter((p) => p.status === "rejected").length
    : 0;




  const onReview = (row) => {
    setSelectedPitch(row);
    setIsModalOpen(true);
  };

  const onEdit = (row) => {
    setSelectedPitchForEdit(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await GlobalApi.deletePlayPitching(submissionId);
      toast.success("Submission deleted successfully.");
      fetchPlaylistPitches(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete submission:", err);
      toast.error(err?.response?.data?.message || "Failed to delete submission.");
    }
  };

  const statusColors = {
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <div
      className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
        }`}
    >

      <div>
        <h1 className="text-2xl font-semibold">Playlist Pitching</h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
          Manage artist-submitted tracks for playlist inclusion and curation
        </p>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Submissions", value: total, icon: Music2 },
          { label: "Pending Review", value: pending, icon: Clock },
          { label: "Approved", value: approved, icon: CheckCircle2 },
          { label: "Rejected", value: rejected, icon: XCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className={`relative rounded-lg p-5 overflow-hidden ${isDark ? "bg-[#151F28] text-white" : "bg-white border border-gray-200"
              }`}
          >
            <div className="absolute top-4 right-4   p-2 rounded-lg">
              <Icon className="w-5 h-5 text-gray-300" />
            </div>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {label}
            </p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>


      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-[520px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-70" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by artist name..."
            className={`pl-9 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1); // Reset page on status change
            }}
            className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"
              }`}
          >
            {["", "pending", "approved", "rejected"].map((s) => (
              <option key={s} value={s}>{s === "" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <Button
            variant={isDark ? "outline" : "secondary"}
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
        </div>
      </div>


      <div className={`rounded-lg overflow-x-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
        {loading ? (
          <div className="p-6 text-center">Loading submissions...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm min-w-[1300px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left `}>
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Track Name</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Artist Name</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Username</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Account ID</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Label Name</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">ISRC</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Genre</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Mood</th>
                <th className_name="px-4 py-3 font-medium whitespace-nowrap">Theme</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Language</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Store</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Submit Date</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pitches.map((row) => (
                <tr key={row._id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} hover:bg-gray-800/40`}>
                  <td className="px-4 py-3 font-medium">{row.trackName || "—"}</td>
                  <td className="px-4 py-3">{row.artistName || "—"}</td>
                  <td className="px-4 py-3">{row.userId ? `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim() || "—" : "—"}</td>
                  <td className="px-4 py-3">{row.userId?.accountId || "—"}</td>
                  <td className="px-4 py-3">{row.labelName || "—"}</td>
                  <td className="px-4 py-3">{row.isrc || "—"}</td>
                  <td className="px-4 py-3">{(row.genres || []).join(", ") || "—"}</td>
                  <td className="px-4 py-3 capitalize">{row.mood || "—"}</td>
                  <td className="px-4 py-3 capitalize">{row.theme || "—"}</td>
                  <td className="px-4 py-3 capitalize">{row.language || "—"}</td>
                  <td className="px-4 py-3 capitalize">{row.selectedStore || "—"}</td>
                  <td className="px-4 py-3">
                    {row.status ? (
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${
                          statusColors[row.status] || "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isDark ? "secondary" : "outline"}
                      className={`rounded-full ${isDark ? "bg-[#1E293B] hover:bg-[#334155] text-gray-100 border border-gray-600" : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"}`}
                      onClick={() => onReview(row)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => handleDelete(row._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {pitches.length === 0 && (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center opacity-70">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} submissions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
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
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={pageNum === currentPage ? `bg-[#711CE9] hover:bg-[#711CE9]/90 ${isDark ? "text-white" : ""}` : (isDark ? "text-white bg-[#151F28]" : "")}
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
              disabled={currentPage === pagination.totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}


      <PlaylistPitchingReviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        data={selectedPitch}
        theme={theme}
        refreshList={fetchPlaylistPitches}
      />

      <EditPlaylistPitchingModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        data={selectedPitchForEdit}
        refreshList={fetchPlaylistPitches}
        theme={theme}
      />

      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalCount || 0}
        headers={[
          { label: "S.No.", key: "sno" },
          { label: "Track Name", key: "trackName" },
          { label: "Artist Name", key: "artistName" },
          { label: "Username", key: "username" },
          { label: "Account ID", key: "accountId" },
          { label: "Label Name", key: "labelName" },
          { label: "ISRC", key: "isrc" },
          { label: "Genre", key: "genres" },
          { label: "Mood", key: "mood" },
          { label: "Theme", key: "theme" },
          { label: "Language", key: "language" },
          { label: "Store", key: "selectedStore" },
          { label: "Status", key: "status" },
          { label: "Submit Date", key: "createdAt" },
        ]}
        fetchData={async (page, limit) => {
          try {
            const params = {
              page,
              limit,
              status: status === "" ? undefined : status,
              search: debouncedSearch || undefined,
            };
            const res = await GlobalApi.getPlayPitching(params);
            const { submissions } = normalizeResponse(res);
            return (submissions || []).map(row => ({
              ...row,
              username: row.userId ? `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim() : "—",
              accountId: row.userId?.accountId || "—",
              genres: (row.genres || []).join(", "),
              createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
            }));
          } catch (err) {
            toast.error("Failed to fetch data for export.");
            return [];
          }
        }}
        filename="playlist_pitches"
        title="Export Playlist Pitches"
        description="Select a data range of playlist pitches to export as a CSV file."
      />
    </div>
  );
}

