import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, ArrowLeft, Pencil, ListChecks } from "lucide-react"; // Import ArrowLeft
import ReleaseModal from "../../components/release-management/ReleaseModal";
import BulkProcessingModal from "../../components/release-management/BulkProcessingModal";
import GlobalApi from "@/lib/GlobalApi"; // your API wrapper
import { useParams, useNavigate } from "react-router-dom"; // Import hooks
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";


const EReleaseStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  PROCESSING: 'processing',
  PUBLISHED: 'published',
  LIVE: 'live',
  REJECTED: 'rejected',
  TAKE_DOWN: 'take_down',
  UPDATE_REQUEST: 'update_request'
};

const ETrackType = {
  SINGLE: 'single',
  ALBUM: 'album'
};

// Custom hook for debouncing input
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


export default function ReleaseManagement({ theme }) {
  const isDark = theme === "dark";
  const { userId, userName: encodedUserName } = useParams(); // Extract userId and encoded userName from URL
  const navigate = useNavigate(); // For navigation
  
  const userName = encodedUserName ? decodeURIComponent(encodedUserName) : null;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [trackType, setTrackType] = useState("all");
  const [releaseCategory, setReleaseCategory] = useState("basic"); // 'basic' | 'advanced'
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  // API States
  const [releases, setReleases] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [activePage, setActivePage] = useState("list");
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Bulk Actions State
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedReleases, setSelectedReleases] = useState([]);
  const [bulkAction, setBulkAction] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedReleases([]);
  };

  const handleSelectRelease = (release) => {
    const isSelected = selectedReleases.some(r => r.releaseId === release.releaseId);
    
    if (isSelected) {
        setSelectedReleases(prev => prev.filter(r => r.releaseId !== release.releaseId));
        return;
    }

    if (selectedReleases.length > 0) {
        const firstStatus = selectedReleases[0].releaseStatus;
        if (firstStatus !== release.releaseStatus) {
            toast.error(`You can only select releases with status: ${firstStatus === 'submitted' ? 'Pending' : firstStatus.replace(/_/g, ' ')}`, {
                description: "Bulk actions can only be performed on releases with the same status."
            });
            return;
        }
    }

    setSelectedReleases(prev => [...prev, release]);
  };

  const handleBulkActionClick = (action) => {
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };


  // Fetch API
  // Fetch API
  const fetchReleases = async () => {
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (status !== "all") {
        params.status = status;
      }
      if (trackType !== "all") {
        params.trackType = trackType;
      }
      if (userId) { // Add userId to params if present
        params.userId = userId;
      }

      let res;
      if (status === 'update_request') {
          // Use specific API for edit requests to get correct sorting/data
          if (releaseCategory === 'advanced') {
              res = await GlobalApi.getAdvancedEditRequests({ page, limit: 10 });
          } else {
              res = await GlobalApi.getEditRequests({ page, limit: 10 });
          }
      } else if (releaseCategory === 'advanced') {
        res = await GlobalApi.getAdvancedReleases(params);
      } else {
        res = await GlobalApi.getAllReleases(params);
      }

      const data = res.data.data;

      if (releaseCategory === 'advanced' || status === 'update_request') {
        // Normalizing Data structure
        const releasesList = data.releases || []; 
        const normalizedReleases = releasesList.map(rel => ({
            ...rel,
            releaseName: rel.step1?.releaseInfo?.releaseName || rel.releaseId,
            user: {
                name: rel.userId ? `${rel.userId.firstName} ${rel.userId.lastName}` : 'Unknown',
                email: rel.userId?.emailAddress,
                userType: rel.userId?.userType || 'Unknown' 
            },
            trackCount: rel.step2?.tracks?.length || 0
        }));
        
        setReleases(normalizedReleases);
        setPagination({
            currentPage: data.currentPage || data.pagination?.currentPage || 1,
            totalPages: data.totalPages || data.pagination?.totalPages || 1,
            totalItems: data.totalItems || data.pagination?.totalItems || 0,
            itemsPerPage: 10,
        });

      } else {
        // Basic releases (standard flow)
        setReleases(data.releases);
        setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalItems: data.pagination.totalItems || data.pagination.totalCount || 0,
            itemsPerPage: data.pagination.itemsPerPage,
        });
      }
    } catch (err) {
      console.log("API ERROR → ", err);
      toast.error("Failed to load releases");
    }
  };

  const fetchStats = async () => {
    try {
      let res;
      if (releaseCategory === 'advanced') {
          res = await GlobalApi.getAdvancedReleaseStats();
          // Map advanced stats to common structure if needed or handle separately
          // Advanced stats: { totalReleases, todaySubmissions, statusBreakdown: {}, typeBreakdown: {} }
          const data = res.data.data;
          setStatsData({
             totalReleases: data.totalReleases,
             statusCounts: data.statusBreakdown || {},
             trackTypeCounts: data.typeBreakdown || {} // Assuming release types here
          });
      } else {
          res = await GlobalApi.getReleaseStats();
          setStatsData(res.data.data); // contains statusCounts, trackTypeCounts, totalReleases
      }
    } catch (err) {
      console.log("Stats API Error → ", err);
    }
  };

  // Only fetch stats if not viewing a specific user
  // Only fetch stats if not viewing a specific user
  useEffect(() => {
    if (!userId) {
      fetchStats();
    }
  }, [userId, releaseCategory]);


  useEffect(() => {
    fetchReleases();
  }, [page, debouncedSearch, status, trackType, userId, releaseCategory]); // Add userId to dependencies

  // Reset page to 1 when filters change (including userId)
  // Reset page to 1 when filters change (including userId)
  useEffect(() => {
    setPage(1);
    setSelectedReleases([]);
  }, [debouncedSearch, status, trackType, userId, releaseCategory]);


  // Stats
  const stats = [
    {
      label: "Total Releases",
      value: statsData?.totalReleases || 0,
    },
    {
      label: "Published",
      value: statsData?.statusCounts?.live || 0,
    },
    {
      label: "Pending",
      value: statsData?.statusCounts?.submitted || 0,
    },
    {
      label: "Total Tracks",
      value:
        (statsData?.trackTypeCounts?.single || 0) +
        (statsData?.trackTypeCounts?.album || 0),
    },
  ];


  const statusColors = {
    live: "bg-green-500/20 text-green-400",
    submitted: "bg-yellow-500/20 text-yellow-400",
    draft: "bg-gray-500/20 text-gray-400",
    approved: "bg-blue-500/20 text-blue-400",
    rejected: "bg-red-500/20 text-red-400",
    under_review: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    published: "bg-green-500/20 text-green-400",
    take_down: "bg-red-500/20 text-red-400",
    update_request: "bg-purple-500/20 text-purple-400",
  };


  const handleViewDetails = (release) => {
    setSelectedRelease(release);
    setSelectedRelease(release.releaseId);
    setActivePage("modal");
  };


  const handleBack = () => {
    setActivePage("list");
    setSelectedRelease(null);
  };

  // Show Modal Page
  if (activePage === "modal") {
    return (
      <ReleaseModal
        theme={theme}
        defaultData={selectedRelease}
        userId={selectedUserId}
        onBack={handleBack}
        releaseCategory={releaseCategory} // Pass the category to handle different actions/views
      />

    );
  }

  return (
    <div
      className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"}
        `}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {userId && userName ? `Release Management for ${userName}` : "Release Management"}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {userId ? "View and manage releases for this user" : "Manage music releases and track distribution across platforms"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {userId && (
            <Button
              variant={isDark ? "outline" : "secondary"}
              className="flex items-center gap-2 rounded-full px-5"
              onClick={() => navigate('/admin/user-management')}
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Users
            </Button>
          )}
          <Button
            variant={isDark ? "outline" : "secondary"}
            className="flex items-center gap-2 rounded-full px-5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5">
            + Add New Release
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!userId && ( // Conditionally render stats
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`rounded-lg p-4 shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}
                `}
            >
              <p
                className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}
                  `}
              >
                {stat.label}
              </p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Category Toggle */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            releaseCategory === "basic"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setReleaseCategory("basic")}
        >
          Basic Releases
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            releaseCategory === "advanced"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setReleaseCategory("advanced")}
        >
          Advanced Releases
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <Input
          placeholder="Search by name, ID, or artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}
            `}
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm capitalize ${isDark
                ? "bg-[#151F28] border border-gray-700 text-gray-200"
                : "bg-white border border-gray-300"}
              `}
          >
            <option value="all">All Status</option>
            {Object.values(EReleaseStatus).map((status) => (
              <option key={status} value={status}>
                {status === 'submitted' ? 'Pending' : status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={trackType}
            onChange={(e) => setTrackType(e.target.value)}
            className={`rounded-md px-3 py-2 text-sm capitalize ${isDark
                ? "bg-[#151F28] border border-gray-700 text-gray-200"
                : "bg-white border border-gray-300"}
              `}
          >
            <option value="all">All Types</option>
            {Object.values(ETrackType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>


          <select
            className={`rounded-md px-3 py-2 text-sm ${isDark
                ? "bg-[#151F28] border border-gray-700 text-gray-200"
                : "bg-white border border-gray-300"}
              `}
          >
            <option>All Artists</option>
          </select>


          <Button
            variant={isDark ? "outline" : "secondary"}
            className="flex items-center gap-2 px-5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          <Button 
            variant={isBulkMode ? "secondary" : "outline"}
            className={`flex items-center gap-2 px-5 ${isBulkMode ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : ''}`}
            onClick={toggleBulkMode}
          >
            <ListChecks className="h-4 w-4" /> 
            {isBulkMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
          </Button>

          {isBulkMode && selectedReleases.length > 0 && (
            <div className="flex gap-2 ml-2 animate-in fade-in slide-in-from-right-4 duration-300 items-center">
                {/* Contextual Actions based on Status */}
                {selectedReleases[0].releaseStatus === 'submitted' && (
                    <Button size="sm" onClick={() => handleBulkActionClick('approve')} className="bg-green-600 hover:bg-green-700 text-white">
                        Approve ({selectedReleases.length})
                    </Button>
                )}

                {selectedReleases[0].releaseStatus === 'under_review' && (
                    <>
                        <Button size="sm" onClick={() => handleBulkActionClick('start_processing')} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Start Processing ({selectedReleases.length})
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('reject')}>
                            Reject ({selectedReleases.length})
                        </Button>
                    </>
                )}

                {selectedReleases[0].releaseStatus === 'processing' && (
                    <>
                        <Button size="sm" onClick={() => handleBulkActionClick('publish')} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Publish ({selectedReleases.length})
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('reject')}>
                            Reject ({selectedReleases.length})
                        </Button>
                    </>
                )}

                {selectedReleases[0].releaseStatus === 'published' && (
                    <Button size="sm" onClick={() => handleBulkActionClick('go_live')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Go Live ({selectedReleases.length})
                    </Button>
                )}

                {selectedReleases[0].releaseStatus === 'take_down' && (
                     <Button size="sm" onClick={() => handleBulkActionClick('process_takedown')} className="bg-orange-600 hover:bg-orange-700 text-white">
                        Process Takedown ({selectedReleases.length})
                    </Button>
                )}

                {(selectedReleases[0].releaseStatus === 'live' && !selectedReleases[0].requestStatus) && (
                     <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('bulk_takedown')}>
                        Bulk Takedown ({selectedReleases.length})
                    </Button>
                )}

                {/* Edit Request Actions */}
                {(selectedReleases[0].releaseStatus === 'update_request' || selectedReleases[0].requestStatus === 'update_request') && (
                    <>
                        <Button size="sm" onClick={() => handleBulkActionClick('approve_edit_request')} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Approve Requests ({selectedReleases.length})
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('reject_edit_request')}>
                            Reject Requests ({selectedReleases.length})
                        </Button>
                    </>
                )}
                
                {/* Fallback for statuses with no actions (e.g. valid selection but no bulk action mapped) */}
                {!(
                    selectedReleases[0].releaseStatus === 'submitted' ||
                    selectedReleases[0].releaseStatus === 'under_review' ||
                    selectedReleases[0].releaseStatus === 'processing' ||
                    selectedReleases[0].releaseStatus === 'published' ||
                    selectedReleases[0].releaseStatus === 'take_down' ||
                    (selectedReleases[0].releaseStatus === 'live' && !selectedReleases[0].requestStatus) ||
                    selectedReleases[0].releaseStatus === 'update_request' || 
                    selectedReleases[0].requestStatus === 'update_request'
                ) && (
                    <span className="text-sm text-gray-500 italic px-2">
                        No bulk actions active for {selectedReleases[0].releaseStatus === 'submitted' ? 'Pending' : selectedReleases[0].releaseStatus?.replace(/_/g, ' ')}
                    </span>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className={`rounded-lg shadow-md w-full overflow-x-auto ${isDark ? "bg-[#151F28]" : "bg-white"}
          `}
      >
        <div className="min-w-max">
          <table className="table-auto text-sm min-w-[1200px]">
            <thead
              className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}
            >
              <tr>
                {isBulkMode && (
                    <th className="px-4 py-3 w-[50px]">
                        <span className="sr-only">Select</span>
                    </th>
                )}
                {[
                  "Release ID",
                  "Release Name",
                  "Artist",
                  "Status",
                  "Request Status",
                  "Tracks",
                  "Account Name",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {releases.map((rel) => (
                <tr
                  key={rel.releaseId}
                  className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} ${selectedReleases.some(r => r.releaseId === rel.releaseId) ? (isDark ? 'bg-purple-900/10' : 'bg-purple-50') : ''}
                    `}
                >
                  {isBulkMode && (
                    <td className="px-4 py-3">
                        <Checkbox 
                            checked={selectedReleases.some(r => r.releaseId === rel.releaseId)}
                            onCheckedChange={() => handleSelectRelease(rel)}
                            disabled={selectedReleases.length > 0 && selectedReleases[0].releaseStatus !== rel.releaseStatus}
                            className={isDark ? "border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" : ""}
                        />
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">{rel.releaseId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{rel.releaseName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{rel.user.name}</td>

                  {/* Status Pill */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center min-w-[70px] h-[28px] px-4 rounded-full text-sm font-medium capitalize ${statusColors[rel.releaseStatus]}
                        `}
                    >
                      {rel.releaseStatus === 'submitted' ? 'Pending' : rel.releaseStatus}
                    </span>
                  </td>

                  {/* Request Status Pill */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center min-w-[70px] h-[28px] px-4 rounded-full text-sm font-medium capitalize ${statusColors[rel.requestStatus] ||
                        statusColors[rel.releaseStatus]}
                        `}
                    >
                      {(rel.requestStatus || rel.releaseStatus) === 'submitted' ? 'Pending' : (rel.requestStatus || rel.releaseStatus)}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">{rel.trackCount || 0} track(s)</td>
                  <td className="px-4 py-3 whitespace-nowrap">{rel.user.name}</td>

                  <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 rounded-full px-4"
                      onClick={() => handleViewDetails(rel)}
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-purple-600 border-purple-600 hover:bg-purple-50 flex items-center gap-1 rounded-full px-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            const path = releaseCategory === 'advanced' 
                                ? `/admin/release-management/advanced/edit/${rel.releaseId}`
                                : `/admin/release-management/basic/edit/${rel.releaseId}`;
                            navigate(path);
                        }}
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Pagination (Moved to Right) */}
      <div className="flex justify-end items-center gap-3 pt-4 pr-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <span className="px-3 py-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalItems}
        headers={[
          { label: "S.No.", key: "sno" },
          { label: "Release ID", key: "releaseId" },
          { label: "Release Name", key: "releaseName" },
          { label: "Release Type", key: "releaseType" },
          { label: "Track Type", key: "trackType" },
          { label: "Artist Name", key: "artistName" },
          { label: "Artist Email", key: "email" },
          { label: "Status", key: "releaseStatus" },
          { label: "Request Status", key: "requestStatus" },
          { label: "Label", key: "labelName" },
          { label: "Genre", key: "genre" },
          { label: "UPC", key: "upc" },
          { label: "Cover Art URL", key: "coverArtUrl" },
          { label: "Submitted At", key: "submittedAt" },
          { label: "Published At", key: "publishedAt" },
          { label: "Live At", key: "liveAt" },
          { label: "Processed By", key: "adminProcessedBy" },
          // Track Details
          { label: "Track No.", key: "trackNumber" },
          { label: "Track Name", key: "trackName" },
          { label: "ISRC", key: "isrc" },
          { label: "Track Genre", key: "trackGenre" },
          { label: "Composer", key: "trackComposer" },
          { label: "Lyricist", key: "trackLyricist" },
          { label: "Singer", key: "trackSinger" },
          { label: "Producer", key: "trackProducer" },
          { label: "Audio Format", key: "audioFormat" },
          { label: "Audio File URL", key: "audioFileUrl" },
          { label: "Duration", key: "duration" },
          { label: "Preview Start", key: "previewStart" },
          { label: "Preview End", key: "previewEnd" },
          { label: "Caller Tune Start", key: "callerTuneStart" },
          { label: "Caller Tune End", key: "callerTuneEnd" },
          // Step 3 Details (Moved to End)
          { label: "Release Date", key: "releaseDate" },
          { label: "Has Rights", key: "hasRights" },
          { label: "Territories", key: "territories" },
          { label: "Has Partners", key: "hasPartners" },
          { label: "Partners", key: "partners" },
          { label: "Owns Copyright", key: "ownsCopyright" },
        ]}
        fetchData={async (exportPage, exportLimit) => {
          try {
            const params = { page: exportPage, limit: exportLimit, isExport: true };
            if (debouncedSearch) {
              params.search = debouncedSearch;
            }
            if (status !== "all") {
              params.status = status;
            }
            if (trackType !== "all") {
              params.trackType = trackType;
            }
            if (userId) {
              params.userId = userId;
            }
            const res = await GlobalApi.getAllReleases(params);
            const releasesToExport = res.data.data.releases || [];

            // Flatten data: One row per track
            const flattenedData = [];

            releasesToExport.forEach(rel => {
              // Common Release Level Data
              const releaseInfo = {
                releaseId: rel.releaseId,
                releaseName: rel.step1?.releaseInfo?.releaseName || rel.releaseTitle || '-',
                upc: rel.step1?.releaseInfo?.upc ? `\t${rel.step1.releaseInfo.upc}` : '-',
                labelName: rel.step1?.releaseInfo?.labelName || '-',
                genre: rel.step1?.releaseInfo?.genre || '-',
                releaseType: rel.releaseType || 'Basic',
                trackType: rel.trackType,
                releaseStatus: rel.releaseStatus === 'submitted' ? 'Pending' : rel.releaseStatus,
                requestStatus: (rel.requestStatus || rel.releaseStatus) === 'submitted' ? 'Pending' : (rel.requestStatus || rel.releaseStatus),
                artistName: rel.userId?.firstName ? `${rel.userId.firstName} ${rel.userId.lastName}` : (rel.user?.name || '-'),
                email: rel.userId?.emailAddress || rel.user?.email || '-',
                coverArtUrl: rel.step1?.coverArt?.imageUrl || '-',
                releaseDate: rel.step3?.releaseDate ? new Date(rel.step3.releaseDate).toLocaleDateString() : '-',
                hasRights: rel.step3?.territorialRights?.hasRights ? "Yes" : "No",
                territories: rel.step3?.territorialRights?.territories?.join(", ") || '-',
                hasPartners: rel.step3?.partnerSelection?.hasPartners ? "Yes" : "No",
                partners: rel.step3?.partnerSelection?.partners?.join(", ") || '-',
                ownsCopyright: rel.step3?.copyrights?.ownsCopyright ? "Yes" : "No",
                submittedAt: rel.submittedAt ? new Date(rel.submittedAt).toLocaleDateString() : '-',
                publishedAt: rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString() : '-',
                liveAt: rel.liveAt ? new Date(rel.liveAt).toLocaleDateString() : '-',
                adminProcessedBy: rel.adminReview?.reviewedBy?.firstName || '-'
              };

              const tracks = rel.step2?.tracks || [];

              if (tracks.length > 0) {
                tracks.forEach((track, index) => {
                  flattenedData.push({
                    sno: flattenedData.length + 1, // Will be overridden by dialog but good for debugging
                    ...releaseInfo,
                    trackNumber: index + 1,
                    trackName: track.trackName || '-',
                    isrc: track.isrc ? `\t${track.isrc}` : '-',
                    trackGenre: track.genre || '-',
                    trackComposer: track.composerName || '-',
                    trackLyricist: track.lyricistName || '-',
                    trackSinger: track.singerName || '-',
                    trackProducer: track.producerName || '-',
                    audioFormat: track.audioFiles?.[0]?.format || '-',
                    audioFileUrl: track.audioFiles?.[0]?.fileUrl || '-',
                    duration: track.audioFiles?.[0]?.duration ? `${Math.floor(track.audioFiles[0].duration)}s` : '-',
                    previewStart: track.previewTiming?.startTime ?? '-',
                    previewEnd: track.previewTiming?.endTime ?? '-',
                    callerTuneStart: track.callerTuneTiming?.startTime ?? '-',
                    callerTuneEnd: track.callerTuneTiming?.endTime ?? '-'
                  });
                });
              } else {
                // If no tracks found (edge case), still export release info
                flattenedData.push({
                  sno: flattenedData.length + 1,
                  ...releaseInfo,
                  trackNumber: '-',
                  trackName: '-',
                  isrc: '-',
                  trackGenre: '-',
                  trackComposer: '-',
                  trackLyricist: '-',
                  trackSinger: '-',
                  trackProducer: '-',
                  audioFormat: '-',
                  audioFileUrl: '-',
                  duration: '-',
                  previewStart: '-',
                  previewEnd: '-',
                  callerTuneStart: '-',
                  callerTuneEnd: '-'
                });
              }
            });

            return flattenedData;
          } catch (err) {
            console.error("❌ Error fetching releases for export:", err);
            toast.error("Failed to load data for export");
            return [];
          }
        }}
        filename={userName ? `${userName}_releases` : "releases"}
        title={userName ? `Export ${userName}'s Releases` : "Export Releases"}
        description="Select a data range of releases to export as a CSV file."
      />
      
      <BulkProcessingModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedReleases={selectedReleases}
        actionType={bulkAction}
        theme={theme}
        releaseCategory={releaseCategory}
        onComplete={() => {
            fetchReleases();
            fetchStats();
            setSelectedReleases([]);
            setIsBulkMode(false);
        }}
      />
    </div>
  );
}
