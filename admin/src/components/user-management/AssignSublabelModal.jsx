import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export default function AssignSublabelModal({
  isOpen,
  onClose,
  theme,
  userId,
  onAssigned,
}) {
  const isDark = theme === "dark";

  const [allSublabels, setAllSublabels] = useState([]);
  const [selectedSublabel, setSelectedSublabel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const normalizeSublabels = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
   
    if (Array.isArray(data.sublabels)) return data.sublabels;
    if (Array.isArray(data.items)) return data.items;
    
    if (typeof data === "object") {
      const vals = Object.values(data).filter(Boolean);
      
      for (const v of vals) {
        if (Array.isArray(v)) return v;
      }
      
      if (vals.length && typeof vals[0] === "object" && !Array.isArray(vals[0])) {
        return vals;
      }
    }
    return [];
  };

  const fetchSublabels = async (searchTerm = "") => {
    try {
      const extraParams = searchTerm ? `&search=${searchTerm}` : "";
      // Pass currentPage=1, limit=50 (or reasonable for dropdown)
      const res = await GlobalApi.getAllSubLabels(1, 50, extraParams);
     
      const payload = res?.data?.data ?? res?.data ?? res;
      const list = normalizeSublabels(payload);
      setAllSublabels(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sublabels");
      setAllSublabels([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedSublabel(null);
      setSearch("");
      fetchSublabels();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchSublabels(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleAssign = async () => {
    if (!selectedSublabel?._id) {
      return toast.error("Please select a sublabel");
    }

    setLoading(true);
    try {
      await GlobalApi.assignSubLabelToUser(selectedSublabel._id, {
        userId,
        isDefault: false,
      });

      toast.success("Sublabel assigned");
      if (typeof onAssigned === "function") onAssigned();
      onClose();
    } catch (err) {
      toast.error("Failed to assign sublabel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-md rounded-2xl p-6 ${
          isDark
            ? "bg-[#111A22] text-white border border-gray-700"
            : "bg-white text-gray-900 border border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Assign Sublabel
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <label className="text-sm mb-2 block font-medium">Select Sublabel</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full justify-between font-normal ${
                  !selectedSublabel && "text-muted-foreground"
                } ${
                  isDark
                    ? "bg-[#1A242C] border-gray-700 text-gray-200 hover:bg-[#1A242C]"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {selectedSublabel
                  ? selectedSublabel.name
                  : "Select sublabel..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className={`w-[400px] p-0 ${
                isDark ? "bg-[#111A22] border-gray-700" : "bg-white"
              }`} 
              align="start"
            >
              <div className="flex items-center border-b px-3" style={{ borderColor: isDark ? "#374151" : "#e5e7eb" }}>
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? "text-white" : "text-black"}`}
                  placeholder="Search sublabels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto p-1">
                {allSublabels.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No sublabel found.
                  </p>
                ) : (
                  allSublabels.map((sublabel) => (
                    <div
                      key={sublabel._id}
                      onClick={() => {
                        setSelectedSublabel(sublabel);
                        setOpen(false);
                      }}
                      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer ${
                        selectedSublabel?._id === sublabel._id
                          ? isDark ? "bg-purple-900/50 text-purple-100" : "bg-purple-100 text-purple-900"
                          : isDark ? "hover:bg-gray-800 text-gray-200" : "hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedSublabel?._id === sublabel._id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {sublabel.name}
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className={isDark ? "border-gray-600 text-gray-300" : ""}
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleAssign}
            className="bg-gradient-to-r from-purple-500 to-purple-700"
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
