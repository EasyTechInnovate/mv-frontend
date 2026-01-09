import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import { ETicketType } from "@/config/constants";
import AdminNormalTicketForm from "./forms/AdminNormalTicketForm";
import AdminClaimForm from "./forms/AdminClaimForm";
import AdminMetaProfileMappingForm from "./forms/AdminMetaProfileMappingForm";
import AdminYoutubeOACMappingForm from "./forms/AdminYoutubeOACMappingForm";

export const ETicketPriority = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export const ETicketStatus = {
  OPEN: "open",
  PENDING: "pending",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

export const EDepartment = Object.freeze({
    MANAGEMENT: "Management",
    CONTENT: "Content",
    TECHNOLOGY: "Technology",
    MARKETING: "Marketing",
    SUPPORT: "Support",
});

const normalizeAssignedTo = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw._id) return raw._id;
  return "";
};

export default function EditTicketModal({
  isOpen,
  onClose,
  ticket,
  theme = "dark",
  onSave,
}) {
  if (!isOpen || !ticket) return null;

  const isDark = theme === "dark";

  const vars = {
    "--modal-bg": isDark ? "#111A22" : "#FFFFFF",
    "--surface": isDark ? "#151F28" : "#F7F9FB",
    "--text": isDark ? "#DDE6EE" : "#0B1720",
    "--muted": isDark ? "#96A0AB" : "#5A6B73",
    "--accent": isDark ? "#7C3AED" : "#6B46C1",
    "--border": isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  };

  const [form, setForm] = useState({
    subject: ticket.subject || "",
    tags: ticket.tags?.join(", ") || "",
    status: ticket.status?.toLowerCase() || ETicketStatus.OPEN,
    priority: ticket.priority?.toLowerCase() || ETicketPriority.MEDIUM,
    assignedTo: normalizeAssignedTo(ticket.assignedTo),
    assignedDepartment: ticket.assignedDepartment || "",
  });

  const [details, setDetails] = useState(ticket.details || {});

  useEffect(() => {
    setForm({
      subject: ticket.subject || "",
      tags: ticket.tags?.join(", ") || "",
      status: ticket.status?.toLowerCase() || ETicketStatus.OPEN,
      priority: ticket.priority?.toLowerCase() || ETicketPriority.MEDIUM,
      assignedTo: normalizeAssignedTo(ticket.assignedTo),
      assignedDepartment: ticket.assignedDepartment || "",
    });
    setDetails(ticket.details || {});
  }, [ticket]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const fetchMembers = async () => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const res = await GlobalApi.getAllTeamMembers(1, 100);
        const members = res?.data?.data?.teamMembers || [];
        const filtered = members.filter(
          (m) => m.isInvitationAccepted && m.isActive
        );
        if (mounted) setTeamMembers(filtered);
      } catch (err) {
        if (mounted)
          setMembersError(err?.response?.data || "Failed to fetch members");
      } finally {
        if (mounted) setMembersLoading(false);
      }
    };
    fetchMembers();
    return () => (mounted = false);
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const payload = { ...form, details };
      
      if (form.tags) {
        payload.tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      } else {
        payload.tags = [];
      }

      payload.assignedTo = form.assignedTo || null;
      payload.assignedDepartment = form.assignedDepartment || null;
      
      const res = await GlobalApi.updateSupportTicket(ticket.ticketId, payload);

      onSave?.(res.data.data);
      onClose();
    } catch (err) {
      console.error("Update Ticket Error", err?.response?.data || err);
    }
  };

  const renderDetailsForm = () => {
    const { ticketType } = ticket;
    
    switch (ticketType) {
        case ETicketType.NORMAL:
            return <AdminNormalTicketForm initialDetails={details} onDetailsChange={setDetails} />;
        case ETicketType.META_CLAIM_RELEASE:
        case ETicketType.YOUTUBE_CLAIM_RELEASE:
        case ETicketType.YOUTUBE_MANUAL_CLAIM:
        case ETicketType.META_MANUAL_CLAIM:
            return <AdminClaimForm initialDetails={details} onDetailsChange={setDetails} type={ticketType} />;
        case ETicketType.META_PROFILE_MAPPING:
            return <AdminMetaProfileMappingForm initialDetails={details} onDetailsChange={setDetails} />;
        case ETicketType.YOUTUBE_OAC_MAPPING:
            return <AdminYoutubeOACMappingForm initialDetails={details} onDetailsChange={setDetails} />;
        default:
            return <p style={{color: 'var(--muted)'}}>This ticket type does not have editable details.</p>
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        className="relative w-[620px] rounded-2xl p-6 shadow-xl custom-scrollbar"
        style={{
          background: "var(--modal-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          ...vars,
        }}
      >
 
        <div
          className="flex items-center justify-between mb-4 pb-2 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-lg font-semibold">Edit Ticket</h2>
          <button onClick={onClose}>
            <X size={20} style={{ color: "var(--muted)" }} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">

          <div className="grid grid-cols-2 gap-4 mb-4">
       
            <div>
              <label className="text-xs" style={{ color: "var(--muted)" }}>
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            <div>
                 <label className="text-xs" style={{ color: "var(--muted)" }}>
                    Ticket Type
                </label>
                <input
                    value={ticket.ticketType}
                    disabled
                    className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                    style={{
                    background: "var(--surface)",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    }}
                />
            </div>
          </div>
          
          <hr style={{borderColor: "var(--border)", margin: "20px 0"}}/>
          
          <h3 className="text-md font-semibold mb-4">Ticket Properties</h3>

          <div className="mb-4">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              Tags (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
              style={{
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
         
            <div>
              <label className="text-xs" style={{ color: "var(--muted)" }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {Object.values(ETicketStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: "var(--muted)" }}>
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {Object.values(ETicketPriority).map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
           
            <div>
              <label className="text-xs" style={{ color: "var(--muted)" }}>
                Assigned Department
              </label>
              <select
                value={form.assignedDepartment}
                onChange={(e) =>
                  updateField("assignedDepartment", e.target.value)
                }
                className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                <option value="">Unassigned</option>
                {Object.values(EDepartment).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: "var(--muted)" }}>
                Assigned To
              </label>
              <select
                value={form.assignedTo}
                onChange={(e) => updateField("assignedTo", e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                <option value="">Unassigned</option>

                {membersLoading && <option>Loading...</option>}
                {membersError && <option>Error loading members</option>}

                {teamMembers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.firstName} {m.lastName} — {m.teamRole || "Member"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <hr style={{borderColor: "var(--border)", margin: "20px 0"}}/>
          
          <h3 className="text-md font-semibold mb-4">Details</h3>

          {renderDetailsForm()}

        </div>

        <div
          className="flex justify-end gap-3 mt-6 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--muted)",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

