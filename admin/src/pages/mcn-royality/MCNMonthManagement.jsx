import React, { useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Download, Upload, Loader2, Search, ChevronLeft } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import ReportData from "@/components/common/ReportData";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BarChart, FileText, DollarSign } from "lucide-react";

const iconMap = {
  totalMonths: Calendar,
  activeMonths: BarChart,
  totalReports: FileText,
  totalRevenue: DollarSign,
};

export default function MCNMonthManagement({ theme = "dark" }) {
  const isDark = theme === "dark";
  const fileInputRef = useRef(null);
  const [uploadingFromMonth, setUploadingFromMonth] = useState(null);
  const [uploadingFileForMonthId, setUploadingFileForMonthId] = useState(null);
  const [uploadingMonthId, setUploadingMonthId] = useState(null);
  
  const [months, setMonths] = useState([]);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [showReportPage, setShowReportPage] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, busy: false });

  const fetchMonths = async () => {
    try {
      setLoadingMonths(true);
      const res = await GlobalApi.getMonthsByType("mcn");
      if (res?.data?.data) {
        setMonths(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching MCN months:", err);
      toast.error("Failed to load months.");
    } finally {
      setLoadingMonths(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await GlobalApi.getReportStats("mcn");
      if (res?.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching MCN stats:", err);
      toast.error("Failed to load statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!showReportPage) {
        fetchMonths();
        fetchStats();
    }
  }, [showReportPage]);

  // Handlers for file upload
  const handleUploadClick = (monthId, monthDisplayName) => {
    if (uploadingMonthId) return; // Prevent new uploads while one is in progress
    setUploadingFromMonth(monthDisplayName);
    setUploadingFileForMonthId(monthId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const monthIdToUpload = uploadingFileForMonthId;
    if (!monthIdToUpload) {
      toast.error("Month not selected for upload.");
      e.target.value = "";
      return;
    }

    setUploadingMonthId(monthIdToUpload);
    try {
      toast.info(`Uploading report for ${uploadingFromMonth}...`);
      await GlobalApi.uploadReport(monthIdToUpload, "mcn", file);
      toast.success(`Report for ${uploadingFromMonth} uploaded successfully!`);
      fetchMonths();
      fetchStats();
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error(err?.response?.data?.message || "Failed to upload report.");
    } finally {
      e.target.value = "";
      setUploadingFromMonth(null);
      setUploadingFileForMonthId(null);
      setUploadingMonthId(null);
    }
  };

  const handleConfirmDeleteReport = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((d) => ({ ...d, busy: true }));
    try {
      await GlobalApi.deleteReport(deleteDialog.id);
      toast.success("Report deleted successfully!");
      fetchMonths();
      fetchStats();
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error(err?.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeleteDialog({ open: false, id: null, busy: false });
    }
  };

  const handleDownloadReport = async (reportId, fileName) => {
    try {
      toast.info("Preparing download...");
      const res = await GlobalApi.getReportById(reportId);
      const reportData = res.data?.data;

      if (!reportData || !reportData.data || !reportData.data.mcn) {
        toast.error("No MCN data found for this report.");
        return;
      }
      
      const csv = Papa.unparse(reportData.data.mcn);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${fileName}_MCN_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report downloaded successfully!");

    } catch (err) {
      console.error("Error downloading report:", err);
      toast.error(err?.response?.data?.message || "Failed to download report.");
    }
  };

  if (showReportPage) {
    return (
      <ReportData
        theme={theme}
        onBack={() => setShowReportPage(false)}
        reportId={selectedReportId}
        reportType="mcn"
      />
    );
  }

  const statCards = [
    { key: "totalMonths", label: "Total MCN Months", value: stats?.overview?.totalMonths ?? "..." },
    { key: "activeMonths", label: "Active Months", value: stats?.overview?.activeMonths ?? "..." },
    { key: "totalReports", label: "Total Reports", value: stats?.overview?.totalReports ?? "..." },
    { key: "totalRevenue", label: "Total Revenue (INR)", value: `₹${(stats?.overview?.totalRevenue || 0).toLocaleString()}` ?? "..." },
  ];

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">MCN Royalty Management</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage and analyze MCN royalty data
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-5 rounded-full">Export All MCN Data</Button>
        </div> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => {
          const Icon = iconMap[s.key];
          return (
            <div
              key={s.key}
              className={`rounded-xl p-4 shadow ${isDark ? "bg-[#151F28]" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{s.label}</p>
                {Icon && <Icon className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
              </div>
              <p className={`text-2xl font-semibold ${s.key === "totalRevenue" ? "text-green-500" : ""}`}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <input type="text" placeholder="Search by month..." className={`w-full md:w-1/2 px-3 py-2 rounded-md border ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white border-gray-300"}`} />
        <div className="flex items-center gap-2">
          {/* Filters can go here if needed */}
        </div>
      </div>

      {/* Months Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className={`${isDark ? "bg-[#151F28] text-gray-400" : "bg-gray-100"}`}>
            <tr>
              <th className="text-left px-4 py-3">SR No.</th>
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Report Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingMonths ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500 mx-auto" />
                  Loading months...
                </td>
              </tr>
            ) : months.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No MCN months found.
                </td>
              </tr>
            ) : (
              months.map((month, idx) => (
                <tr
                  key={month._id}
                  className={`${isDark
                    ? "border-t border-gray-700 hover:bg-gray-800"
                    : "border-t border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{month.displayName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${month.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {month.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      month.reportDetails?.isSubmitted
                        ? (month.reportDetails.status === 'completed' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400")
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {month.reportDetails?.isSubmitted ? (month.reportDetails.status || "Submitted") : "Not Uploaded"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleUploadClick(month._id, month.displayName)}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full"
                        disabled={month.reportDetails?.isSubmitted || uploadingMonthId === month._id}
                      >
                        {uploadingMonthId === month._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {uploadingMonthId === month._id ? "Uploading..." : "Upload Sheet"}
                      </Button>
                      
                      {month.reportDetails?.isSubmitted && (
                        <>
                          {/* <Button
                            onClick={() => {
                              setSelectedReportId(month.reportDetails.reportId);
                              setShowReportPage(true);
                            }}
                            variant="outline"
                            className="px-4 py-1 rounded-2xl text-sm"
                          >
                            Show Data
                          </Button> */}
                          <Button
                            onClick={() => handleDownloadReport(month.reportDetails.reportId, month.displayName)}
                            variant="outline"
                            className="px-4 py-1 rounded-2xl text-sm"
                          >
                            <Download className="h-4 w-4 mr-2" /> Download CSV
                          </Button> 
                          <Button
                            onClick={() => setDeleteDialog({ open: true, id: month.reportDetails.reportId, busy: false })}
                            variant="outline"
                            className="px-4 py-1 rounded-2xl text-sm text-red-500 border-red-500"
                          >
                            Delete Report
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <input
        type="file"
        accept=".csv,.txt"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {deleteDialog.open && (
        <ConfirmDialog
          theme={theme}
          title="Delete Report?"
          message="Are you sure you want to delete this report? This action cannot be undone."
          onCancel={() => setDeleteDialog({ open: false, id: null, busy: false })}
          onConfirm={handleConfirmDeleteReport}
          loading={deleteDialog.busy}
        />
      )}
    </div>
  );
}