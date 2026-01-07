import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateMCNChannelModal({
  isOpen,
  onClose,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelLink, setChannelLink] = useState("");
  const [revenueShare, setRevenueShare] = useState("");
  const [channelManager, setChannelManager] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const scrollAreaRef = useRef(null);

  const bgColor = isDark ? "bg-[#111A22]" : "bg-white";
  const inputStyle = isDark
    ? "bg-[#151F28] border border-gray-800 text-gray-200"
    : "bg-gray-50 border border-gray-300 text-gray-900";

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch requests when modal opens or debounced search term changes
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1); // Reset page on new search or modal open
      setRequests([]);    // Clear previous requests
      setHasMore(true);   // Assume there's more data
      fetchApprovedRequests(1, pageSize, debouncedSearchTerm, true);
    }
  }, [isOpen, debouncedSearchTerm]);

  const fetchApprovedRequests = async (page, limit, search, reset = false) => {
    if (!isOpen || fetchingRequests) return;

    setFetchingRequests(true);
    try {
      const params = { page, limit, search: search || undefined };
      const res = await GlobalApi.getMcnRequests(params);
      const apiRequests = res?.data?.data?.requests ?? [];

      const approved = apiRequests.filter(
        (r) =>
          String(r.status).toLowerCase() === "approved" &&
          r.isChannelCreated !== true
      );

      setRequests((prev) => (reset ? approved : [...prev, ...approved]));
      setHasMore(approved.length === limit);
    } catch (err) {
      console.error("❌ Error fetching MCN requests:", err);
      toast.error("Failed to load MCN requests");
    } finally {
      setFetchingRequests(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedRequestId("");
      setChannelName("");
      setChannelLink("");
      setRevenueShare("");
      setChannelManager("");
      setNotes("");
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current.viewport;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !fetchingRequests) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      fetchApprovedRequests(currentPage, pageSize, debouncedSearchTerm);
    }
  }, [currentPage]);

  useEffect(() => {
    if (selectedRequestId) {
      const selectedRequest = requests.find(req => req._id === selectedRequestId);
      if (selectedRequest) {
        setChannelName(selectedRequest.youtubeChannelName || "");
        setChannelLink(selectedRequest.youtubeChannelId || ""); // Pre-fill channel link/ID too
      }
    } else {
      setChannelName("");
      setChannelLink("");
    }
  }, [selectedRequestId, requests]);

  const handleSubmit = async () => {
    if (!selectedRequestId) {
      toast.error("Please select an approved request first.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        channelName,
        channelLink,
        revenueShare: Number(revenueShare),
        channelManager,
        notes,
      };

      const res = await GlobalApi.createMcnChannel(selectedRequestId, payload);

      toast.success("MCN Channel created successfully!");
      onClose(res.data?.data || null);
    } catch (err) {
      console.error("❌ Channel creation error:", err);
      toast.error(err.response?.data?.message || "Failed to create MCN Channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-w-lg rounded-2xl border border-gray-800 shadow-md ${bgColor} ${isDark ? "text-gray-200" : "text-gray-900"
          }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New MCN Channel</DialogTitle>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Set up a new MCN channel linked to an approved request
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <div>
            <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Approved Request
            </label>
            <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
              <SelectTrigger className={`w-full ${inputStyle} focus-visible:ring-0`}>
                <SelectValue placeholder="Select approved request" />
              </SelectTrigger>
              <SelectContent className={`${isDark ? "bg-[#151F28] text-gray-100" : ""}`}>
                <div className="relative mb-2 mx-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user id or channel name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-9 pr-3 py-2 w-full text-sm border ${inputStyle}`}
                  />
                </div>
                {fetchingRequests && currentPage === 1 ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : requests.length > 0 ? (
                  <ScrollArea className="max-h-[200px]" onScrollCapture={handleScroll} ref={scrollAreaRef}>
                    {requests.map((req) => (
                      <SelectItem key={req._id ?? req.id} value={req._id ?? req.id}>
                        {req.userAccountId ?? req.userAccount ?? "-"} — {req.youtubeChannelName ?? req.youtubeChannelId ?? "-"}
                      </SelectItem>
                    ))}
                    {fetchingRequests && (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </ScrollArea>
                ) : (
                  <div className="p-2 text-sm text-gray-400 text-center">No approved requests found</div>
                )}
              </SelectContent>
            </Select>
          </div>


          <div>
            <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Channel Name
            </label>
            <Input
              placeholder="Enter channel name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className={`${inputStyle} focus-visible:ring-0`}
            />
          </div>


          <div>
            <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Channel Link
            </label>
            <Input
              placeholder="https://youtube.com/channel/UC1234567890"
              value={channelLink}
              onChange={(e) => setChannelLink(e.target.value)}
              className={`${inputStyle} focus-visible:ring-0`}
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Revenue Share (%)
              </label>
              <Input
                type="number"
                placeholder="e.g. 70"
                value={revenueShare}
                onChange={(e) => setRevenueShare(e.target.value)}
                className={`${inputStyle} focus-visible:ring-0`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Channel Manager
              </label>
              <Input
                placeholder="Enter manager name"
                value={channelManager}
                onChange={(e) => setChannelManager(e.target.value)}
                className={`${inputStyle} focus-visible:ring-0`}
              />
            </div>
          </div>


          <div>
            <label className={`block text-sm mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Notes</label>
            <Textarea
              placeholder="Channel setup details or notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputStyle} min-h-[90px] focus-visible:ring-0`}
            />
          </div>


          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => onClose(null)} // Explicitly pass null on cancel
              className={`${isDark ? "bg-[#151F28] border border-gray-800 text-gray-300 hover:bg-[#1C2732]" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
              {loading ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
