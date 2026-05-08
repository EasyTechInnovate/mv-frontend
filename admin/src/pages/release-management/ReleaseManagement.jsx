import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye, ArrowLeft, Pencil, ListChecks, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ReleaseModal from "../../components/release-management/ReleaseModal";
import BulkProcessingModal from "../../components/release-management/BulkProcessingModal";
import CsvUploadModal from "@/components/csv-upload/CsvUploadModal";
import GlobalApi from "@/lib/GlobalApi";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  UPDATE_REQUEST: 'update_request',
  TAKEN_DOWN: 'taken_down'
};

const ETrackType = {
  SINGLE: 'single',
  ALBUM: 'album'
};

const EAdvancedReleaseType = {
  SINGLE: 'single',
  ALBUM: 'album',
  EP: 'ep',
  MINI_ALBUM: 'mini_album',
  RINGTONE_RELEASE: 'ringtone_release'
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

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '-';
  const secs = parseInt(seconds, 10);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
};

export default function ReleaseManagement({ theme }) {
  const isDark = theme === "dark";
  const { userId, userName: encodedUserName } = useParams(); // Extract userId and encoded userName from URL
  const navigate = useNavigate(); // For navigation
  
  const userName = encodedUserName ? decodeURIComponent(encodedUserName) : null;

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "basic";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [trackType, setTrackType] = useState("all");
  const [releaseCategory, setReleaseCategory] = useState(initialCategory); // 'basic' | 'advanced'
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  // Sync state with search params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && (category === "basic" || category === "advanced")) {
      setReleaseCategory(category);
    }
  }, [searchParams]);

  // Update search params when category changes
  const handleCategoryChange = (newCategory) => {
    setReleaseCategory(newCategory);
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("category", newCategory);
        return newParams;
    });
  };

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
  
  // CSV Upload State
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const referenceStatus = selectedReleases.length > 0 ? selectedReleases[0].releaseStatus : null;
  const selectableReleasesRefStatus = referenceStatus || (releases.length > 0 ? releases[0].releaseStatus : null);
  const selectableReleases = releases.filter(r => r.releaseStatus === selectableReleasesRefStatus);
  const isAllSelected = selectableReleases.length > 0 && selectableReleases.every(rel => 
    selectedReleases.some(r => r.releaseId === rel.releaseId)
  );

  const handleToggleAll = () => {
    if (isAllSelected) {
      const idsOnPage = selectableReleases.map(r => r.releaseId);
      setSelectedReleases(prev => prev.filter(r => !idsOnPage.includes(r.releaseId)));
    } else {
      setSelectedReleases(prev => {
        const newSelected = [...prev];
        selectableReleases.forEach(rel => {
          if (!newSelected.some(r => r.releaseId === rel.releaseId)) {
            newSelected.push(rel);
          }
        });
        return newSelected;
      });
      if (selectableReleases.length < releases.length) {
         toast.info(`Selected ${selectableReleases.length} releases with status: ${selectableReleasesRefStatus === 'submitted' ? 'Pending' : selectableReleasesRefStatus.replace(/_/g, ' ')}`);
      }
    }
  };

  const handleBulkActionClick = (action) => {
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (releaseCategory === 'advanced') {
        await GlobalApi.permanentDeleteAdvancedRelease(deleteTarget.releaseId);
      } else {
        await GlobalApi.permanentDeleteRelease(deleteTarget.releaseId);
      }
      toast.success(`Release "${deleteTarget.releaseName || deleteTarget.releaseId}" permanently deleted`);
      fetchReleases();
      fetchStats();
    } catch (error) {
      console.error('Permanent delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete release');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
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
        if (releaseCategory === 'advanced') {
            params.releaseType = trackType;
        } else {
            params.trackType = trackType;
        }
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
                userType: rel.userId?.userType || 'Unknown',
                accountId: rel.userId?.accountId || 'N/A'
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
    taken_down: "bg-red-500/20 text-red-400",
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
        releaseCategory={releaseCategory}   // Pass the category to handle different actions/views
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
          onClick={() => handleCategoryChange("basic")}
        >
          Basic Releases
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            releaseCategory === "advanced"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => handleCategoryChange("advanced")}
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
            {releaseCategory === 'advanced' 
              ? Object.values(EAdvancedReleaseType).map((type) => (
                  <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                ))
              : Object.values(ETrackType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))
            }
          </select>

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
                     <>
                        <Button size="sm" onClick={() => handleBulkActionClick('process_takedown')} className="bg-orange-600 hover:bg-orange-700 text-white">
                            Process Takedown ({selectedReleases.length})
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('reject_takedown')}>
                            Reject Takedown ({selectedReleases.length})
                        </Button>
                     </>
                )}

                {selectedReleases[0].releaseStatus === 'taken_down' && (
                     <Button size="sm" onClick={() => handleBulkActionClick('restore_takedown')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Restore to Live ({selectedReleases.length})
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
                
                {/* Permanent Delete — always available */}
                <Button size="sm" variant="destructive" onClick={() => handleBulkActionClick('permanent_delete')} className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" /> Delete Permanently ({selectedReleases.length})
                </Button>

                {/* Fallback for statuses with no actions (e.g. valid selection but no bulk action mapped) */}
                {!(
                    selectedReleases[0].releaseStatus === 'submitted' ||
                    selectedReleases[0].releaseStatus === 'under_review' ||
                    selectedReleases[0].releaseStatus === 'processing' ||
                    selectedReleases[0].releaseStatus === 'published' ||
                    selectedReleases[0].releaseStatus === 'take_down' ||
                    selectedReleases[0].releaseStatus === 'taken_down' ||
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
                        <Checkbox 
                            checked={isAllSelected}
                            onCheckedChange={handleToggleAll}
                            className={isDark ? "border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" : ""}
                        />
                    </th>
                )}
                {[
                  "Release ID",
                  "Release Name",
                  "Account ID",
                  "Status",
                  // "Request Status",
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
                  <td className="px-4 py-3 whitespace-nowrap">{rel.user.accountId}</td>

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
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center min-w-[70px] h-[28px] px-4 rounded-full text-sm font-medium capitalize ${statusColors[rel.requestStatus] ||
                        statusColors[rel.releaseStatus]}
                        `}
                    >
                      {(rel.requestStatus || rel.releaseStatus) === 'submitted' ? 'Pending' : (rel.requestStatus || rel.releaseStatus)}
                    </span>
                  </td> */}

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
                    <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1 rounded-full px-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(rel);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4" /> Delete
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
          { label: "Account ID", key: "accountId" },
          { label: "User Name", key: "userName" },
          { label: "User Email", key: "userEmail" },
          { label: "Release ID", key: "releaseId" },
          { label: "Release Status", key: "releaseStatus" },
          { label: "Release Type", key: "releaseType" },
          { label: "Release Name", key: "releaseName" },
          { label: "Release Version", key: "releaseVersion" },
          { label: "Track Type", key: "trackType" },
          { label: "Catalog", key: "catalog" },
          { label: "UPC", key: "upc" },
          { label: "Primary Artist", key: "primaryArtist" },
          { label: "Featuring Artist", key: "featuringArtist" },
          { label: "Primary Genre", key: "primaryGenre" },
          { label: "Secondary Genre", key: "secondaryGenre" },
          { label: "Label", key: "label" },
          { label: "C-Year", key: "cYear" },
          { label: "C-Line", key: "cLine" },
          { label: "P-Year", key: "pYear" },
          { label: "P-Line", key: "pLine" },
          { label: "Pricing Tier", key: "pricingTier" },
          { label: "Cover Art URL", key: "coverArtUrl" },
          { label: "Track Number", key: "trackNumber" },
          { label: "Track Name", key: "trackName" },
          { label: "Mix Version", key: "mixVersion" },
          { label: "Primary Artists", key: "trackPrimaryArtists" },
          { label: "Featuring Artists", key: "trackFeaturingArtists" },
          { label: "ISRC", key: "isrc" },
          { label: "Track Primary Genre", key: "trackPrimaryGenre" },
          { label: "Track Secondary Genre", key: "trackSecondaryGenre" },
          { label: "Sound Recording Contributors", key: "soundRecordingContributors" },
          { label: "Musical Work Contributors", key: "musicalWorkContributors" },
          { label: "Has Human Vocals", key: "hasHumanVocals" },
          { label: "Language", key: "language" },
          { label: "Explicit Status", key: "explicitStatus" },
          { label: "Available for Download", key: "availableForDownload" },
          { label: "Preview Timing", key: "previewTiming" },
          { label: "Audio Format", key: "audioFormat" },
          { label: "Audio File URL", key: "audioFileUrl" },
          { label: "Duration", key: "duration" },
          { label: "File Size (MB)", key: "fileSizeMB" },
          { label: "Release Date", key: "releaseDate" },
          { label: "Territories", key: "territories" },
          { label: "Distribution Partners", key: "distributionPartners" },
          { label: "Owns Copyright", key: "ownsCopyright" },
          { label: "Copyright Document Link", key: "copyrightDocumentLink" },
          { label: "Submitted At", key: "submittedAt" },
          { label: "Published At", key: "publishedAt" },
          { label: "Live At", key: "liveAt" },
          { label: "Footprint Match", key: "footprintMatch" },
          { label: "ACR Match Percentage", key: "acrMatchPercentage" },
          { label: "ACR Match Title", key: "acrMatchTitle" },
          { label: "ACR Artists", key: "acrArtists" },
          { label: "ACR Label", key: "acrLabel" },
          { label: "ACR Album", key: "acrAlbum" },
          { label: "ACR ISRC", key: "acrIsrc" },
          { label: "ACR UPC", key: "acrUpc" },
          { label: "ACR Release Date", key: "acrReleaseDate" },
          { label: "ACR Duration", key: "acrDuration" },
          { label: "ACR Genres", key: "acrGenres" },
          { label: "ACR Streaming Links", key: "acrStreamingLinks" },
        ]}
        fetchData={async (exportPage, exportLimit) => {
          try {
            const params = { page: exportPage, limit: exportLimit, isExport: true };
            if (debouncedSearch) params.search = debouncedSearch;
            if (status !== "all") params.status = status;
            if (trackType !== "all") {
              if (releaseCategory === 'advanced') params.releaseType = trackType;
              else params.trackType = trackType;
            }
            if (userId) params.userId = userId;

            const isAdv = releaseCategory === 'advanced';
            const res = isAdv
              ? await GlobalApi.getAdvancedReleases(params)
              : await GlobalApi.getAllReleases(params);
            const releasesToExport = res.data.data.releases || [];
            const flattenedData = [];

            releasesToExport.forEach(rel => {
              const step1 = rel.step1?.releaseInfo || {};
              const step3 = rel.step3 || {};

              const accountId = rel.userId?.accountId || rel.user?.accountId || '-';
              const userName = rel.userId
                ? `${rel.userId.firstName || ''} ${rel.userId.lastName || ''}`.trim() || '-'
                : (rel.user?.name || '-');
              const userEmail = rel.userId?.emailAddress || rel.user?.email || '-';
              const releaseStatus = rel.releaseStatus === 'submitted' ? 'Pending' : (rel.releaseStatus || '-');
              const releaseType = isAdv ? 'Advanced' : 'Basic';
              const releaseName = step1.releaseName || rel.releaseName || rel.releaseTitle || '-';
              const releaseVersion = isAdv ? (step1.releaseVersion || '-') : '-';
              const trackTypeVal = isAdv ? (step1.releaseType || rel.releaseType || '-') : (rel.trackType || '-');
              const catalog = isAdv ? (step1.catalog || '-') : '-';
              const upcRaw = step1.upcCode || step1.upc || step1.adminProvidedUPC;
              const upc = upcRaw ? `\t${upcRaw}` : '-';
              const primaryArtist = isAdv
                ? (Array.isArray(step1.primaryArtists) ? step1.primaryArtists.join(', ') : '-')
                : (rel.step1?.coverArt?.singerName?.join(', ') || '-');
              const featuringArtist = isAdv
                ? (Array.isArray(step1.featuringArtists) ? step1.featuringArtists.join(', ') : '-')
                : '-';
              const primaryGenre = step1.primaryGenre || step1.genre || rel.genre || '-';
              const secondaryGenre = isAdv ? (step1.secondaryGenre || '-') : '-';
              const label = typeof step1.labelName === 'object' ? (step1.labelName?.name || '-') : (step1.labelName || '-');
              const cYear = isAdv ? (step1.cLine?.year?.toString() || '-') : '-';
              const cLine = isAdv ? (step1.cLine?.text || '-') : '-';
              const pYear = isAdv ? (step1.pLine?.year?.toString() || '-') : '-';
              const pLine = isAdv ? (step1.pLine?.text || '-') : '-';
              const pricingTier = isAdv ? (step1.releasePricingTier || '-') : '-';
              const coverArtUrl = rel.step1?.coverArt?.imageUrl || '-';
              const releaseDate = (() => {
                const rd = isAdv
                  ? (step3.deliveryDetails?.releaseDate || step3.deliveryDetails?.forFutureRelease)
                  : (step3.releaseDate || step3.deliveryDetails?.releaseDate);
                return rd ? new Date(rd).toLocaleDateString() : '-';
              })();
              const territories = (
                step3.territorialRights?.territories ||
                step3.territorialRights?.selectedTerritories || []
              ).map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') || '-';
              const distributionPartners = (
                step3.distributionPartners ||
                step3.partnerSelection?.partners || []
              ).map(p => typeof p === 'string' ? p.replace(/_/g, ' ') : p).join(', ') || '-';
              const ownsCopyright = (step3.copyrightOptions?.ownsCopyrights || step3.copyrights?.ownsCopyright) ? 'Yes' : 'No';
              const copyrightDocumentLink = step3.copyrightOptions?.copyrightDocumentUrl || step3.copyrights?.copyrightDocuments?.[0]?.documentUrl || '-';
              const submittedAt = rel.submittedAt ? new Date(rel.submittedAt).toLocaleDateString() : '-';
              const publishedAt = rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString() : '-';
              const liveAt = rel.liveAt ? new Date(rel.liveAt).toLocaleDateString() : '-';

              const tracks = rel.step2?.tracks || rel.tracks || [];

              const buildRow = (track, trackIndex) => {
                const acrEntry = rel.audioFootprinting?.find(
                  fp => fp.trackId?.toString() === track?._id?.toString()
                );
                const isrcRaw = isAdv
                  ? (track?.adminProvidedISRC || track?.isrcCode || track?.isrc)
                  : (track?.isrc || track?.isrcCode || track?.adminProvidedISRC);
                return {
                  sno: flattenedData.length + 1,
                  accountId,
                  userName,
                  userEmail,
                  releaseId: rel.releaseId || '-',
                  releaseStatus,
                  releaseType,
                  releaseName,
                  releaseVersion,
                  trackType: trackTypeVal,
                  catalog,
                  upc,
                  primaryArtist,
                  featuringArtist,
                  primaryGenre,
                  secondaryGenre,
                  label,
                  cYear,
                  cLine,
                  pYear,
                  pLine,
                  pricingTier,
                  coverArtUrl,
                  trackNumber: track ? trackIndex + 1 : '-',
                  trackName: track?.trackName || '-',
                  mixVersion: isAdv ? (track?.mixVersion || '-') : '-',
                  trackPrimaryArtists: isAdv
                    ? (Array.isArray(track?.primaryArtists) ? track.primaryArtists.join(', ') : '-')
                    : (track?.singerName || '-'),
                  trackFeaturingArtists: isAdv
                    ? (Array.isArray(track?.featuringArtists) ? track.featuringArtists.join(', ') : '-')
                    : '-',
                  isrc: isrcRaw ? `\t${isrcRaw}` : '-',
                  trackPrimaryGenre: track?.primaryGenre || track?.genre || '-',
                  trackSecondaryGenre: isAdv ? (track?.secondaryGenre || '-') : '-',
                  soundRecordingContributors: isAdv
                    ? ((track?.contributorsToSoundRecording || track?.contributorsToSound)
                        ?.map(c => `${c.profession?.replace(/_/g, ' ')}: ${c.contributors}`)
                        .join('; ') || '-')
                    : ([
                        track?.singerName && `Singer: ${track.singerName}`,
                        track?.composerName && `Composer: ${track.composerName}`,
                        track?.lyricistName && `Lyricist: ${track.lyricistName}`,
                        track?.producerName && `Producer: ${track.producerName}`,
                      ].filter(Boolean).join('; ') || '-'),
                  musicalWorkContributors: isAdv
                    ? ((track?.contributorsToMusicalWork || track?.contributorsToMusical)
                        ?.map(c => `${c.profession?.replace(/_/g, ' ')}: ${c.contributors}`)
                        .join('; ') || '-')
                    : ([
                        track?.composerName && `Composer: ${track.composerName}`,
                        track?.lyricistName && `Lyricist: ${track.lyricistName}`,
                      ].filter(Boolean).join('; ') || '-'),
                  hasHumanVocals: isAdv ? (track?.hasHumanVocals ? 'Yes' : 'No') : '-',
                  language: track?.language || track?.musicLanguage || '-',
                  explicitStatus: isAdv
                    ? (track?.explicitStatus || (track?.parentalAdvisory ? 'Explicit' : 'Clean'))
                    : (track?.parentalAdvisory || '-'),
                  availableForDownload: isAdv ? (track?.isAvailableForDownload ? 'Yes' : 'No') : '-',
                  previewTiming: track?.previewStartTiming || '-',
                  audioFormat: track?.audioFiles?.[0]?.format || '-',
                  audioFileUrl: track?.trackLink || track?.fileUrl || track?.audioFiles?.[0]?.fileUrl || '-',
                  duration: track?.audioFiles?.[0]?.duration ? formatDuration(track.audioFiles[0].duration) : '-',
                  fileSizeMB: track?.audioFiles?.[0]?.fileSize ? (track.audioFiles[0].fileSize / (1024 * 1024)).toFixed(2) : '-',
                  releaseDate,
                  territories,
                  distributionPartners,
                  ownsCopyright,
                  copyrightDocumentLink,
                  submittedAt,
                  publishedAt,
                  liveAt,
                  footprintMatch: acrEntry ? 'Yes' : '-',
                  acrMatchPercentage: acrEntry?.matchPercentage ?? '-',
                  acrMatchTitle: acrEntry?.title || '-',
                  acrArtists: acrEntry?.artists?.join(', ') || '-',
                  acrLabel: acrEntry?.label || '-',
                  acrAlbum: acrEntry?.album || '-',
                  acrIsrc: acrEntry?.externalIds?.isrc ? `\t${acrEntry.externalIds.isrc}` : '-',
                  acrUpc: acrEntry?.externalIds?.upc || '-',
                  acrReleaseDate: acrEntry?.releaseDate || '-',
                  acrDuration: acrEntry?.durationMs ? formatDuration(Math.round(acrEntry.durationMs / 1000)) : '-',
                  acrGenres: acrEntry?.genres?.join(', ') || '-',
                  acrStreamingLinks: acrEntry?.streamingLinks
                    ? Object.values(acrEntry.streamingLinks).filter(Boolean).join(', ')
                    : '-',
                };
              };

              if (tracks.length > 0) {
                tracks.forEach((track, i) => flattenedData.push(buildRow(track, i)));
              } else {
                flattenedData.push(buildRow(null, 0));
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
      
      <CsvUploadModal
        isOpen={isCsvUploadOpen}
        onClose={() => setIsCsvUploadOpen(false)}
        userId={userId}
        userName={userName}
        theme={theme}
        onSuccess={() => {
          fetchReleases();
          fetchStats();
        }}
      />

      {/* Permanent Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => { if (!isDeleting) { setIsDeleteModalOpen(open); if (!open) setDeleteTarget(null); } }}>
        <DialogContent className={`max-w-md ${isDark ? 'bg-[#151F28] text-gray-200 border-gray-700' : 'bg-white text-gray-900'}`}>
          <DialogHeader>
            <DialogTitle className="text-red-500">⚠️ Permanent Delete</DialogTitle>
            <DialogDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              This is a <strong>permanent delete</strong> from the database. You will <strong>lose all details</strong> of this release. This action <strong>cannot be undone</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to permanently delete release{' '}
              <strong>"{deleteTarget?.releaseName || deleteTarget?.releaseId}"</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setDeleteTarget(null); }} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePermanentDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
