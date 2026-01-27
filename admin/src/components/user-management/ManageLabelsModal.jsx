import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import CreateSublabelModal from "./CreateSublabelModal";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import { Input } from "@/components/ui/input";

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

export default function ManageLabelsModal({
  isOpen,
  onClose,
  theme,
}) {
  const isDark = theme === "dark";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sublabels, setSublabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const fetchSublabels = async (currentPage = 1) => {
    try {
      setLoading(true);
      const extraParams = debouncedSearch ? `&search=${debouncedSearch}` : "";
      const res = await GlobalApi.getAllSubLabels(
        currentPage,
        10,
        extraParams
      );
      const { sublabels, pagination } = res.data.data;

      setSublabels(sublabels || []);
      setPagination(pagination || { totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error("❌ Error fetching sublabels:", err);
      toast.error("Failed to load sublabels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchSublabels(page);
  }, [isOpen, page, debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
    }
  }, [debouncedSearch]);

  const handleOpenCreate = () => {
    setEditData(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (sublabel) => {
    setEditData(sublabel);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreate = (shouldRefresh = false) => {
    setIsCreateModalOpen(false);
    setEditData(null);
    if (shouldRefresh) fetchSublabels(page);
  };

  const handleDelete = async () => {
    try {
      await GlobalApi.deleteSubLabel(deleteDialog.id);
      toast.success("Sublabel deleted");
      setDeleteDialog({ open: false, id: null });
      fetchSublabels(page);
    } catch (err) {
      toast.error("Failed to delete sublabel");
      console.error(err);
    }
  };

  const handleToggle = async (id, value) => {
    try {
      await GlobalApi.updateSubLabel(id, { isActive: value });
      setSublabels((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: value } : item
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const exportHeaders = [
    { label: "S.No.", key: "sno" },
    { label: "Label Name", key: "name" },
    { label: "Membership Status", key: "membershipStatus" },
    { label: "Assigned Users", key: "assignedUsersCount" },
    { label: "Is Active", key: "isActive" },
    { label: "Contract Start Date", key: "contractStartDate" },
    { label: "Contract End Date", key: "contractEndDate" },
    { label: "About Lable", key: "description" },
  ];

  const fetchSublabelsForExport = async (page, limit) => {
    try {
      const extraParams = debouncedSearch ? `&search=${debouncedSearch}` : "";
      const res = await GlobalApi.getAllSubLabels(page, limit, extraParams);
      const data = res.data.data.sublabels || [];

      return data.map((item) => ({
        ...item,
        contractStartDate: item.contractStartDate
          ? format(new Date(item.contractStartDate), "dd MMM yyyy")
          : "-",
        contractEndDate: item.contractEndDate
          ? format(new Date(item.contractEndDate), "dd MMM yyyy")
          : "-",
      }));
    } catch (err) {
      console.error("❌ Error fetching sublabels for export:", err);
      toast.error("Failed to load data for export");
      return [];
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
            setSearch("");
          }
        }}
      >
        <DialogContent
          className={`max-w-5xl rounded-2xl p-6 ${
            isDark
              ? "bg-[#111A22] text-white border border-gray-800"
              : "bg-white text-gray-900 border border-gray-200"
          }`}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                Manage Sublabels
              </DialogTitle>
              <DialogDescription
                className={`mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                View and manage label assignments for this user.
              </DialogDescription>
            </div>
            <Button
              onClick={handleOpenCreate}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90"
            >
              Add New Label
            </Button>
          </DialogHeader>

          <div className="flex items-center justify-between gap-4 my-4">
            <Input
              placeholder="Search by label name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full md:w-1/3 ${
                isDark
                  ? "bg-[#1A242C] border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            />
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              className={`${
                isDark
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300"
              }`}
            >
              Export as CSV
            </Button>
          </div>

          <div
            className={`mt-6 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } rounded-lg overflow-hidden`}
          >
            <table className="w-full">
              <thead
                className={`text-sm ${
                  isDark
                    ? "bg-[#1A242C] text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Label Name</th>
                  <th className="py-3 px-4 text-left">Membership Status</th>
                  <th className="py-3 px-4 text-center">Assigned Users</th>
                  <th className="py-3 px-4 text-center">Action</th>
                  <th className="py-3 px-4 text-center">Display</th>
                  <th className="py-3 px-4 text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : sublabels.length > 0 ? (
                  sublabels.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`text-sm ${
                        isDark
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                      }`}
                    >
                      <td className="py-3 px-4">
                        {index + 1 + (page - 1) * 10}
                      </td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            item.membershipStatus === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.membershipStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.assignedUsersCount || 0}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="hover:text-purple-400"
                          title="Edit"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={(v) => handleToggle(item._id, v)}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            setDeleteDialog({ open: true, id: item._id })
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      No sublabels found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-400">
              Showing {(page - 1) * 10 + 1}–
              {Math.min(page * 10, pagination.totalItems)} of{" "}
              {pagination.totalItems}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {deleteDialog.open && (
            <ConfirmDialog
              theme={theme}
              title="Delete Sublabel?"
              message="This action cannot be undone."
              confirmLabel="Delete"
              onCancel={() => setDeleteDialog({ open: false, id: null })}
              onConfirm={handleDelete}
            />
          )}

          <CreateSublabelModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreate}
            onSaved={() => fetchSublabels(page)}
            editData={editData}
            theme={theme}
          />
          
          <ExportCsvDialog
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            theme={theme}
            totalItems={pagination.totalItems}
            headers={exportHeaders}
            fetchData={fetchSublabelsForExport}
            filename="sublabels"
            title="Export Sublabels"
            description="Select a data range to export as a CSV file."
          />
        </DialogContent>
      </Dialog>
    </>
  );
}