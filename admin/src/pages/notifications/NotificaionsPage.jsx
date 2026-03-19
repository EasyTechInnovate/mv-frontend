import { useState, useEffect } from "react";
import { Bell, Send, Filter, Loader2, RefreshCw, User, X, Trash2, ListChecks } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "../../lib/GlobalApi";
import UserPickerDialog from "../../components/UserPickerDialog";

const CATEGORY_LABELS = {
  royalty_update: "Royalty Update",
  bonus_royalty_update: "Bonus Royalty",
  mcn_update: "MCN Update",
  analytics_update: "Analytics",
  catalog_live: "Catalog Live",
  catalog_takedown: "Takedown",
  custom: "Custom",
};

const TARGET_LABELS = {
  specific_user: "Specific User(s)",
  all_artists: "All Artists",
  all_labels: "All Labels",
  all_aggregators: "All Aggregators",
  all_users: "All Users",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationPage({ theme = "dark" }) {
  const isDark = theme === "dark";

  // ─── Notifications List ───────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ type: "", category: "", status: "" });

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Compose Form ─────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("all_users");
  const [selectedUsers, setSelectedUsers] = useState([]); // array of user objects
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  // ─── Fetch Notifications ──────────────────────────────────
  const fetchNotifications = async (page, f) => {
    setListLoading(true);
    try {
      const params = { page, limit: 20 };
      if (f.type) params.type = f.type;
      if (f.category) params.category = f.category;
      if (f.status !== "") params.status = f.status === "true";
      const res = await GlobalApi.getAdminNotifications(params);
      setNotifications(res.data?.data?.notifications ?? []);
      setPagination(res.data?.data?.pagination ?? null);
    } catch {
      setNotifications([]);
      setPagination(null);
    } finally {
      setListLoading(false);
    }
  };

  // Fetch whenever page changes (uses latest filters via closure)
  useEffect(() => {
    fetchNotifications(currentPage, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // ─── Apply Filters ────────────────────────────────────────
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchNotifications(1, filters);
  };

  // ─── Toggle Status ────────────────────────────────────────
  const handleToggleStatus = async (notif) => {
    try {
      await GlobalApi.toggleAdminNotificationStatus(notif.notificationId, {
        status: !notif.status,
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notif.notificationId ? { ...n, status: !n.status } : n
        )
      );
    } catch {
      // ignore
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const isAllSelected = notifications.length > 0 && notifications.every(n => selectedNotifs.includes(n.notificationId));

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedNotifs(prev => {
        const newSelected = [...prev];
        notifications.forEach(n => {
          if (!newSelected.includes(n.notificationId)) {
            newSelected.push(n.notificationId);
          }
        });
        return newSelected;
      });
    } else {
      const notifIdsOnPage = notifications.map(n => n.notificationId);
      setSelectedNotifs(prev => prev.filter(id => !notifIdsOnPage.includes(id)));
    }
  };

  const handleSelectNotif = (notifId) => {
    setSelectedNotifs((prev) =>
      prev.includes(notifId) ? prev.filter((id) => id !== notifId) : [...prev, notifId]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedNotifs.length) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedNotifs.length} notifications?`)) return;

    try {
      setIsDeleting(true);
      await GlobalApi.bulkDeleteAdminNotifications({ notificationIds: selectedNotifs });
      toast.success("Notifications deleted successfully.");
      setIsBulkMode(false);
      setSelectedNotifs([]);
      fetchNotifications(currentPage, filters);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete notifications.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async (notifId) => {
    if (!window.confirm("Are you sure you want to permanently delete this notification?")) return;

    try {
      setIsDeleting(true);
      await GlobalApi.deleteAdminNotification(notifId);
      toast.success("Notification deleted successfully.");
      fetchNotifications(currentPage, filters);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete notification.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Send Notification ────────────────────────────────────
  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setSendError("Title and message are required.");
      return;
    }
    if (targetType === "specific_user" && selectedUsers.length === 0) {
      setSendError("Please select at least one user.");
      return;
    }
    setSending(true);
    setSendError("");
    setSendSuccess("");
    try {
      const payload = { title, message, targetType };
      if (targetType === "specific_user") {
        payload.targetUser = selectedUsers.map(u => u._id);
      }
      await GlobalApi.createAdminNotification(payload);
      setSendSuccess("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setTargetType("all_users");
      setSelectedUsers([]);
      // Refresh list
      setCurrentPage(1);
      fetchNotifications(1, filters);
    } catch (err) {
      setSendError(err?.response?.data?.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  // ─── Styles ───────────────────────────────────────────────
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const inputCls = `w-full p-3 rounded-lg bg-transparent border outline-none text-sm ${
    isDark ? "border-gray-700 text-white placeholder-gray-500" : "border-gray-300 text-gray-900 placeholder-gray-400"
  }`;
  const selectCls = `p-2 rounded-lg text-sm border outline-none ${
    isDark ? "bg-[#1C252E] border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"
  }`;

  return (
    <>
    <div className={`${isDark ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"} min-h-screen p-6 rounded-2xl`}>
      <h1 className="text-2xl font-bold mb-1">Notifications</h1>
      <p className="text-gray-400 text-sm mb-6">
        Manage platform notifications, announcements, and user communications
      </p>

      {/* Stats strip */}
      {pagination && (
        <div className={`${cardBg} rounded-xl p-4 mb-6 flex items-center gap-3`}>
          <Bell className="w-5 h-5 text-purple-400" />
          <span className="text-sm">
            <span className="font-semibold">{pagination.totalItems}</span>
            <span className={isDark ? " text-gray-400" : " text-gray-600"}> total notifications</span>
          </span>
        </div>
      )}

      {/* Compose + List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ── Compose Form ── */}
        <div className={`${cardBg} p-6 rounded-2xl shadow`}>
          <h3 className="text-lg font-semibold mb-1">Compose Notification</h3>
          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Create and send notifications to users
          </p>

          <input
            type="text"
            placeholder="Notification title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputCls} mb-3`}
          />

          <textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} mb-3 h-28 resize-none`}
          />

          <select
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setSelectedUsers([]); // clear selection when target type changes
            }}
            className={`${selectCls} w-full mb-3`}
          >
            <option value="all_users">All Users</option>
            <option value="all_artists">All Artists</option>
            <option value="all_labels">All Labels</option>
            <option value="all_aggregators">All Aggregators</option>
            <option value="specific_user">Specific User(s)</option>
          </select>

          {targetType === "specific_user" && (
            <div className="mb-3">
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedUsers.map(user => (
                    <div key={user._id} className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isDark ? "bg-[#1C252E] border-purple-700/50" : "bg-purple-50 border-purple-200"
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-medium">
                        {(user.firstName?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium max-w-[120px] truncate">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedUsers(prev => prev.filter(u => u._id !== user._id))}
                        className={`p-1 rounded transition ${isDark ? "hover:bg-gray-700" : "hover:bg-purple-100"}`}
                        title="Remove"
                      >
                        <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setShowPicker(true)}
                className={`w-full flex items-center gap-2 p-3 rounded-xl border border-dashed text-sm transition ${
                  isDark
                    ? "border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400"
                    : "border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600"
                }`}
              >
                <User className="w-4 h-4" />
                {selectedUsers.length > 0 ? "Add more users..." : "Click to select user(s)..."}
              </button>
            </div>
          )}

          {sendError && (
            <p className="text-red-400 text-xs mb-3">{sendError}</p>
          )}
          {sendSuccess && (
            <p className="text-green-400 text-xs mb-3">{sendSuccess}</p>
          )}

          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 justify-center w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>


        {/* ── Quick Preview ── */}
        <div className={`${cardBg} p-6 rounded-2xl shadow`}>
          <h3 className="text-lg font-semibold mb-1">Preview</h3>
          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            How the notification will appear to users
          </p>
          <div className={`rounded-xl p-4 border ${isDark ? "bg-[#1C252E] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title || "Notification Title"}</p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {message || "Your notification message will appear here..."}
                </p>
                <p className="text-[10px] text-gray-500 mt-2">
                  → {TARGET_LABELS[targetType]} · just now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notifications List Table ── */}
      <div className={`${cardBg} rounded-2xl p-6 shadow`}>
        {/* Table Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h3 className="text-lg font-semibold">All Notifications</h3>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className={selectCls}
            >
              <option value="">All Types</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className={selectCls}
            >
              <option value="">All Categories</option>
              <option value="royalty_update">Royalty Update</option>
              <option value="bonus_royalty_update">Bonus Royalty</option>
              <option value="mcn_update">MCN Update</option>
              <option value="analytics_update">Analytics</option>
              <option value="catalog_live">Catalog Live</option>
              <option value="catalog_takedown">Takedown</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className={selectCls}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Filter className="w-3.5 h-3.5" />
              Apply
            </button>
            <button
              onClick={() => fetchNotifications(currentPage, filters)}
              className={`p-2 rounded-lg transition ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsBulkMode(!isBulkMode);
                setSelectedNotifs([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition ${
                isBulkMode ? "bg-red-100 text-red-700" : isDark ? "bg-[#1C252E] hover:bg-gray-700 border border-gray-700" : "bg-white hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              {isBulkMode ? "Exit Bulk Mode" : "Bulk Actions"}
            </button>
            {isBulkMode && selectedNotifs.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedNotifs.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {listLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className={`text-center py-16 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            No notifications found
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-sm">
              <thead className={`border-b ${isDark ? "text-gray-400 border-gray-700" : "text-gray-600 border-gray-200"}`}>
                <tr>
                  {isBulkMode && (
                    <th className="py-2 px-3 text-left font-medium w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer accent-red-600"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th className="py-2 px-3 text-left font-medium">#</th>
                  <th className="py-2 px-3 text-left font-medium">Title</th>
                  <th className="py-2 px-3 text-left font-medium">Category</th>
                  <th className="py-2 px-3 text-left font-medium">Target</th>
                  <th className="py-2 px-3 text-left font-medium">Read</th>
                  <th className="py-2 px-3 text-left font-medium">Date</th>
                  <th className="py-2 px-3 text-left font-medium">Status / Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr
                    key={notif.notificationId}
                    className={`border-b ${isDark ? "border-gray-800" : "border-gray-100"} ${
                      selectedNotifs.includes(notif.notificationId) ? (isDark ? "bg-red-900/10" : "bg-red-50") : ""
                    }`}
                  >
                    {isBulkMode && (
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer accent-red-600"
                          checked={selectedNotifs.includes(notif.notificationId)}
                          onChange={() => handleSelectNotif(notif.notificationId)}
                        />
                      </td>
                    )}
                    <td className={`py-3 px-3 text-xs whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {notif.notificationId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium max-w-[180px] truncate">{notif.title}</p>
                      <p className={`text-xs mt-0.5 max-w-[180px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {notif.message}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notif.type === "system"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-purple-900/30 text-purple-400"
                      }`}>
                        {CATEGORY_LABELS[notif.category] || notif.category}
                      </span>
                    </td>
                    <td className={`py-3 px-3 text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {TARGET_LABELS[notif.targetType] || notif.targetType}
                    </td>
                    <td className={`py-3 px-3 text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {notif.readCount ?? 0}
                    </td>
                    <td className={`py-3 px-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {timeAgo(notif.createdAt)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(notif)}
                          title={notif.status ? "Deactivate" : "Activate"}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            notif.status ? "bg-purple-500" : isDark ? "bg-gray-700" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notif.status ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button
                           onClick={() => handleDelete(notif.notificationId)}
                           disabled={isDeleting}
                           className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                           title="Permanent Delete"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-700/40">
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-40 transition bg-purple-600 hover:bg-purple-700 text-white"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-40 transition bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* User Picker Dialog */}
    {showPicker && (
      <UserPickerDialog
        theme={theme}
        initialSelected={selectedUsers}
        onSelect={(users) => {
          setSelectedUsers(users);
          setShowPicker(false);
        }}
        onClose={() => setShowPicker(false)}
      />
    )}
    </>
  );
}
