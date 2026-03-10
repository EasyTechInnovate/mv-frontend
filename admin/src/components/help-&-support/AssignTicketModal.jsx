import React, { useState, useEffect } from "react";
import GlobalApi from "@/lib/GlobalApi";

const normalizeAssignedTo = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw._id) return raw._id;
  return "";
};

const normalizeTeamRole = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    if (raw.teamRole) return raw.teamRole;
    if (raw.name) return raw.name;
  }
  return "";
};

export default function AssignTicketModal({
  isOpen,
  onClose,
  ticket,
  theme = "dark",
  onAssigned,
}) {
  if (!isOpen || !ticket) return null;

  const isDark = theme === "dark";

  const vars = {
    "--modal-bg": isDark ? "#151F28" : "#FFFFFF",
    "--text": isDark ? "#DDE6EE" : "#0B1720",
    "--muted": isDark ? "#96A0AB" : "#5A6B73",
    "--surface": isDark ? "#0F1720" : "#F3F4F6",
    "--border": isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    "--accent": isDark ? "#7C3AED" : "#6B46C1",
  };

 
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedTeamRole, setAssignedTeamRole] = useState("");

  useEffect(() => {
    if (!ticket) return;

    setAssignedTo(normalizeAssignedTo(ticket.assignedTo));
    setAssignedTeamRole(normalizeTeamRole(ticket.assignedTeamRole));
  }, [ticket]);


  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      setLoadingMembers(true);
      try {
        const res = await GlobalApi.getAllTeamMembers({ page: 1, limit: 100 });
        const list = res?.data?.data?.teamMembers || [];

        const filtered = list.filter(
          (m) => m.isInvitationAccepted && m.isActive
        );

        setTeamMembers(filtered);
      } catch (e) {
        console.error("Team Fetch Error:", e);
      } finally {
        setLoadingMembers(false);
      }
    };

    load();
  }, [isOpen]);

  const handleAssign = async () => {
    try {
      const payload = {
        assignedTo: assignedTo || null, 
        assignedTeamRole: assignedTeamRole || null,
      };

      const res = await GlobalApi.assignSupportTicket(
        ticket.ticketId,
        payload
      );

      if (res?.data?.data) onAssigned?.(res.data.data);
      onClose();
    } catch (err) {
      console.error("Assign Ticket Error", err?.response?.data || err);
      alert("Failed to assign ticket");
    }
  };


  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 z-50"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-lg"
        style={{
          background: "var(--modal-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          ...vars,
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Assign Ticket</h2>

        <div className="mb-4">
          <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>
            Assign To (Team Member)
          </label>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="">Unassigned</option>

            {loadingMembers && <option>Loading...</option>}

            {teamMembers
              .filter((m) => !assignedTeamRole || m.teamRole === assignedTeamRole)
              .map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName} — {m.teamRole || "Member"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>
            Assigned Team Role
          </label>

          <select
            value={assignedTeamRole}
            onChange={(e) => setAssignedTeamRole(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="">Unassigned</option>
            {["General", "Content", "Marketing", "User Accounts & Membership", "Finance - Royalty", "Finance - Membership", "Copyrights", "Other"].map(
              (role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg text-sm"
            onClick={onClose}
            style={{ background: "transparent", color: "var(--muted)" }}
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
