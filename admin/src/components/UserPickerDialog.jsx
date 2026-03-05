import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, User } from "lucide-react";
import GlobalApi from "../lib/GlobalApi";

/**
 * UserPickerDialog
 * Opens a modal with a debounced search input.
 * Searches users by name, email, or accountId (MV/A/001, MV/AG/002 etc.)
 * On selection, calls onSelect(selectedUsersArray)
 */
export default function UserPickerDialog({ theme = "dark", initialSelected = [], onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(initialSelected);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const isDark = theme === "dark";

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 1000);
  }, []);

  // Debounced search — fires 400ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      try {
        const res = await GlobalApi.searchUsersForNotification(1, 100, query.trim());
        const users = res.data?.data?.users ?? res.data?.users ?? [];
        setResults(users);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const userTypeColor = (type) => {
    if (type === "artist") return "bg-purple-900/40 text-purple-300";
    if (type === "label") return "bg-blue-900/40 text-blue-300";
    if (type === "aggregator") return "bg-orange-900/40 text-orange-300";
    return "bg-gray-700 text-gray-300";
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u._id === user._id);
      if (isSelected) return prev.filter((u) => u._id !== user._id);
      return [...prev, user];
    });
  };

  const removeSelected = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
          isDark
            ? "bg-[#1C252E] border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold">Select Users</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 pt-4 pb-3">
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${
            isDark ? "bg-[#111A22] border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or ID (MV/A/001)..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
            />
            {loading && <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin flex-shrink-0" />}
            {query && !loading && (
              <button onClick={() => setQuery("")}>
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-200" />
              </button>
            )}
          </div>
          <p className={`text-[10px] mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Search by first/last name, email address, or MV account ID
          </p>
        </div>

        {/* Selected Users Chips */}
        {selectedUsers.length > 0 && (
          <div className={`px-4 pb-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto mb-2`}>
            {selectedUsers.map((u) => (
              <div
                key={u._id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
                  isDark ? "bg-[#111A22] border-gray-600 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <span className="font-medium truncate max-w-[120px]">
                  {u.firstName} {u.lastName}
                </span>
                <button
                  onClick={() => removeSelected(u._id)}
                  className="rounded hover:bg-red-500/20 hover:text-red-400 transition ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="max-h-72 overflow-y-auto px-2 pb-3 border-t pt-3" style={{ borderColor: isDark ? '#374151' : '#f3f4f6' }}>
          {!query.trim() ? (
            <div className={`text-center py-10 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Start typing to search users...
            </div>
          ) : loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            </div>
          ) : results.length === 0 && searched ? (
            <div className={`text-center py-10 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              No users found for "{query}"
            </div>
          ) : (
            results.map((u) => {
              const isSelected = selectedUsers.some((selected) => selected._id === u._id);
              return (
                <button
                  key={u._id}
                  onClick={() => toggleUser(u)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition flex items-center gap-3 mb-1 border ${
                    isSelected
                      ? (isDark ? "bg-purple-900/20 border-purple-500/50" : "bg-purple-50 border-purple-200")
                      : (isDark ? "border-transparent hover:bg-gray-700/60" : "border-transparent hover:bg-gray-50")
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
                    isSelected
                      ? "bg-purple-500 border-purple-500"
                      : (isDark ? "border-gray-500" : "border-gray-300")
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-sm text-white font-medium">
                    {(u.firstName?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {u.firstName} {u.lastName}
                      </span>
                      {u.userType && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${userTypeColor(u.userType)}`}>
                          {u.userType}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {u.emailAddress}
                    </p>
                    {u.accountId && (
                      <p className="text-[10px] text-purple-400 font-mono mt-0.5">
                        {u.accountId}
                      </p>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end gap-3 ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(selectedUsers);
              onClose();
            }}
            className="px-6 py-2 text-sm font-medium rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Select {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
