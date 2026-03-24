import React, { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, Download, Loader2, FileSpreadsheet } from "lucide-react";

const TEMPLATE_HEADERS = [
  "Sublabel Name",
  "Membership Status",
  "Contract Start Date",
  "Contract End Date",
  "Description",
  "Email",
  "Phone",
];

const TEMPLATE_SAMPLE = [
  {
    "Sublabel Name": "Sample Records",
    "Membership Status": "active",
    "Contract Start Date": "2024-01-01",
    "Contract End Date": "2025-01-01",
    "Description": "A test sublabel",
    "Email": "contact@samplerecords.com",
    "Phone": "+1234567890",
  },
];

export default function BulkSublabelUploadModal({ isOpen, onClose, theme, onSuccess }) {
  const isDark = theme === "dark";
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    try {
      const csv = Papa.unparse({
        fields: TEMPLATE_HEADERS,
        data: TEMPLATE_SAMPLE,
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sublabel_upload_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to generate template");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      e.target.value = "";
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (result.errors.length > 0) {
          toast.error("CSV parsing errors occurred. Please check your file format.");
          e.target.value = "";
          return;
        }

        const rows = result.data;
        if (rows.length === 0) {
          toast.error("The CSV file is empty");
          e.target.value = "";
          return;
        }

        await processRows(rows);
        e.target.value = "";
      },
      error: (err) => {
        toast.error(`Failed to parse CSV: ${err.message}`);
        e.target.value = "";
      },
    });
  };

  const processRows = async (rows) => {
    setIsUploading(true);
    setResults([]);
    setShowResults(false);
    setProgress({ current: 0, total: rows.length });

    let successCount = 0;
    let failCount = 0;
    const tempResults = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = row["Sublabel Name"]?.trim();
      const status = row["Membership Status"]?.trim()?.toLowerCase() || "active";

      // Skip completely empty rows
      const hasContent = Object.values(row).some(val => val && val.toString().trim().length > 0);
      if (!hasContent) {
        continue;
      }

      if (!name) {
        // If row has some content but name is missing, then it's a legitimate error
        failCount++;
        tempResults.push({ name: `Row ${i+1}`, status: "error", message: "Missing sublabel name" });
        continue;
      }

      const payload = {
        name,
        membershipStatus: status,
        contractStartDate: row["Contract Start Date"]?.trim() || "",
        contractEndDate: row["Contract End Date"]?.trim() || "",
        description: row["Description"]?.trim() || "",
        contactInfo: {
          email: row["Email"]?.trim() || "",
          phone: row["Phone"]?.trim() || "",
        },
      };

      try {
        await GlobalApi.createSubLabel(payload);
        successCount++;
        tempResults.push({ name, status: "success", message: "Created successfully" });
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Unknown error";
        console.error("Failed to create sublabel:", name, err);
        failCount++;
        tempResults.push({ name, status: "error", message: errorMsg });
      }

      setProgress({ current: i + 1, total: rows.length });
      setResults([...tempResults]);
    }

    setIsUploading(false);
    setShowResults(true);

    if (failCount === 0) {
      toast.success(`Successfully created ${successCount} sublabels!`);
    } else {
      toast.warning(`${successCount} created successfully, ${failCount} failed.`);
    }

    if (successCount > 0 && onSuccess) {
      onSuccess();
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    onClose();
    setTimeout(() => {
        setResults([]);
        setShowResults(false);
        setProgress({ current: 0, total: 0 });
    }, 300);
  };

  const bg = isDark ? "bg-[#111A22] text-white border-gray-800" : "bg-white text-gray-900 border-gray-200";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && handleClose()}>
      <DialogContent className={`max-w-2xl rounded-2xl p-6 border ${bg} transition-all duration-300`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-500" />
            Bulk Upload Sublabels
          </DialogTitle>
          <DialogDescription className={isDark ? "text-gray-400" : "text-gray-600"}>
            {showResults 
              ? "See the summary of your bulk upload process below." 
              : "Upload a CSV file to create multiple sublabels at once."}
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#1A242C] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <h3 className="text-sm font-medium mb-2">Step 1: Download Template</h3>
              <p className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Download our CSV template to ensure your data is formatted correctly.
              </p>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={isUploading}
                className={`w-full ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300"}`}
              >
                <Download className="w-4 h-4 mr-2" /> Download Template
              </Button>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#1A242C] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <h3 className="text-sm font-medium mb-2">Step 2: Upload CSV</h3>
              <p className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Upload the filled template to automatically create sublabels.
              </p>
              
              <div className="relative">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Processing ({progress.current}/{progress.total})...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Select CSV File
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
              
              {progress.total > 0 && (
                <div className="mt-4">
                  <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-300 ease-in-out" 
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-[#1A242C] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? "bg-[#111A22]" : "bg-gray-100"}>
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Sublabel Name</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50 dark:divide-gray-700/50">
                    {results.map((res, idx) => (
                      <tr key={idx} className={isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-200/50"}>
                        <td className="px-4 py-2 truncate max-w-[150px]">{res.name}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            res.status === 'success' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs opacity-70 italic">{res.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResults(false)}
                className={isDark ? "border-gray-700 hover:bg-gray-800" : ""}
              >
                Upload Another
              </Button>
              <Button
                onClick={handleClose}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
