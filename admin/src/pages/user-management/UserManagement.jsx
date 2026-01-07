import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  FolderKanban,
  KeyRound,
  MoreHorizontal,
  Music,
  Upload,
} from "lucide-react";

import ManageLabelsModal from "../../components/user-management/ManageLabelsModal.jsx";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import ResetPasswordModal from "@/components/user-management/ResetPasswordModal.jsx";
import AssignedSublabels from "@/components/user-management/AssignedLabels.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import UserDetailsModal from "@/components/user-management/UserDetailsModal.jsx";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";

// Debounce hook
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

const EUserType = {
  ARTIST: 'artist',
  LABEL: 'label',
  AGGREGATOR: 'aggregator'
};

export default function UserManagement({ theme }) {
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("all");
  const debouncedSearch = useDebounce(search, 500);

  const [users, setUsers] = useState([]);
  const [isManageLabelsOpen, setIsManageLabelsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignedLabelsOpen, setIsAssignedLabelsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // State for the new details modal
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let extraParams = "&role=user";
      if (debouncedSearch) {
        extraParams += `&search=${debouncedSearch}`;
      }
      if (userType !== "all") {
        extraParams += `&userType=${userType}`;
      }

      const res = await GlobalApi.getUsers(currentPage, 10, extraParams);

      setUsers(res.data.data.users || []);
      const apiPagination = res.data.data.pagination;
      setPagination({
        totalPages: apiPagination?.totalPages || 1,
        totalItems: apiPagination?.totalCount || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, userType]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, userType]);


  const handleBack = () => {
    // This seems to be part of a different view logic not fully shown.
    // Assuming it's for a details page not currently implemented.
  };

  const handleTopManageLabels = () => {
    setSelectedUser(null);
    setIsManageLabelsOpen(true);
  };

  // Stats are now less accurate as they only reflect the current page of users.
  // Consider fetching these stats from a separate API endpoint if accuracy is needed.
  const totalUsers = users.length;
  const aggregators = users.filter((u) => u.userType === "aggregator").length;
  const artists = users.filter((u) => u.userType === "artist").length;
  const labels = users.filter((u) => u.userType === "label").length;

  const stats = [
    { label: "Total Users", value: pagination.totalItems },
    { label: "Aggregators", value: users.filter((u) => u.userType === "aggregator").length },
    { label: "Artists", value: users.filter((u) => u.userType === "artist").length },
    { label: "Labels", value: users.filter((u) => u.userType === "label").length },
  ];

  return (
    <div
      className={`p-4 md:p-6 space-y-6 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
        }`}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-600"
              } text-sm`}
          >
            Manage artists, labels, and aggregators in Maheshwari Visuals
          </p>
        </div>

        <div className="flex flex-row gap-2 whitespace-nowrap">
          <Button
            variant={isDark ? "outline" : "secondary"}
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" /> Export as CSV
          </Button>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleTopManageLabels}
          >
            Manage Labels
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"
              }`}
          >
            <p className="text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name, email, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"
            }`}
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className={`rounded-md px-3 py-2 text-sm capitalize ${isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200"
              : "bg-white border border-gray-300"
            }`}
        >
          <option value="all">All User Types</option>
          {Object.values(EUserType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>


      <div
        className={`rounded-lg shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"
          }`}
      >
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1500px]">
                <thead
                  className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}
                >
                  <tr>
                    {[
                      "User ID",
                      "Account Name",
                      "Stage Name",
                      "Account Type",
                      "Status",
                      "Membership",
                      "Email",
                      "Join Date",
                      "Actions",
                    ].map((header) => (
                      <th key={header} className="px-4 py-3 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => {
                    const stageName =
                      u.userType === "artist"
                        ? u?.artistData?.artistName
                        : u.userType === "label"
                          ? u?.labelData?.labelName
                          : u.userType === "aggregator"
                            ? u?.aggregatorData?.companyName
                            : "—";

                    return (
                      <tr
                        key={u._id}
                        className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"
                          }`}
                      >
                        <td className="px-4 py-3">{u.accountId}</td>
                        <td className="px-4 py-3">
                          {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "—"}
                        </td>
                        <td className="px-4 py-3">{stageName}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${u.userType === "artist"
                                ? "bg-purple-500/20 text-purple-400"
                                : u.userType === "label"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-orange-500/20 text-orange-400"
                              }`}
                          >
                            {u.userType}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${u.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                              }`}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="bg-green-500/20 px-2 py-1 rounded-full text-xs text-green-400">
                            Active
                          </span>
                        </td>

                        <td className="px-4 py-3">{u.emailAddress}</td>

                        <td className="px-4 py-3">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded-lg flex items-center gap-1"
                              onClick={() => {
                                const userName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
                                navigate(`/admin/release-management/${u._id}/${encodeURIComponent(userName)}`);
                              }}
                            >
                              <Music className="h-4 w-4" />
                              Manage Release
                            </Button>

                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded-lg flex items-center gap-1"
                              onClick={() => {
                                setSelectedUser(u);
                                setIsAssignedLabelsOpen(true);
                              }}

                            >
                              <FolderKanban className="h-4 w-4" />
                              Manage Label
                            </Button>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded-lg flex items-center gap-1"
                              onClick={() => {
                                setSelectedUser(u);
setIsResetPasswordOpen(true);
                              }}
                            >
                              <KeyRound className="h-4 w-4" />
                              Reset Password
                            </Button>


                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded-lg flex items-center gap-1"
                            >
                              <Upload className="h-4 w-4" />
                              Upload Catalog
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="rounded-lg border border-white/20"
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                className={`rounded-lg ${isDark
                                    ? "bg-[#151F28] text-gray-200 border-gray-700"
                                    : "bg-white text-gray-700 border-gray-200"
                                  }`}
                              >
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedUserForDetails(u);
                                  setIsUserDetailsModalOpen(true);
                                }}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center gap-3 px-4 py-4">

              <Button
                disabled={currentPage === 1}
                variant="outline"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1
                        ? "bg-purple-600 text-white"
                        : isDark
                          ? "bg-[#151F28] text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
      <ManageLabelsModal
        isOpen={isManageLabelsOpen}
        onClose={() => setIsManageLabelsOpen(false)}
        theme={theme}
        userId={null}
        userName="All Labels"
      />

      <AssignedSublabels
        isOpen={isAssignedLabelsOpen}
        onClose={() => setIsAssignedLabelsOpen(false)}
        userId={selectedUser?._id}
        theme={theme}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        userData={selectedUser}
        theme={theme}
      />
      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        user={selectedUserForDetails}
        theme={theme}
      />
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalItems}
        headers={[
          { label: "S.No.", key: "sno" },
          { label: "User ID", key: "accountId" },
          { label: "Account Name", key: "accountName" },
          { label: "Stage Name", key: "stageName" },
          { label: "Account Type", key: "userType" },
          { label: "Status", key: "isActive" },
          { label: "Membership", key: "membership" },
          { label: "Email", key: "emailAddress" },
          { label: "Join Date", key: "joinDate" },
        ]}
        fetchData={async (page, limit) => {
          try {
            let extraParams = "&role=user";
            if (debouncedSearch) {
              extraParams += `&search=${debouncedSearch}`;
            }
            if (userType !== "all") {
              extraParams += `&userType=${userType}`;
            }
            const res = await GlobalApi.getUsers(page, limit, extraParams);
            const usersToExport = res.data.data.users || [];
            
            // Transform data to match headers
            return usersToExport.map(u => {
              const stageName =
                u.userType === "artist"
                  ? u?.artistData?.artistName
                  : u.userType === "label"
                    ? u?.labelData?.labelName
                    : u.userType === "aggregator"
                      ? u?.aggregatorData?.companyName
                      : "—";
              const accountName = u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "—";
              
              return {
                accountId: u.accountId,
                accountName: accountName,
                stageName: stageName,
                userType: u.userType,
                isActive: u.isActive ? "Active" : "Inactive",
                membership: "Active", // Placeholder as in UI
                emailAddress: u.emailAddress,
                joinDate: new Date(u.createdAt).toLocaleDateString(),
              }
            });
          } catch (err) {
            console.error("❌ Error fetching users for export:", err);
            toast.error("Failed to load data for export");
            return [];
          }
        }}
        filename="users"
        title="Export Users"
        description="Select a data range of users to export as a CSV file."
      />
    </div>
  );
}
