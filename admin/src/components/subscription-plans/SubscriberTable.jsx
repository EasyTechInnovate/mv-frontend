import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

export default function SubscriberTable({ isDark }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [page, setPage] = useState(1);

  const fetchSubscribers = async (pageNum = 1, searchVal = search, planVal = planFilter) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 20 };
      if (searchVal) params.search = searchVal;
      if (planVal) params.planId = planVal;
      const res = await GlobalApi.getSubscribers(params);
      if (res.data?.data) {
        setSubscribers(res.data.data.subscribers || []);
        setPagination(res.data.data.pagination || {});
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSubscribers(1, search, planFilter);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status) => {
    const map = {
      active: "bg-green-500/20 text-green-400",
      expired: "bg-red-500/20 text-red-400",
      cancelled: "bg-gray-500/20 text-gray-400",
      inactive: "bg-yellow-500/20 text-yellow-400",
    };
    return map[status] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className={`rounded-lg p-4 ${isDark ? "bg-[#151F28] text-gray-200" : "bg-white text-[#151F28]"}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <p className="text-sm text-gray-400">
            {pagination.totalItems ?? 0} total subscribers
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / email"
              className="pl-8 h-9 w-48"
            />
          </div>
          <Input
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            placeholder="Filter by plan ID"
            className="h-9 w-40"
          />
          <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      ) : subscribers.length === 0 ? (
        <p className="text-center py-12 text-gray-400">No subscribers found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className={`${isDark ? "bg-gray-800" : "bg-gray-100"} text-left`}>
                  <th className="px-4 py-2">Account</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">User Type</th>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Valid Until</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <td className="px-4 py-2">
                      <div className="font-medium">{sub.firstName} {sub.lastName}</div>
                      <div className="text-xs text-gray-400">{sub.accountId}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-xs">{sub.emailAddress}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${sub.userType === "artist" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                        {sub.userType}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs font-mono">{sub.subscription?.planId || "—"}</td>
                    <td className="px-4 py-2 text-xs">{formatDate(sub.subscription?.validUntil)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusBadge(sub.subscription?.status)}`}>
                        {sub.subscription?.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {subscribers.map((sub) => (
              <div key={sub._id} className={`rounded-lg p-4 shadow ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <p className="font-semibold">{sub.firstName} {sub.lastName}</p>
                <p className="text-xs text-gray-400">{sub.emailAddress}</p>
                <div className="mt-2 text-sm space-y-1">
                  <p><span className="text-gray-400">Type:</span> {sub.userType}</p>
                  <p><span className="text-gray-400">Plan:</span> {sub.subscription?.planId || "—"}</p>
                  <p><span className="text-gray-400">Valid Until:</span> {formatDate(sub.subscription?.validUntil)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${getStatusBadge(sub.subscription?.status)}`}>
                    {sub.subscription?.status || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => {
                    const newPage = page - 1;
                    setPage(newPage);
                    fetchSubscribers(newPage);
                  }}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => {
                    const newPage = page + 1;
                    setPage(newPage);
                    fetchSubscribers(newPage);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
