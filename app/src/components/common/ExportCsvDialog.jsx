import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import jsonToCsv, { exportToCsv } from "@/lib/csv";
import { DownloadCloud } from "lucide-react";

const EXPORT_LIMIT = 50;

export default function ExportCsvDialog({
  isOpen,
  onClose,
  totalItems,
  fetchData,
  headers,
  filename,
  title,
  description,
}) {
  const [loadingChunk, setLoadingChunk] = useState(null);

  const chunks = useMemo(() => {
    if (!totalItems) return [];
    const numChunks = Math.ceil(totalItems / EXPORT_LIMIT);
    return Array.from({ length: numChunks }, (_, i) => {
      const start = i * EXPORT_LIMIT + 1;
      const end = Math.min((i + 1) * EXPORT_LIMIT, totalItems);
      return { index: i, page: i + 1, start, end };
    });
  }, [totalItems]);

  const handleExport = async (chunk) => {
    setLoadingChunk(chunk.index);
    try {
      const data = await fetchData(chunk.page, EXPORT_LIMIT);
      if (!data || data.length === 0) {
        toast.error("No data available for this chunk.");
        return;
      }

      // Add a serial number to each row
      const dataWithSno = data.map((row, index) => ({
        sno: chunk.start + index,
        ...row,
      }));

      const csvString = jsonToCsv(dataWithSno, headers);
      const finalFilename = `${filename}_${chunk.start}-${chunk.end}.csv`;
      exportToCsv(finalFilename, csvString);
      toast.success(
        `Successfully exported ${data.length} records.`
      );
    } catch (error) {
      console.error("❌ Failed to export CSV:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setLoadingChunk(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md rounded-2xl p-6 bg-[#111A22] text-white border border-slate-700"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription
            className="mt-1 text-gray-400"
          >
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2 custom-scroll">
          {chunks.length > 0 ? (
            chunks.map((chunk) => (
              <Button
                key={chunk.index}
                variant="outline"
                className="w-full justify-between items-center border-slate-700 hover:bg-gray-800"
                onClick={() => handleExport(chunk)}
                disabled={loadingChunk !== null}
              >
                <span>
                  Export Records: <strong>{`${chunk.start}–${chunk.end}`}</strong>
                </span>

                {loadingChunk === chunk.index ? (
                  <div className="h-4 w-4 border-2 border-dashed rounded-full animate-spin border-purple-500"></div>
                ) : (
                  <DownloadCloud size={16} />
                )}
              </Button>
            ))
          ) : (
            <p
              className="text-center py-4 text-sm text-gray-500"
            >
              No data available to export.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
