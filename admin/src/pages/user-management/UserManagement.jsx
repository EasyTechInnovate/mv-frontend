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
import CsvUploadModal from "@/components/csv-upload/CsvUploadModal";
import ManageWalletModal from "@/components/user-management/ManageWalletModal";
import SetAggregatorBannerModal from "@/components/user-management/SetAggregatorBannerModal";
import EditKycModal from "../../components/user-management/EditKycModal";
import EditPayoutMethodsModal from "../../components/user-management/EditPayoutMethodsModal";
import EditProfileModal from "../../components/user-management/EditProfileModal";

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
  const [apiStats, setApiStats] = useState({ totalUsers: 0, aggregators: 0, artists: 0, labels: 0 });
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // New Filter States
  const [kycStatus, setKycStatus] = useState("all");
  const [subscriptionStatus, setSubscriptionStatus] = useState("all");
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // State for the new details modal
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

  // CSV Upload State
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [csvUploadUser, setCsvUploadUser] = useState(null);

  // Wallet Management State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedWalletUser, setSelectedWalletUser] = useState(null);

  // Aggregator Banner State
  const [isAggregatorBannerModalOpen, setIsAggregatorBannerModalOpen] = useState(false);
  const [selectedAggregatorUser, setSelectedAggregatorUser] = useState(null);

  // Edit KYC State
  const [isEditKycModalOpen, setIsEditKycModalOpen] = useState(false);
  const [isEditPayoutModalOpen, setIsEditPayoutModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10,
        role: 'user'
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (userType !== "all") params.userType = userType;
      if (kycStatus !== "all") params.kycStatus = kycStatus;
      if (subscriptionStatus !== "all") params.subscriptionStatus = subscriptionStatus;
      if (isActiveFilter !== "all") params.isActive = isActiveFilter === "active" ? "true" : "false";
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await GlobalApi.getUsers(params);

      setUsers(res.data.data.users || []);
      const apiPagination = res.data.data.pagination;
      setPagination({
        totalPages: apiPagination?.totalPages || 1,
        totalItems: apiPagination?.totalCount || 0,
      });
      if (res.data.data.stats) {
        setApiStats(res.data.data.stats);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, userType, kycStatus, subscriptionStatus, isActiveFilter, startDate, endDate]);
  
  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, userType, kycStatus, subscriptionStatus, isActiveFilter, startDate, endDate]);


  const handleBack = () => {
    // This seems to be part of a different view logic not fully shown.
    // Assuming it's for a details page not currently implemented.
  };

  const handleTopManageLabels = () => {
    setSelectedUser(null);
    setIsManageLabelsOpen(true);
  };

  const handleToggleStatus = async (user) => {
    if (!window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this account?`)) return;

    try {
      setLoading(true);
      const res = await GlobalApi.toggleUserStatus(user._id);
      toast.success(res.data.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Users", value: apiStats.totalUsers },
    { label: "Aggregators", value: apiStats.aggregators },
    { label: "Artists", value: apiStats.artists },
    { label: "Labels", value: apiStats.labels },
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

      {/* Filter Bar */}
      <div className={`p-4 rounded-xl border ${isDark ? "bg-[#151F28] border-gray-800" : "bg-white border-gray-200"} shadow-sm space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Search User</p>
            <Input
              placeholder="Name, Email, Account ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"} h-10`}
            />
          </div>

          {/* Account Type */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Account Type</p>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={`w-full h-10 rounded-md px-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none border ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
            >
              <option value="all">All Types</option>
              <option value="artist">Artist</option>
              <option value="label">Label</option>
              <option value="aggregator">Aggregator</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Account Status</p>
            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className={`w-full h-10 rounded-md px-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none border ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Membership Status */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Membership</p>
            <select
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              className={`w-full h-10 rounded-md px-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none border ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
            >
              <option value="all">All Plans</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* KYC Status */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">KYC Status</p>
            <select
              value={kycStatus}
              onChange={(e) => setKycStatus(e.target.value)}
              className={`w-full h-10 rounded-md px-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none border ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
            >
              <option value="all">All KYC</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="unverified">Unverified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-between gap-4 pt-2 border-t border-gray-800/10 dark:border-gray-800/50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col">
              <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Join From</p>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-40 h-10 ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-medium text-gray-500 mb-1.5 ml-1">Join To</p>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-40 h-10 ${isDark ? "bg-gray-900/50 border-gray-700 text-gray-100" : "bg-gray-50/50 border-gray-200 text-gray-900"}`}
              />
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearch("");
              setUserType("all");
              setIsActiveFilter("all");
              setSubscriptionStatus("all");
              setKycStatus("all");
              setStartDate("");
              setEndDate("");
            }}
            className="text-gray-500 hover:text-purple-500 transition-colors h-10 px-4"
          >
            Clear All Filters
          </Button>
        </div>
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
                      "User Name",
                      "Account Name",
                      "Account Type",
                      "Status",
                      "Membership",
                      "Email",
                      "Join Date",
                      "KYC Status",
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
                            : "";

                    return (
                      <tr
                        key={u._id}
                        className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"
                          }`}
                      >
                        <td className="px-4 py-3">{u.accountId}</td>
                        <td className="px-4 py-3">
                          {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : ""}
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            u.subscription?.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                            u.subscription?.status === 'trialing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {u.subscription?.status ? u.subscription.status.charAt(0).toUpperCase() + u.subscription.status.slice(1) : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-4 py-3">{u.emailAddress}</td>

                        <td className="px-4 py-3">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              u.kyc?.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                              u.kyc?.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              u.kyc?.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {u.kyc?.status ? u.kyc.status.charAt(0).toUpperCase() + u.kyc.status.slice(1) : 'Unverified'}
                          </span>
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
                              onClick={() => {
                                setCsvUploadUser(u);
                                setIsCsvUploadOpen(true);
                              }}
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
                                  setSelectedWalletUser(u);
                                  setIsWalletModalOpen(true);
                                }}>
                                  Manage Wallet
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedUserForDetails(u);
                                  setIsEditProfileModalOpen(true);
                                }}>
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedUserForDetails(u);
                                  setIsUserDetailsModalOpen(true);
                                }}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedUserForDetails(u);
                                  setIsEditKycModalOpen(true);
                                }}>
                                  Edit KYC
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedUserForDetails(u);
                                  setIsEditPayoutModalOpen(true);
                                }}>
                                  Edit Payouts
                                </DropdownMenuItem>
                                {u.userType === "aggregator" && (
                                  <DropdownMenuItem onSelect={() => {
                                    setSelectedAggregatorUser(u);
                                    setIsAggregatorBannerModalOpen(true);
                                  }}>
                                    Set Aggregator Banner
                                  </DropdownMenuItem>
                                )}
                                  <DropdownMenuItem 
                                    onSelect={() => handleToggleStatus(u)}
                                    className={u.isActive ? "text-red-500" : "text-green-500"}
                                  >
                                    {u.isActive ? "Deactivate Account" : "Activate Account"}
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
        onUserUpdated={fetchUsers}
      />
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
        totalItems={pagination.totalItems}
        headers={[
          { label: "NO.", key: "no" },
          { label: "First Name", key: "firstName" },
          { label: "Last Name", key: "lastName" },
          { label: "Account_id", key: "accountId" },
          { label: "User Email", key: "email" },
          { label: "Mobile Number", key: "phoneNumber" },
          { label: "User Address", key: "address" },
          { label: "Pincode", key: "pincode" },
          { label: "State", key: "state" },
          { label: "Country", key: "country" },
          { label: "User Type", key: "userType" },
          { label: "Account Name", key: "artistName" },
          { label: "Youtube Url", key: "youtube" },
          { label: "Facebook Url", key: "facebook" },
          { label: "Instagram Url", key: "instagram" },
          { label: "Spotify Profile Url", key: "spotify" },
          { label: "Apple Music Url", key: "appleMusic" },
          { label: "Saavan Url", key: "saavn" },
          { label: "Amazon Url", key: "amazon" },
          { label: "How Did You Know", key: "known_about_us" },
          { label: "LinkedIn Url", key: "social_media1" },
          { label: "TikTok Url", key: "social_media2" },
          { label: "Twitter Url", key: "social_media3" },
          { label: "Website Link", key: "social_media4" },
          { label: "label_name", key: "label_name" },
          { label: "label_youtube_channel_url", key: "label_youtube" },
          { label: "label_instagram_url", key: "label_instagram" },
          { label: "label_facebook_url", key: "label_facebook" },
          { label: "label_website", key: "label_website" },
          { label: "label_popular_links", key: "label_popular_links" },
          { label: "label_release_your_music (Freq)", key: "label_freq" },
          { label: "label_release_your_music_dwm", key: "label_dwm" },
          { label: "label_no_of_release_month", key: "label_monthly" },
          { label: "Label Account Info (Brief)", key: "label_info" },
          { label: "User Account Name", key: "bankHolder" },
          { label: "User Bank Name", key: "bankName" },
          { label: "User Account Number", key: "bankAccountNumber" },
          { label: "User Account Ifsc", key: "bankIfsc" },
          { label: "Paypal Account Id", key: "paypalEmail" },
          { label: "Join Date", key: "joinDate" },
          { label: "KYC Status", key: "kyc_status" },
          { label: "KYC Residency", key: "kyc_residency" },
          { label: "Aadhaar No", key: "kyc_aadhaar" },
          { label: "PAN No", key: "kyc_pan" },
          { label: "GST/Udhyam No", key: "kyc_gst" },
          { label: "Passport No", key: "kyc_passport" },
          { label: "VAT No", key: "kyc_vat" },
          { label: "National ID No", key: "kyc_national_id" },
          { label: "UPI ID", key: "upi_id" },
          { label: "UPI Holder Name", key: "upi_holder" },
          { label: "Aggregator Services", key: "additional_services" },
          { label: "Associated Labels", key: "associated_labels" },
          { label: "Popular Release Links (Agg)", key: "agg_release_links" },
          { label: "Email Verified", key: "verify_email" },
          { label: "Bank Verified", key: "verify_bank" },
          { label: "UPI Verified", key: "verify_upi" },
          { label: "Paypal Verified", key: "verify_paypal" },
          { label: "Account Status", key: "acc_status" },
          { label: "Membership Plan", key: "mem_plan" },
          { label: "Membership Status", key: "mem_status" },
          { label: "Membership Start Date", key: "mem_start" },
          { label: "Membership End Date", key: "mem_end" },
          { label: "Net Revenue Share", key: "net_revenue_share" }
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
            
            // Transform data to match headers meticulously
            return usersToExport.map((u, index) => {
              const stageName =
                u.userType === 'artist' 
                  ? u?.artistData?.artistName || "" 
                  : u.userType === 'label' 
                  ? u?.labelData?.labelName || "" 
                  : u.userType === 'aggregator' 
                  ? u?.aggregatorData?.companyName || "" 
                  : "";

              // Helpers
              const joinArr = (arr) => Array.isArray(arr) ? arr.filter(Boolean).join('; ') : (arr || "");
              const formatBool = (val) => val ? "Yes" : "No";
              const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
              const formatDate = (date) => date ? new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(date)) : "";

              return {
                no: (page - 1) * limit + (index + 1),
                firstName: u.firstName || "",
                lastName: u.lastName || "",
                accountId: u.accountId || "",
                email: u.emailAddress || "",
                phoneNumber: u.phoneNumber?.internationalNumber || u.phoneNumber || "",
                address: u.address?.street || u.address?.address || u.address?.line1 || "",
                pincode: u.address?.pinCode || u.address?.pincode || "",
                state: u.address?.state || "",
                country: u.address?.country || "",
                userType: u.userType || "",
                artistName: stageName,
                youtube: u.socialMedia?.youtube || u.artistData?.youtubeLink || "",
                facebook: u.socialMedia?.facebook || u.artistData?.facebookLink || "",
                instagram: u.socialMedia?.instagram || u.artistData?.instagramLink || "",
                spotify: u.socialMedia?.spotify || "",
                appleMusic: u.socialMedia?.appleMusic || "",
                saavn: u.socialMedia?.saavn || "",
                amazon: u.socialMedia?.amazon || "",
                known_about_us: u.aggregatorData?.howDidYouKnow ? `${u.aggregatorData.howDidYouKnow}${u.aggregatorData.howDidYouKnowOther ? ` (${u.aggregatorData.howDidYouKnowOther})` : ""}` : (u.howDidYouKnow || ""),
                social_media1: u.aggregatorData?.linkedinUrl || u.socialMedia?.linkedin || "",
                social_media2: u.socialMedia?.tiktok || "",
                social_media3: u.socialMedia?.twitter || "",
                social_media4: u.labelData?.websiteLink || u.aggregatorData?.websiteLink || u.socialMedia?.website || "",
                label_name: u.labelData?.labelName || "",
                label_youtube: u.labelData?.youtubeLink || "",
                label_instagram: u.labelData?.instagramLink || "",
                label_facebook: u.labelData?.facebookLink || "",
                label_website: u.labelData?.websiteLink || "",
                label_popular_links: joinArr(u.labelData?.popularArtistLinks),
                label_freq: u.labelData?.releaseFrequency || u.aggregatorData?.releaseFrequency || "",
                label_dwm: "",
                label_monthly: u.labelData?.monthlyReleasePlans || u.aggregatorData?.monthlyReleasePlans || "",
                label_info: u.labelData?.briefInfo || u.aggregatorData?.briefInfo || "",
                bankHolder: u.payoutMethods?.bank?.accountHolderName || "",
                bankName: u.payoutMethods?.bank?.bankName || "",
                bankAccountNumber: u.payoutMethods?.bank?.accountNumber || "",
                bankIfsc: u.payoutMethods?.bank?.ifscSwiftCode || "",
                paypalEmail: u.payoutMethods?.paypal?.paypalEmail || "",
                joinDate: formatDate(u.createdAt),
                kyc_status: u.kyc?.status || "unverified",
                kyc_residency: u.kyc?.residencyType || "",
                kyc_aadhaar: u.kyc?.details?.aadhaarNumber || "",
                kyc_pan: u.kyc?.details?.panNumber || "",
                kyc_gst: u.kyc?.details?.gstUdhyamNumber || "",
                kyc_passport: u.kyc?.details?.passportNumber || "",
                kyc_vat: u.kyc?.details?.vatNumber || "",
                kyc_national_id: u.kyc?.details?.nationalIdNumber || "",
                upi_id: u.payoutMethods?.upi?.upiId || "",
                upi_holder: u.payoutMethods?.upi?.accountHolderName || "",
                additional_services: joinArr(u.aggregatorData?.additionalServices),
                associated_labels: joinArr(u.aggregatorData?.associatedLabels),
                agg_release_links: joinArr(u.aggregatorData?.popularReleaseLinks),
                verify_email: formatBool(u.isEmailVerified),
                verify_bank: formatBool(u.payoutMethods?.bank?.verified),
                verify_upi: formatBool(u.payoutMethods?.upi?.verified),
                verify_paypal: formatBool(u.payoutMethods?.paypal?.verified),
                acc_status: u.isActive ? "Active" : "Inactive",
                mem_plan: u.subscription?.planId || "Free",
                mem_status: u.subscription?.status || "Inactive",
                mem_start: formatDate(u.subscription?.validFrom || u.aggregatorSubscription?.startDate),
                mem_end: formatDate(u.subscription?.validUntil || u.aggregatorSubscription?.endDate),
                net_revenue_share: u.subscription?.netRevenueShare !== undefined ? `${u.subscription.netRevenueShare}%` : "0%"
              };
            });
          } catch (err) {
            console.error("❌ Error fetching users for export:", err);
            toast.error("Failed to load data for export");
            return [];
          }
        }}
        filename="users"
        title="Export Users"
        description="Select a data range of users to export as a CSV file with full profile details."
      />
      <CsvUploadModal
        isOpen={isCsvUploadOpen}
        onClose={() => {
          setIsCsvUploadOpen(false);
          setCsvUploadUser(null);
        }}
        userId={csvUploadUser?._id}
        userName={csvUploadUser ? `${csvUploadUser.firstName || ''} ${csvUploadUser.lastName || ''}`.trim() : ''}
        theme={theme}
        onSuccess={() => {
          // Optional: refresh data or show success message if needed
        }}
      />
      <ManageWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
          setSelectedWalletUser(null);
        }}
        user={selectedWalletUser}
        theme={theme}
      />
      <SetAggregatorBannerModal
        isOpen={isAggregatorBannerModalOpen}
        onClose={() => {
          setIsAggregatorBannerModalOpen(false);
          setSelectedAggregatorUser(null);
          fetchUsers(); // Refresh to get the latest banner data
        }}
        user={selectedAggregatorUser}
        theme={theme}
      />
      <EditKycModal
        isOpen={isEditKycModalOpen}
        onClose={() => {
          setIsEditKycModalOpen(false);
          setSelectedUserForDetails(null);
          fetchUsers();
        }}
        user={selectedUserForDetails}
        theme={theme}
        onSuccess={fetchUsers}
      />
      <EditPayoutMethodsModal
        isOpen={isEditPayoutModalOpen}
        onClose={() => {
          setIsEditPayoutModalOpen(false);
          setSelectedUserForDetails(null);
          fetchUsers();
        }}
        user={selectedUserForDetails}
        theme={theme}
        onSuccess={fetchUsers}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => {
          setIsEditProfileModalOpen(false);
          setSelectedUserForDetails(null);
          fetchUsers();
        }}
        user={selectedUserForDetails}
        theme={theme}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
