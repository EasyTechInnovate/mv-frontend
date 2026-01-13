import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar, BarChart3, Loader2 } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import AddMonthModal from "./MonthModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function McnRoyaltyMonthManagement({ theme = "dark", onBack }) {
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    busy: false,
  });

  const isValidMongoId = (id) =>
    typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  const fetchMonths = async () => {
    try {
      setLoading(true);
      const res = await GlobalApi.getMonthsByType("mcn", false);
      if (res?.data?.data) setMonths(res.data.data);
    } catch (err) {
      console.error("Error fetching months:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  const filteredMonths = months.filter((m) =>
    m.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    {
      label: "Total MCN Royalty Months",
      value: months.length,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Active Months",
      value: months.filter((m) => m.isActive).length,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  const handleConfirmDelete = async () => {
    const id = deleteDialog.id;

    if (!isValidMongoId(id)) {
      alert("Delete failed: invalid month id.");
      return;
    }

    setDeleteDialog((d) => ({ ...d, busy: true }));

    const prevMonths = months;
    setMonths((prev) => prev.filter((m) => m._id !== id));

    try {
      await GlobalApi.deleteMonth(id);
      setDeleteDialog({ open: false, id: null, busy: false });
      await fetchMonths();
    } catch (err) {
      console.error("Delete failed:", err);
      setMonths(prevMonths);
      setDeleteDialog({ open: false, id: null, busy: false });
      alert("Delete failed. Check console.");
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#111A22]"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">MCN Royalty Month Management</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
            Organize monthly MCN royalty cycles
          </p>
        </div>

        <Button
          onClick={onBack}
          className={`rounded-full px-5 ${
            isDark
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-[#111A22]"
          }`}
        >
          ← Back
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 shadow-md flex items-center justify-between ${
              isDark ? "bg-[#151F28]" : "bg-white"
            }`}
          >
            <div>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
                {stat.label}
              </p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`flex flex-wrap gap-3 mt-6 items-center p-4 rounded-xl border ${
          isDark ? "bg-[#151F28] border-gray-700" : "bg-white border-gray-300 shadow-sm"
        }`}
      >
        <Input
          placeholder="Search by month..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 md:w-96 border ${
            isDark
              ? "bg-[#151F28] text-gray-200 border-gray-700"
              : "bg-white text-[#111A22] border-gray-300"
          }`}
        />
      </div>

      <div
        className={`mt-6 rounded-xl shadow-md overflow-x-auto border ${
          isDark ? "bg-[#111A22] border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead
              className={`${
                isDark ? "bg-[#151F28] text-gray-400" : "bg-gray-100 text-gray-700"
              }`}
            >
              <tr>
                <th className="px-6 py-3 text-left font-medium">SR No.</th>
                <th className="px-6 py-3 text-left font-medium">Month</th>
                <th className="px-6 py-3 text-left font-medium">Display Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className={isDark ? "divide-gray-700 divide-y" : "divide-gray-300 divide-y"}>
              {filteredMonths.map((month, idx) => (
                <tr
                  key={month._id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <td className="px-6 py-3">{idx + 1}</td>
                  <td className="px-6 py-3">{month.displayName}</td>

                  <td className="px-6 py-3">
                    <Switch
                      checked={month.isActive}
                      onCheckedChange={async (val) => {
                        setMonths((prev) =>
                          prev.map((m) =>
                            m._id === month._id ? { ...m, isActive: val } : m
                          )
                        );

                        try {
                          await GlobalApi.toggleMonthStatus(month._id);
                          fetchMonths();
                        } catch (err) {
                          console.error("Toggle failed:", err);
                          setMonths((prev) =>
                            prev.map((m) =>
                              m._id === month._id ? { ...m, isActive: !val } : m
                            )
                          );
                        }
                      }}
                    />
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className={`${isDark ? "border-gray-600" : "border-gray-300"} px-4 py-1 rounded-xl`}
                        onClick={() => {
                          setEditData(month);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        className="px-4 py-1 rounded-xl border-red-500 text-red-500"
                        onClick={() =>
                          setDeleteDialog({ open: true, id: month._id, busy: false })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMonths.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-400" colSpan={4}>
                    No months found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddMonthModal
          theme={theme}
          mode={editData ? "edit" : "add"}
          initialData={editData}
          onClose={() => setShowModal(false)}
          onSuccess={fetchMonths}
        />
      )}

      {deleteDialog.open && (
        <ConfirmDialog
          theme={theme}
          title="Delete Month?"
          message="This action cannot be undone."
          onCancel={() => setDeleteDialog({ open: false, id: null, busy: false })}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
