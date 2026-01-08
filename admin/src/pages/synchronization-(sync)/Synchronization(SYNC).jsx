import {
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  Music2,
  DollarSign,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import SyncLicenseReviewModal from "../../components/synchronization-(sync)/SyncLicenseReviewModal";
import EditSyncLicenseModal from "../../components/synchronization-(sync)/EditSyncLicenseModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import { useState , useRef , useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const enumLabels = {
  projectSuitability: {
    ad_campaigns: "Ad Campaigns",
    ott_web_series: "OTT / Web Series",
    tv_film_score: "TV & Film Score",
    trailers: "Trailers",
    podcasts: "Podcasts",
    corporate_films: "Corporate Films",
    gaming_animation: "Gaming / Animation",
    short_films_student: "Short Films / Student Projects",
    fashion_product_launch: "Fashion & Product Launch",
    festival_documentaries: "Festival Documentaries",
  },
  genres: {
    pop: "Pop",
    rock: "Rock",
    hip_hop: "Hip-Hop",
    electronic: "Electronic",
    jazz: "Jazz",
    classical: "Classical",
    reggae: "Reggae",
    country: "Country",
    blues: "Blues",
    folk: "Folk",
    r_and_b: "R&B",
    funk: "Funk",
    disco: "Disco",
    house: "House",
    techno: "Techno",
    trance: "Trance",
    ambient: "Ambient",
    indian_classical: "Indian Classical",
    bollywood: "Bollywood",
    bhangra: "Bhangra",
    devotional: "Devotional",
  },
  mood: {
    emotional: "Emotional",
    energetic: "Energetic",
    romantic: "Romantic",
    aggressive: "Aggressive",
    calm: "Calm",
    happy: "Happy",
    sad: "Sad",
    motivational: "Motivational",
    relaxing: "Relaxing",
    intense: "Intense",
    genre_specific: "Genre Specific",
    featured: "Featured",
    editorial: "Editorial",
  },
  theme: {
    love: "Love",
    heartbreak: "Heartbreak",
    friendship: "Friendship",
    party: "Party",
    celebration: "Celebration",
    inspiration: "Inspiration",
    nature: "Nature",
    spiritual: "Spiritual",
    adventure: "Adventure",
    nostalgia: "Nostalgia",
    freedom: "Freedom",
    struggle: "Struggle",
  },
  language: {
    hindi: "Hindi",
    english: "English",
    punjabi: "Punjabi",
    tamil: "Tamil",
    telugu: "Telugu",
    bengali: "Bengali",
    marathi: "Marathi",
    gujarati: "Gujarati",
    kannada: "Kannada",
    malayalam: "Malayalam",
    urdu: "Urdu",
    instrumental: "Instrumental",
    other: "Other",
  },
  proAffiliation: {
    bmi: "BMI",
    ascap: "ASCAP",
    iprs: "IPRS",
    prs: "PRS",
    socan: "SOCAN",
    sacem: "SACEM",
    gema: "GEMA",
    other: "Other",
    none: "None",
  },
};


const toReadable = (key, type) => {
  if (!key) return "—";
  const labelMap = enumLabels[type];
  if (Array.isArray(key))
    return key.map((v) => labelMap?.[v] || toTitleCase(v)).join(", ");
  return labelMap?.[key] || toTitleCase(key);
};

const toTitleCase = (str) =>
  str
    ? String(str)
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "—";


const iconMap = {
  total: Music2,
  approved: CheckCircle2,
  rejected: XCircle,
  pending: Clock3,
};

