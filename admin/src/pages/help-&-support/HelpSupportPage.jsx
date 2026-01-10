import { useState, useEffect } from "react";
import { Search, Download, MessageSquare, Loader2 } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import SupportTicketDetail from "@/components/help-&-support/SupportTicketDetail";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import { toast } from "sonner";

export default function HelpSupport({ theme = "dark" }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
        const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
      
        const cardClass = `${theme === "dark" ? "bg-[#151F28]" : "bg-white"
          } p-5 rounded-2xl shadow flex flex-col`;
      
        const textColors =
          theme === "dark"
            ? {
              primary: "text-white",
              secondary: "text-gray-400",
              muted: "text-gray-500",
            }
            : {
              primary: "text-black",
              secondary: "text-gray-600",
              muted: "text-gray-500",
            };
      
        const bgColors =
          theme === "dark"
            ? {
              input: "bg-[#111A22] text-white",
              select: "bg-[#111A22] text-white hover:bg-gray-700",
              button: "bg-[#111A22] text-white hover:bg-gray-700",
              rowHover: "hover:bg-gray-800/40 border-gray-800",
            }
            : {
              input: "bg-gray-200 text-black",
              select: "bg-gray-200 text-black hover:bg-gray-300",
              button: "bg-gray-200 text-black hover:bg-gray-300",
              rowHover: "hover:bg-gray-100 border-gray-200",
            };
      
        const badgeColors = {
          category: {
            Technical:
              "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
            Billing:
              "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            Account:
              "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
            Content:
              "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            General:
              "bg-gray-200 text-gray-600 dark:bg-gray-700/30 dark:text-gray-300",
          },
          priority: {
            High: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            Medium:
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
            Low: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            Critical:
              "bg-red-200 text-red-700 dark:bg-red-800/40 dark:text-red-300",
          },
          status: {
            open: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            pending:
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
            resolved:
              "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            closed:
              "bg-gray-200 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400",
          },
        };
      
        // Debounce search query
        useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit,
          search: debouncedSearchQuery || undefined,
          status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
          priority: priorityFilter === "All" ? undefined : priorityFilter.toLowerCase(),
          // category is no longer a top-level filter
        };
        
        const res = await GlobalApi.getAllSupportTickets(params);
        const { tickets, pagination } = res.data.data;
        setTickets(tickets || []);
        setPagination(pagination || {});
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [page, limit, debouncedSearchQuery, statusFilter, priorityFilter]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await GlobalApi.getSupportTicketStats("month");
        setStats(res.data.data.overallStats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (selectedTicket) {
    return (
      <SupportTicketDetail
        theme={theme}
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
      />
    );
  }

  return (


    <div
      className={`${theme === "dark" ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"
        } min-h-screen p-4 sm:p-6 rounded-2xl`}
    >

      <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${textColors.primary}`}>
        Help & Support (Tickets)
      </h1>
      <p className={`text-sm mb-6 ${textColors.secondary}`}>
        Manage support tickets with filters by status, priority, and user ID
      </p>

      {stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <div className={cardClass}>
              <p className={textColors.secondary}>Open Tickets</p>
              <p className="text-2xl font-bold text-red-400 mt-2">
                {stats.openTickets}
              </p>
              <span className={`text-xs mt-1 ${textColors.muted}`}>
                Needs immediate attention
              </span>
            </div>
            <div className={cardClass}>
              <p className={textColors.secondary}>Pending</p>
              <p className="text-2xl font-bold text-yellow-400 mt-2">
                {stats.pendingTickets}
              </p>
              <span className={`text-xs mt-1 ${textColors.muted}`}>
                Awaiting response
              </span>
            </div>
            <div className={cardClass}>
              <p className={textColors.secondary}>Resolved</p>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {stats.resolvedTickets}
              </p>
              <span className={`text-xs mt-1 ${textColors.muted}`}>
                Ready to close
              </span>
            </div>
            <div className={cardClass}>
              <p className={textColors.secondary}>Closed</p>
              <p className="text-2xl font-bold text-gray-400 mt-2">
                {stats.closedTickets}
              </p>
              <span className={`text-xs mt-1 ${textColors.muted}`}>
                Completed tickets
              </span>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 mt-2 text-sm ${textColors.secondary}`}
          >
            <div className={`${cardClass} py-3`}>
              Critical Tickets:{" "}
              <span className="font-semibold text-red-400">
                {stats.criticalTickets}
              </span>
            </div>
            <div className={`${cardClass} py-3`}>
              High Priority:{" "}
              <span className="font-semibold text-yellow-400">
                {stats.highPriorityTickets}
              </span>
            </div>
            <div className={`${cardClass} py-3`}>
              Escalated:{" "}
              <span className="font-semibold text-orange-400">
                {stats.escalatedTickets}
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className={`mb-6 ${textColors.secondary}`}>Loading stats...</p>
      )}

      <div
        className={`${theme === "dark" ? "bg-[#151F28]" : "bg-white"
          } p-4 rounded-2xl shadow mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between`}
      >
        <div
          className={`flex items-center rounded-lg px-3 py-2 w-full sm:w-1/2 ${bgColors.input}`}
        >
          <Search
            className={`w-4 h-4 mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          />
          <input
            type="text"
            placeholder="Search by subject, user, ticket number..."
            className="bg-transparent text-sm focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            className={`text-sm rounded-lg px-3 py-2 ${bgColors.select}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select
            className={`text-sm rounded-lg px-3 py-2 ${bgColors.select}`}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Critical</option>
          </select>

          <button
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${bgColors.button}`}
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" /> Export as CSV
          </button>
        </div>
      </div>

      <div
        className={`${theme === "dark" ? "bg-[#151F28]" : "bg-white"
          } rounded-2xl shadow overflow-x-auto`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                className={
                  theme === "dark"
                    ? "text-gray-400 border-b border-gray-700"
                    : "text-gray-600 border-b border-gray-200"
                }
              >
                <th className="text-left whitespace-nowrap py-3 px-4">Ticket Id</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Account Id</th>
                <th className="text-left whitespace-nowrap py-3 px-4">User</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Subject</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Ticket Type</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Priority</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Status</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Assigned To</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Created</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Responses</th>
                <th className="text-left whitespace-nowrap py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((t, i) => (
                  <tr key={i} className={`last:border-none ${bgColors.rowHover}`}>
                    <td className="py-3 px-4">{t.ticketId}</td>
                    <td className="py-3 px-4">{t.userId?.accountId}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>
                          {t.userId?.firstName} {t.userId?.lastName}
                        </p>
                        <p className={`text-xs ${textColors.secondary}`}>
                          {t.contactEmail || t.userId?.emailAddress}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{t.subject}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${"bg-gray-200 text-gray-600 dark:bg-gray-700/30 dark:text-gray-300"
                          }`}
                      >
                        {t.ticketType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${badgeColors.priority[
                          t.priority?.charAt(0).toUpperCase() +
                          t.priority?.slice(1).toLowerCase()
                        ] || "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${badgeColors.status[t.status?.toLowerCase()] ||
                          "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {typeof t.assignedTo === "object" && t.assignedTo !== null
                        ? `${t.assignedTo.firstName ?? ""} ${t.assignedTo.lastName ?? ""}`.trim()
                        : t.assignedTo || "Unassigned"}
                    </td>

                    <td className="py-3 px-4">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>


                    <td className="py-3 px-4 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      {t.responses?.length || 0}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        className={`px-3.5 py-2 rounded-lg text-xs ${bgColors.button}`}
                        onClick={() => setSelectedTicket(t)}

                      >
                        View
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded-lg text-sm ${page <= 1
              ? "opacity-50 cursor-not-allowed"
              : bgColors.button
              }`}
          >
            Prev
          </button>
          <span className={textColors.secondary}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded-lg text-sm ${page >= pagination.totalPages
              ? "opacity-50 cursor-not-allowed"
              : bgColors.button
              }`}
          >
            Next
          </button>
        </div>
      )}
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalCount || 0}
        headers={[
          { label: "S.No.", key: "sno" },
          { label: "Ticket #", key: "ticketId" },
          { label: "Account ID", key: "accountId" },
          { label: "User", key: "userName" },
          { label: "User Email", key: "userEmail" },
          { label: "Subject", key: "subject" },
          { label: "Category", key: "category" },
          { label: "Priority", key: "priority" },
          { label: "Status", key: "status" },
          { label: "Assigned To", key: "assignedToName" },
          { label: "Created Date", key: "createdAt" },
          { label: "Responses Count", key: "responsesCount" },
        ]}
        fetchData={async (page, limit) => {
          try {
            // Build params object with page, limit and filters
            const params = {
              page,
              limit,
            };
            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== "All") params.status = statusFilter.toLowerCase();
            if (priorityFilter !== "All") params.priority = priorityFilter.toLowerCase();
            if (categoryFilter !== "All") params.category = categoryFilter;

            const res = await GlobalApi.getAllSupportTickets(params);
            const ticketsToExport = res?.data?.data?.tickets || [];

            return ticketsToExport.map((t, index) => ({
              sno: index + 1,
              ticketId: t.ticketId,
              accountId: t.userId?.accountId || "-",
              userName: `${t.userId?.firstName || ""} ${t.userId?.lastName || ""}`.trim() || "-",
              userEmail: t.contactEmail || t.userId?.emailAddress || "-",
              subject: t.subject,
              category: t.category,
              priority: t.priority,
              status: t.status,
              assignedToName: typeof t.assignedTo === "object" && t.assignedTo !== null
                ? `${t.assignedTo.firstName ?? ""} ${t.assignedTo.lastName ?? ""}`.trim()
                : t.assignedTo || "Unassigned",
              createdAt: new Date(t.createdAt).toLocaleDateString(),
              responsesCount: t.responses?.length || 0,
            }));
          } catch (err) {
            console.error("❌ Error fetching tickets for export:", err);
            toast.error("Failed to fetch data for export.");
            return [];
          }
        }}
        filename="admin_support_tickets"
        title="Export Admin Support Tickets"
        description="Select a data range of support tickets to export as a CSV file."
      />
    </div>
  );
}
