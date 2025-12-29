  import { useState, useEffect } from "react";
  import {
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Music2,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpDown,
    Users, 
    Album, 
    RotateCw,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import GlobalApi from "@/lib/GlobalApi";
  import { toast } from "sonner";
  import ArtistFormModal from "@/components/trending-artists/ArtistFormModal";

  export default function TrendingArtistsManager({ theme }) {
    const isDark = theme === "dark";
    const [artists, setArtists] = useState([]);
    const [totalStats, setTotalStats] = useState({
      totalArtists: 0,
      activeArtists: 0,
      inactiveArtists: 0,
      totalReleases: 0,
      totalMonthlyStreams: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const normalizeArtistResponse = (res) => {
      if (!res || !res.data || !res.data.data)
        return { artists: [], pagination: {} };

      const payload = res.data.data;

      return {
        artists: payload.artists || [],
        pagination: payload.pagination || {},
      };
    };

    const normalizeStatsResponse = (res) => {
      if (!res || !res.data || !res.data.data)
        return {
          totalArtists: 0,
          activeArtists: 0,
          inactiveArtists: 0,
          topStreamingArtists: [],
        };

      return res.data.data;
    };

    const fetchTrendingArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (statusFilter) params.status = statusFilter;
        if (debouncedSearch) params.search = debouncedSearch;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        const res = await GlobalApi.getAllTrendingArtists(params);
        const { artists: fetchedArtists, pagination: fetchedPagination } =
          normalizeArtistResponse(res);

        setArtists(fetchedArtists || []);
        setPagination(fetchedPagination || {});

        const currentTotalReleases = fetchedArtists.reduce(
          (sum, artist) => sum + (artist.totalReleases || 0),
          0
        );
        const currentTotalMonthlyStreams = fetchedArtists.reduce(
          (sum, artist) => sum + (artist.monthlyStreams || 0),
          0
        );

        setTotalStats((prevStats) => ({
          ...prevStats,
          totalReleases: currentTotalReleases,
          totalMonthlyStreams: currentTotalMonthlyStreams,
        }));
      } catch (err) {
        console.error("Failed to load trending artists:", err);
        setError("Failed to load trending artists.");
        setArtists([]);
        setPagination({});
        toast.error("Failed to load trending artists.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTrendingArtistsStats = async () => {
      try {
        const res = await GlobalApi.getTrendingArtistsStats();
        const statsData = normalizeStatsResponse(res);
        setTotalStats((prevStats) => ({
          ...prevStats,
          totalArtists: statsData.totalArtists,
          activeArtists: statsData.activeArtists,
          inactiveArtists: statsData.inactiveArtists,
        }));
      } catch (err) {
        console.error("Failed to load trending artists stats:", err);
        toast.error("Failed to load trending artists stats.");
      }
    };
    
    const refreshData = () => {
      fetchTrendingArtists();
      fetchTrendingArtistsStats();
    }

    useEffect(() => {
      refreshData();
    }, [currentPage, debouncedSearch, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setCurrentPage(1); 
      }, 500);

      return () => clearTimeout(timer);
    }, [searchTerm]);

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
        setCurrentPage(newPage);
      }
    };

    const handleResetFilters = () => {
      setSearchTerm("");
      setStatusFilter("");
      setSortBy("");
      setSortOrder("asc");
      setCurrentPage(1);
    };
    
    const openModal = (artist = null) => {
      setSelectedArtist(artist);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedArtist(null);
    };

    const handleDelete = async (artistId) => {
      if (window.confirm("Are you sure you want to delete this artist?")) {
        try {
          await GlobalApi.deleteTrendingArtist(artistId);
          toast.success("Artist deleted successfully!");
          refreshData();
        } catch (error) {
          console.error("Failed to delete artist:", error);
          toast.error("Failed to delete artist.");
        }
      }
    };

    const cardClass = isDark
      ? "bg-[#151F28] text-white border border-gray-700 rounded-lg"
      : "bg-white text-black border border-gray-200 shadow-sm rounded-lg";

    const statusColors = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-200 text-gray-700",
    };

    return (
      <div
        className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${
          isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trending Artists Manager</h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
              Manage trending artists and their release catalogs
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          >
            + Add New Artist
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Artists", value: totalStats.totalArtists, icon: Users, textColor: isDark ? "text-gray-200" : "text-gray-800" },
            { label: "Active Artists", value: totalStats.activeArtists, icon: CheckCircle2, textColor: "text-green-500" },
            { label: "Total Releases (Page)", value: totalStats.totalReleases, icon: Album, textColor: "text-blue-500" },
            { label: "Total Streams (Page)", value: totalStats.totalMonthlyStreams.toLocaleString(), icon: Clock, textColor: "text-purple-500" },
          ].map(({ label, value, icon: Icon, textColor }) => (
            <div key={label} className={`relative rounded-lg p-5 overflow-hidden ${cardClass}`}>
              <div className="absolute top-4 right-4 p-2 rounded-lg">
                <Icon className="w-5 h-5 text-gray-300" />
              </div>
              <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
              <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative w-full md:w-[420px]">
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
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border-gray-300"}`}
            >
              <option value="">All Status</option>
              {["active", "inactive"].map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setSortOrder(""); setCurrentPage(1); }}
              className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border-gray-300"}`}
            >
              <option value="">Sort By</option>
              {[
                { value: "createdAt", label: "Created At" },
                { value: "updatedAt", label: "Last Updated" },
                { value: "monthlyStreams", label: "Monthly Streams" },
                { value: "totalReleases", label: "Total Releases" },
                { value: "artistName", label: "Artist Name" },
              ].map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
              className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border-gray-300"}`}
            >
              <option value="">Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <Button variant="outline" size="icon" onClick={handleResetFilters} className={`${isDark ? "text-gray-300 border-gray-700" : ""}`} title="Reset Filters">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={`rounded-lg overflow-x-auto max-w-full shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
          {loading ? (
            <div className="p-6 text-center">Loading artists...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full text-sm ">
              <thead className={`text-left ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Artist No.</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Artist</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Designation</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Total Releases</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Monthly Streams</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Last Updated</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist._id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} hover:bg-gray-800/40`}>
                    <td className="px-4 py-3">{artist.artistNumber || "—"}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                      <div
                        className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full overflow-hidden font-semibold ${
                          isDark ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
                        }`}
                      >
                        {artist.profileImageUrl ? (
                          <img
                            src={artist.profileImageUrl}
                            alt={artist.artistName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {artist.artistName?.charAt(0)?.toUpperCase() || "N/A"}
                          </span>
                        )}
                      </div>

                      <span>{artist.artistName || "—"}</span>
                    </td>
                    <td className="px-4 py-3">{artist.designation || "—"}</td>
                    <td className="px-4 py-3">{(artist.totalReleases || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">{(artist.monthlyStreams || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {artist.status ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[artist.status] || "bg-gray-100 text-gray-700"}`}>
                          {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                        </span>
                      ) : ( "—" )}
                    </td>
                    <td className="px-4 py-3">{artist.updatedAt ? new Date(artist.updatedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" title="Actions">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={`${isDark ? "bg-[#1F2A37] text-white border border-gray-700" : "bg-white text-black border border-gray-200"}`}>
                          <DropdownMenuItem onClick={() => openModal(artist)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(artist._id)} className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {artists.length === 0 && !loading && !error && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center opacity-70">No artists found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.itemsPerPage * (pagination.currentPage - 1) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of {pagination.totalCount} artists
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" /> Previous
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
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={pageNum === currentPage ? `bg-purple-600 hover:bg-purple-700 ${isDark ? "text-white" : ""}` : isDark ? "text-white bg-[#151F28]" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <ArtistFormModal
          open={isModalOpen}
          onClose={closeModal}
          artist={selectedArtist}
          refreshList={refreshData}
          theme={theme}
        />
      </div>
    );
  }