export default function SyncManagement({ theme }) {
  const isDark = theme === "dark";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState(""); // "" for all status
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  const dropdownRef = useRef(null);
  const [showBulk, setShowBulk] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequestForEdit, setSelectedRequestForEdit] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const normalizeResponse = (res) => {
    if (!res || !res.data || !res.data.data) return { submissions: [], pagination: {} };

    const payload = res.data.data;

    return {
      submissions: payload.submissions || [],
      pagination: payload.pagination || {},
    };
  };

  const fetchSyncRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: status === "" ? undefined : status,
        search: debouncedSearch || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      const res = await GlobalApi.getAllSyncSubmissions(params);
      const { submissions, pagination } = normalizeResponse(res);
      setRequests(submissions || []);
      setPagination(pagination || {});
    } catch (err) {
      console.error("❌ Error fetching sync submissions:", err);
      setError("Failed to fetch data");
      setRequests([]);
      setPagination({});
      toast.error("Failed to load sync submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncRequests();
  }, [currentPage, debouncedSearch, status]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

 
  const total = pagination.totalCount || 0;
  const approved = Array.isArray(requests) ? requests.filter((r) => r.status === "approved").length : 0;
  const rejected = Array.isArray(requests) ? requests.filter((r) => r.status === "rejected").length : 0;
  const pending = Array.isArray(requests) ? requests.filter((r) => r.status === "pending").length : 0;

  const statCards = [
    { key: "total", label: "Total Requests", value: total },
    { key: "approved", label: "Approved Requests", value: approved },
    { key: "rejected", label: "Rejected Requests", value: rejected },
    { key: "pending", label: "Pending Requests", value: pending },
  ];

  const handleBulkDelete = () => setShowBulk(false);
  const handleBulkEdit = () => setShowBulk(false);

  const handleReviewClick = (row) => {
    setSelectedRequest(row);
    setIsModalOpen(true);
  };

  const handleEditClick = (row) => {
    setSelectedRequestForEdit(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await GlobalApi.deleteSyncSubmission(submissionId);
      toast.success("Submission deleted successfully.");
      fetchSyncRequests(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete submission:", err);
      toast.error(err?.response?.data?.message || "Failed to delete submission.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRequestForEdit(null);
  };

  const statusColors = {
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const primaryText = isDark ? "text-gray-300" : "text-gray-800";
  const secondaryText = isDark ? "text-gray-400" : "text-gray-700";

  return (
    <div
      className={`p-6 transition-colors duration-300 ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
      }`}
    >
     
      <div>
        <h1 className="text-2xl font-bold">Synchronization (SYNC)</h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Manage sync license requests for film, TV, commercials, and digital content.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {statCards.map((s) => {
          const Icon = iconMap[s.key];
          const colorClass =
            s.key === "approved"
              ? "text-green-500"
              : s.key === "rejected"
              ? "text-red-500"
              : s.key === "pending"
              ? "text-yellow-400"
              : isDark
              ? "text-blue-400"
              : "text-blue-600";

          return (
            <Card
              key={s.key}
              className={`relative ${
                isDark
                  ? "bg-[#151F28] border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CardContent className="p-4">
                <div
                  className={`absolute top-3 right-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {s.label}
                </p>
                <p className={`text-2xl font-bold ${colorClass}`}>{s.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

         
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center mt-6">
        <div className="relative w-full md:w-[520px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-70" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by track, artist, user..."
            className={`w-full text-sm pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? "bg-[#151F28] text-gray-200 border-gray-700"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1); // Reset page on status change
            }}
            className={`rounded-md px-3 py-2 text-sm border ${
                isDark
                  ? "bg-[#151F28] text-gray-200 border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
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
            <Download className="w-4 h-4 mr-2" /> Export as CSV
          </Button>

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              className="px-5 text-red-500"
              onClick={() => setShowBulk((s) => !s)}
            >
              Bulk Action
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            {showBulk && (
              <div
                className={`absolute top-11 right-0 w-36 rounded-md shadow-md border z-20 ${
                  isDark
                    ? "bg-[#151F28] text-gray-200 border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                <button
                  onClick={handleBulkDelete}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  Bulk Delete
                </button>
                <button
                  onClick={handleBulkEdit}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  Bulk Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    
<div
  className={`mt-6 overflow-x-auto rounded-lg shadow-md ${
    isDark ? "bg-[#151F28]" : "bg-white"
  }`}
>
  {loading ? (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="animate-spin h-6 w-6 mr-2" />
      <p>Loading sync requests...</p>
    </div>
  ) : error ? (
    <div className="text-center py-10 text-red-500">
      {error}
    </div>
  ) : (
    <table
      className={`w-full border-collapse text-sm min-w-[1300px] ${
        isDark ? "text-gray-200" : "text-[#151F28]"
      }`}
    >
      <thead
        className={`text-left border-b ${
          isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"
        }`}
      >
        <tr>
          {[
            "Track Name",
            "Artist Name",
            "Account Name",
            "Account ID",
            "Label Name",
            "ISRC",
            "Genre",
            "Language",
            "Status",
            "Submit Date",
            "Actions",
          ].map((header) => (
            <th key={header} className="px-4 py-3 font-semibold whitespace-nowrap">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {requests.length > 0 ? (
          requests.map((row, i) => (
            <tr
              key={row._id || i}
              className={`border-t transition-colors ${
                isDark
                  ? "border-gray-700 hover:bg-gray-800/50"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              <td className="px-4 py-3">{toTitleCase(row.trackName)}</td>
              <td className="px-4 py-3">{toTitleCase(row.artistName)}</td>
              <td className="px-4 py-3">{row.userId ? `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim() || "—" : "—"}</td>
              <td className="px-4 py-3">{row.userId?.accountId || "—"}</td>
              <td className="px-4 py-3">{toTitleCase(row.labelName)}</td>
              <td className="px-4 py-3 font-mono">{row.isrc || "—"}</td>
              <td className="px-4 py-3">{toReadable(row.genres, "genres")}</td>
              <td className="px-4 py-3">{toReadable(row.language, "language")}</td>
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
              <td className="px-4 py-3">
                {row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-4 py-3 flex gap-2">
                <Button
                  size="sm"
                  className={`min-w-[90px] ${
                    isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleReviewClick(row)}
                >
                  <Eye className="w-4 h-4 mr-1" /> Review
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(row)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(row._id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={11}
              className={`text-center py-6 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              No sync requests found.
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
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} submissions
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
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={pageNum === currentPage ? `bg-[#711CE9] hover:bg-[#711CE9]/90 ${isDark ? "text-white" : ""}` : (isDark ? "text-white bg-[#151F28] border-gray-700" : "")}
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
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <SyncLicenseReviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        data={selectedRequest}
        theme={theme}
        refreshList={fetchSyncRequests}
      />

      <EditSyncLicenseModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        data={selectedRequestForEdit}
        refreshList={fetchSyncRequests}
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
          { label: "Account Name", key: "accountName" },
          { label: "Account ID", key: "accountId" },
          { label: "Label Name", key: "labelName" },
          { label: "ISRC", key: "isrc" },
          { label: "Genre", key: "genres" },
          { label: "Language", key: "language" },
          { label: "Status", key: "status" },
          { label: "Submit Date", key: "createdAt" }
        ]}
        fetchData={async (page, limit) => {
          try {
            const params = {
              page,
              limit,
              status: status === "" ? undefined : status,
              search: debouncedSearch || undefined,
              sortBy: 'createdAt',
              sortOrder: 'desc'
            };
            const res = await GlobalApi.getAllSyncSubmissions(params);
            const { submissions } = normalizeResponse(res);
            return (submissions || []).map(row => ({
              ...row,
              trackName: toTitleCase(row.trackName),
              artistName: toTitleCase(row.artistName),
              accountName: row.userId ? `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim() || "—" : "—",
              accountId: row.userId?.accountId || "—",
              labelName: toTitleCase(row.labelName),
              genres: toReadable(row.genres, "genres"),
              language: toReadable(row.language, "language"),
              createdAt: new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            }));
          } catch (err) {
            toast.error("Failed to fetch data for export.");
            return [];
          }
        }}
        filename="sync_submissions"
        title="Export Sync Submissions"
        description="Select a data range to export as a CSV file."
      />
    </div>
  );
}

