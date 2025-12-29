import { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddLabelModal from "@/components/trending-label/CreateLabelModal";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";

export default function TrendingLabelsManager({ theme }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLabel, setEditLabel] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchLabels = async () => {
    try {
      setLoading(true);
      const res = await GlobalApi.getAllTrendingLabels(1, 10);
      setData(res.data?.data?.labels || []);
    } catch (err) {
      console.error("Error fetching labels:", err);
      toast.error(err.response?.data?.message || "Failed to fetch labels. Please check API URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);


  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((l) => l.status?.toLowerCase() === "active").length;
    const totalArtists = data.reduce((sum, l) => sum + (l.totalArtists || 0), 0);
    const totalStreams = data.reduce((sum, l) => sum + (l.monthlyStreams || 0), 0);
    return {
      total,
      active,
      totalArtists,
      totalStreams: (totalStreams / 1_000_000).toFixed(1) + "M",
    };
  }, [data]);


  const filtered = data.filter(
    (l) =>
      l.labelName?.toLowerCase().includes(search.toLowerCase()) ||
      l.labelNumber?.toLowerCase().includes(search.toLowerCase()) ||
      l.designation?.toLowerCase().includes(search.toLowerCase())
  );


  const handleDelete = async (_id) => {
    toast.custom((t) => (
      <div
        className={`flex items-center justify-between w-[380px] px-4 py-3 rounded-xl shadow-md ${theme === "dark" ? "bg-[#151F28] text-white" : "bg-white text-black"
          }`}
      >
        <span className="text-sm font-medium">
          Are you sure you want to delete this label?
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await GlobalApi.deleteTrendingLabel(_id);
                setData((prev) =>
                  prev.filter((item) => item._id !== _id && item.id !== _id)
                );
                toast.success("Label deleted successfully");
              } catch (err) {
                console.error("❌ Error deleting label:", err);
                toast.error(
                  err.response?.data?.message ||
                  "Failed to delete label. Please check API URL or permissions."
                );
              }
            }}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`rounded-full ${theme === "dark"
                ? "border-gray-600 text-white hover:bg-[#1E293B]"
                : "border-gray-300 text-black hover:bg-gray-100"
              }`}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    ));
  };



  const cardClass =
    theme === "dark"
      ? "bg-[#151F28] text-white border-gray-700"
      : "bg-white text-black border-gray-200";


  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trending Labels Manager</h1>
          <p className="text-sm text-gray-500">
            Manage trending music labels and their artist rosters
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          onClick={() => {
            setEditLabel(null);
            setModalOpen(true);
          }}
        >
          + Add New Label
        </Button>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Labels", value: stats.total },
          { title: "Active Labels", value: stats.active, color: "text-green-500" },
          { title: "Total Artists", value: stats.totalArtists, color: "text-blue-500" },
          { title: "Monthly Streams", value: stats.totalStreams, color: "text-purple-500" },
        ].map((s) => (
          <Card key={s.title} className={cardClass}>
            <CardContent className="p-4">
              <p className="text-sm">{s.title}</p>
              <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      <div
        className={`flex items-center px-3 py-2 rounded-lg ${theme === "dark" ? "bg-[#151F28]" : "bg-gray-200"
          }`}
      >
        <Search
          className={`w-4 h-4 mr-2 ${theme === "dark" ? "text-gray-400" : "text-black"
            }`}
        />
        <input
          type="text"
          placeholder="Search labels by name, number, or designation..."
          className={`bg-transparent w-full text-sm focus:outline-none placeholder-gray-500 ${theme === "dark" ? "text-white" : "text-black"
            }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      <div
        className={`overflow-x-auto rounded-xl border ${theme === "dark"
          ? "bg-[#151F28] border-gray-700"
          : "border-gray-200"
          }`}
      >
        <table className="w-full text-sm">
          <thead
            className={`text-left ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
          >
            <tr>
              {[
                // "SR.NO.",
                "Label No.",
                "Label Name",
                "Designation",
                "Artists",
                "Releases",
                "Monthly Streams",
                "Status",
                "Last Updated",
                "Actions",
              ].map((header) => (
                <th key={header} className="px-4 py-3 whitespace-nowrap font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  Loading labels...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((l, index) => (
                <tr
                  key={l._id || index}
                  className={`border-b ${theme === "dark"
                    ? "border-[#151F28] hover:bg-[#151F28]/50"
                    : "border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  {/* <td className="px-4 py-3">{index + 1}</td> */}
                  <td className="px-4 py-3 font-mono">
                    {l.labelNumber?.toUpperCase() || `MV${index + 1}`}
                  </td>
                  
                  <td className="px-4 py-3 flex items-center gap-2">
                      <div
                        className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full overflow-hidden font-semibold ${
                          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
                        }`}
                      >
                        {l.logoUrl ? (
                          <img
                            src={l.logoUrl}
                            alt={l.labelName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {l.labelName?.charAt(0)?.toUpperCase() || "N/A"}
                          </span>
                        )}
                      </div>

                      <span>{l.labelName || "—"}</span>
                    </td>
                  <td className="px-4 py-3">{l.designation}</td>
                  <td className="px-4 py-3">{l.totalArtists}</td>
                  <td className="px-4 py-3">{l.totalReleases}</td>
                  <td className="px-4 py-3">
                    {l.monthlyStreams?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${l.status?.toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {l.status
                        ? l.status.charAt(0).toUpperCase() + l.status.slice(1).toLowerCase()
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {l.updatedAt
                      ? new Date(l.updatedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={ 
                          theme === "dark"
                            ? "bg-[#151F28] text-white border-gray-700"
                            : "bg-white text-black"
                        }
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditLabel(l);
                            setModalOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(l._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No labels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <AddLabelModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditLabel(null);
          fetchLabels();
        }}
        editData={editLabel}
        theme={theme}
      />
    </div>
  );
}
