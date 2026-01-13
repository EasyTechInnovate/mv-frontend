import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

export default function ReportData({ theme, onBack, reportId, reportType }) {
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const limit = 50; // Items per page

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!reportId) return;

      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: limit,
        };
        if (debouncedSearchQuery) {
          params.search = debouncedSearchQuery;
        }

        const res = await GlobalApi.getReportData(reportId, params);

        if (res?.data?.data) {
          setReportData(res.data.data.data || []);
          setSummary(res.data.data.summary || {});
          setPagination(res.data.data.pagination || {});
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        toast.error("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportId, currentPage, debouncedSearchQuery]);

  const headers = useMemo(() => {
    if (reportData.length === 0) return [];
    return Object.keys(reportData[0]);
  }, [reportData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Button onClick={onBack} variant="outline" className={`px-4 ${isDark ? "border-gray-700 text-gray-300 hover:bg-[#151F28]" : "border-gray-300"}`}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
            <h2 className="text-xl font-semibold">Report Data - {reportType}</h2>
            <p className="text-sm opacity-70">Detailed view of the uploaded report data.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-2.5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
              size={18}
            />
            <Input
              type="text"
              placeholder="Search in report data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-sm pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-[#151F28] text-gray-200 border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            <div className={`rounded-lg overflow-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`} style={{ height: 'calc(100vh - 20rem)' }}>
              <Table className="w-full text-sm min-w-[1300px]">
                <TableHeader className={`sticky top-0 ${isDark ? "bg-[#151F28]" : "bg-gray-50"} z-10`}>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead key={header} className="whitespace-nowrap px-4 py-3 font-medium">
                        {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headers.length} className="text-center py-10 opacity-70">
                        No results found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} hover:bg-gray-800/40`}>
                        {headers.map((header) => (
                          <TableCell key={header} className="px-4 py-3 whitespace-nowrap">
                            {typeof row[header] === 'number' ? row[header].toLocaleString() : row[header]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * limit) + 1} to {Math.min(pagination.currentPage * limit, pagination.totalCount)} of {pagination.totalCount} entries
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
                      if (pageNum > pagination.totalPages) return null;
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
          </>
        )}
    </div>
  );
}
