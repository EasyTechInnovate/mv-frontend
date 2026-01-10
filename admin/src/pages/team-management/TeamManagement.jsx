import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InviteTeamMemberModal from "@/components/team-management/InviteTeamMemberModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { ETeamRole, EDepartment, ETeamMemberStatus } from "./teamEnums";

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

export default function TeamManagement({ theme }) {
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({});
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingMemberData, setEditingMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    memberId: null,
    memberName: "",
  });

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter !== "all") params.teamRole = roleFilter;
      if (departmentFilter !== "all") params.department = departmentFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const [membersRes, statsRes] = await Promise.all([
        GlobalApi.getAllTeamMembers(params),
        GlobalApi.getTeamStatistics(),
      ]);

      const membersPayload = membersRes?.data?.data?.teamMembers ?? [];
      const mappedMembers = membersPayload.map((m) => {
        const name = `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "-";
        const email = m.emailAddress ?? "-";
        const role = m.teamRole ?? m.role ?? "-";
        const department = m.department ?? "-";

        let status = "Inactive";
        if (m.isActive) status = "Active";
        else if (!m.isInvitationAccepted) status = "Pending";

        return {
          _id: m._id, name, email, role, department, status,
          isInvitationAccepted: m.isInvitationAccepted ?? false,
          joinDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "-",
          lastActive: m.loginInfo?.lastLogin ? new Date(m.loginInfo.lastLogin).toLocaleDateString() : "-",
          raw: m,
        };
      });

      setMembers(mappedMembers);
      setPagination(membersRes?.data?.data?.pagination ?? { totalPages: 1 });
      
      const statsPayload = statsRes?.data?.data;
      setStats({
        totalMembers: statsPayload?.totalTeamMembers,
        activeMembers: statsPayload?.activeTeamMembers,
        pendingInvites: statsPayload?.pendingInvitations,
        inactiveTeamMembers: statsPayload?.inactiveTeamMembers,
      });

    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("Failed to load team data.");
      toast.error("Failed to load team data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [page, debouncedSearch, roleFilter, departmentFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, departmentFilter, statusFilter]);


  const handleEditClick = async (id) => {
    try {
      const res = await GlobalApi.getTeamMemberById(id);
      const member = res?.data?.data;
      if (member) {
        setEditingMemberId(id);
        setEditingMemberData(member);
        setInviteModalOpen(true);
      }
    } catch (err) {
      toast.error("Failed to fetch member details.");
      console.error("Failed to fetch member by ID:", err);
    }
  };

  const handleCloseModal = () => {
    setInviteModalOpen(false);
    setEditingMemberId(null);
    setEditingMemberData(null);
  };

  const handleRemoveClick = (member) => {
    setConfirmDialog({
      isOpen: true,
      memberId: member._id,
      memberName: member.name,
    });
  };

  const confirmRemove = async () => {
    const { memberId, memberName } = confirmDialog;
    try {
      await GlobalApi.deleteTeamMember(memberId);
      toast.success(`Member "${memberName}" removed successfully`);
      fetchTeamData();
    } catch (err) {
      console.error("Failed to delete member:", err);
      toast.error("Failed to remove member");
    } finally {
      setConfirmDialog({ isOpen: false, memberId: null, memberName: "" });
    }
  };

  const handleResendInvitation = async (memberId, memberName) => {
    try {
      await GlobalApi.resendTeamInvitation(memberId);
      toast.success(`Invitation resent to ${memberName}`);
    } catch (err) {
      console.error("Failed to resend invitation:", err);
      toast.error("Failed to resend invitation");
    }
  };

  return (
    <div
      className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
        }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Team Management</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
            Manage team members, roles, permissions, and departments
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            setEditingMemberId(null);
            setEditingMemberData(null);
            setInviteModalOpen(true);
          }}
        >
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Team Members", value: stats.totalMembers },
          { label: "Active Members", value: stats.activeMembers },
          { label: "Pending Invitations", value: stats.pendingInvites },
          { label: "Inactive Members", value: stats.inactiveTeamMembers },
        ].map((s, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 shadow-md flex flex-col justify-center ${isDark ? "bg-[#151F28]" : "bg-white"
              }`}
          >
            <p className="text-sm">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value ?? "-"}</p>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/3 ${
            isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"
          }`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`rounded-md px-3 py-2 text-sm ${
            isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200"
              : "bg-white border border-gray-300"
          }`}
        >
          <option value="all">All Status</option>
          {Object.values(ETeamMemberStatus).map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={`rounded-md px-3 py-2 text-sm ${
            isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200"
              : "bg-white border border-gray-300"
          }`}
        >
          <option value="all">All Roles</option>
          {Object.values(ETeamRole).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className={`rounded-md px-3 py-2 text-sm ${
            isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200"
              : "bg-white border border-gray-300"
          }`}
        >
          <option value="all">All Departments</option>
          {Object.values(EDepartment).map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div
        className={`rounded-lg overflow-x-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"
          }`}
      >
        {loading ? (
          <div className="p-6 text-center">Loading team members...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm min-w-[800px]">
            <thead
              className={`${isDark ? "text-gray-400" : "text-gray-600"
                } text-left`}
            >
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Invitation</th>
                <th className="px-4 py-3 font-medium">Join Date</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? members.map((m, idx) => (
                <tr
                  key={m._id ?? idx}
                  className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{m.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${m.status === "Active"
                        ? "bg-purple-600 text-white"
                        : m.status === "Pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                        }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {m.isInvitationAccepted ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${isDark
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        Accepted
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${isDark
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{m.joinDate}</td>
                  <td className="px-4 py-3">{m.lastActive}</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={isDark ? "outline" : "secondary"}
                      onClick={() => handleEditClick(m._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500"
                      onClick={() => handleRemoveClick(m)}
                    >
                      Remove
                    </Button>
                    {!m.isInvitationAccepted && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => handleResendInvitation(m._id, m.name)}
                      >
                        Resend Invitation
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3">
          <Button
            disabled={page === 1}
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            disabled={page >= pagination.totalPages}
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <InviteTeamMemberModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
        theme={theme}
        memberId={editingMemberId}
        memberData={editingMemberData}
        onSuccess={fetchTeamData}
      />

      {confirmDialog.isOpen && (
        <ConfirmDialog
          title="Remove Team Member"
          message={`Are you sure you want to remove ${confirmDialog.memberName}? This action cannot be undone.`}
          onConfirm={confirmRemove}
          onCancel={() =>
            setConfirmDialog({ isOpen: false, memberId: null, memberName: "" })
          }
          theme={theme}
        />
      )}
    </div>
  );
}
