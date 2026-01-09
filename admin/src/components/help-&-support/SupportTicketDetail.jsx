import React, { useState, useEffect  } from "react";
import { Calendar, Paperclip, Send, Download, User, SquarePen, Tag } from "lucide-react";
import EditTicketModal from "./EditTicketModal";
import AssignTicketModal from "./AssignTicketModal";
import GlobalApi from "@/lib/GlobalApi";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import AttachmentModal from "./AttachmentModal";
import InternalNoteModal from "./InternalNoteModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminNormalTicketDetails from "./details/AdminNormalTicketDetails";
import AdminDefaultClaimDetails from "./details/AdminClaimDetails";
import AdminMetaProfileMappingDetails from "./details/AdminMetaProfileMappingDetails";
import AdminYoutubeOACMappingDetails from "./details/AdminYoutubeOACMappingDetails";
import { ETicketType } from "@/config/constants";


export default function TicketDetailPanel({ theme = "dark", ticket, onBack }) {
  const isDark = theme === "dark";
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
const [draftAttachments, setDraftAttachments] = useState([]);
const [sendingReply, setSendingReply] = useState(false);
const [showAttachmentModal, setShowAttachmentModal] = useState(false);
const [isInternal, setIsInternal] = useState(false);
const [showInternalModal, setShowInternalModal] = useState(false);


useEffect(() => {
  if (!ticket?.ticketId) return;
  fetchTicket();
}, [ticket?.ticketId]);

const fetchTicket = async () => {
  try {
    const res = await GlobalApi.getSupportTicketById(ticket.ticketId);
    setCurrentTicket(res.data.data);  // overwrite current ticket with fresh data
  } catch (err) {
    console.error("Failed to fetch ticket", err);
    toast.error("Failed to load ticket details.");
    onBack(); // Go back to list if fetching fails
  }
};

const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const publicResponses = currentTicket.responses.filter(r => !r.isInternal);

    doc.setFontSize(18);
    doc.text(`Support Ticket: ${currentTicket.ticketId}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Subject: ${currentTicket.subject}`, 14, 32);

    const customerName = `${currentTicket.userId?.firstName || ''} ${currentTicket.userId?.lastName || ''}`.trim();
    doc.text(`Customer: ${customerName} (${currentTicket.userId?.emailAddress})`, 14, 42);
    doc.text(`Status: ${currentTicket.status}`, 14, 52);


    const tableData = publicResponses.map(res => [
        new Date(res.createdAt).toLocaleString(),
        `${res.respondedBy?.firstName || ''} ${res.respondedBy?.lastName || ''}`.trim(),
        res.message
    ]);

    autoTable(doc, {
        startY: 60,
        head: [['Date', 'Author', 'Message']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: {
            cellPadding: 3,
            fontSize: 10,
            overflow: 'linebreak'
        },
        columnStyles: {
            2: { cellWidth: 'auto' }
        }
    });

    doc.save(`ticket-${currentTicket.ticketId}.pdf`);
  };

const handleSendReply = async () => {
  if (!replyMessage.trim()) {
    toast.error("Reply message cannot be empty");
    return;
  }

  try {
    setSendingReply(true);

    const payload = {
      message: replyMessage,
      isInternal: isInternal,
      attachments: draftAttachments.map((file) => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize
      }))
    };

    await GlobalApi.addAdminResponse(currentTicket.ticketId, payload);

    // 🔥🔥 Immediately refetch updated ticket from backend
    await fetchTicket();

    // CLEAR INPUT
    setReplyMessage("");
    setDraftAttachments([]);

    toast.success("Reply sent successfully");

  } catch (err) {
    console.error("Reply send error:", err);
    toast.error("Failed to send reply");
  } finally {
    setSendingReply(false);
  }
};



  const handleEscalateTicket = async () => {
    try {
      setLoading(true);

      const updated = await GlobalApi.escalateSupportTicket(ticket.ticketId, {});    
      setCurrentTicket((prev) => ({
        ...prev,
        escalationLevel: (prev.escalationLevel ?? 0) + 1,
      }));

      setShowDialog(false);
      toast.success("Ticket escalated successfully");
    } catch (error) {
      console.error("Escalation failed:", error);
      toast.error("Failed to escalate ticket");
    } finally {
      setLoading(false);
    }
  };

  const renderTicketDetails = () => {
    if (!currentTicket || !currentTicket.details) {
      return <p>No ticket details available.</p>;
    }
  
    const { ticketType, details } = currentTicket;
  
    switch (ticketType) {
      case ETicketType.NORMAL:
        return <AdminNormalTicketDetails details={details} />;
      case ETicketType.META_CLAIM_RELEASE:
      case ETicketType.YOUTUBE_CLAIM_RELEASE:
      case ETicketType.META_MANUAL_CLAIM:
      case ETicketType.YOUTUBE_MANUAL_CLAIM:
        return <AdminDefaultClaimDetails details={details} type={ticketType} />;
      case ETicketType.META_PROFILE_MAPPING:
        return <AdminMetaProfileMappingDetails details={details} />;
      case ETicketType.YOUTUBE_OAC_MAPPING:
        return <AdminYoutubeOACMappingDetails details={details} />;
      default:
        // Fallback for older tickets before the ticketType was introduced
        return (
            <div className="mt-8">
                <p className="text-xs" style={{ color: "var(--muted)" }}>Description</p>
                <div className="mt-2 p-4 rounded-lg" style={{ background: "var(--bg-main)" }}>
                    <p className="text-sm whitespace-pre-wrap">{currentTicket.description}</p>
                </div>
            </div>
        );
    }
  };

  if (!ticket) return null;

  const vars = isDark
    ? {
      "--bg-main": "#111A22",
      "--bg-surface": "#151F28",
      "--text": "#DDE6EE",
      "--muted": "#96A0AB",
      "--accent": "#7C3AED",
      "--chip-bg": "rgba(255,255,255,0.04)",
      "--danger": "#FF5A5F",
    }
    : {
      "--bg-main": "#F7FAFC",
      "--bg-surface": "#FFFFFF",
      "--text": "#0B1720",
      "--muted": "#5A6B73",
      "--accent": "#6B46C1",
      "--chip-bg": "rgba(0,0,0,0.04)",
      "--danger": "#E53E3E",
    };

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text)",
        ...Object.fromEntries(Object.entries(vars)),
      }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-12 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              className="text-sm px-3 py-2 rounded-md border border-gray-800"
              onClick={onBack}
              style={{ background: "transparent", color: "var(--muted)" }}
            >
              ← Back to Support Tickets
            </button>
            <div className="flex-col">
              <h2 className="text-lg font-semibold">Ticket #{currentTicket.ticketId}</h2>

              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {currentTicket.subject}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-8">
          <div
            className="rounded-2xl p-6 mb-6 shadow-sm"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Ticket Information</h3>

              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-1.5 text-xs rounded-md flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--muted)"
                }}
              >
                <SquarePen size={14} />
                Edit
              </button>
            </div>

            {renderTicketDetails()}
            
          </div>

          <div
            className="rounded-2xl p-6 mb-6 shadow-sm"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium">
                Conversation ({currentTicket.responses?.length || 0})
              </h3>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
                style={{ background: "transparent", color: "var(--muted)", border: '1px solid var(--border)' }}
              >
                <Download size={14} /> Download Thread
              </button>
            </div>
      
            <div className="space-y-4">
       {currentTicket.responses?.map((chat, index) => {
  // Use respondedBy object from API directly
  const responder = chat.respondedBy || {};
  const authorName = `${responder.firstName ?? ""} ${responder.lastName ?? ""}`.trim() || "Unknown";

  return (
    <MessageBubble
      key={index}
      message={{
        id: index,
        author: authorName,
        role: responder.role ?? "user",
        time: new Date(chat.createdAt).toLocaleString(),
        message: chat.message,
        isInternal: chat.isInternal ?? false,
      }}
    />
  );
})}



            </div>

            <div className="mt-6">
            

             <textarea
  className="w-full rounded-lg p-3 resize-none"
  rows={3}
  placeholder="Type your message here..."
  value={replyMessage}
  onChange={(e) => setReplyMessage(e.target.value)}
  style={{
    background: isDark ? "#0F1720" : "#F3F4F6",
    color: "var(--text)",
  }}
/>
<div className="flex items-center gap-2 mt-3">
  <input
    type="checkbox"
    id="internal-note"
    checked={isInternal}
    onChange={(e) => setIsInternal(e.target.checked)}
  />
  <label htmlFor="internal-note" className="text-sm">
    Internal Message
  </label>
</div>


              <div className="flex items-center justify-between mt-3">

               <Button
  className="px-4 py-2 rounded-lg text-xs font-medium"
  style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "var(--muted)"
  }}
  onClick={() => setShowAttachmentModal(true)}
>
  Add Files
</Button>
                <div className="flex items-center gap-3">

                  <button
  className="px-4 py-2 rounded-lg text-xs font-medium transition"
  style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "var(--muted)",
  }}
  onClick={() => setShowInternalModal(true)}
>
  Add Internal Note
</button>


                  <Button
                    onClick={() => setShowDialog(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Escalate Ticket
                  </Button>

                  <button
  onClick={handleSendReply}
  disabled={sendingReply}
  className="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
  style={{
    background: "var(--accent)",
    color: "white",
    opacity: sendingReply ? 0.6 : 1
  }}
>
  <Send size={14} />
  {sendingReply ? "Sending..." : "Send Reply"}
</button>


                </div>
              </div>


            </div>
          </div>
        </div>

        <aside className="col-span-4">
          <div
            className="rounded-2xl p-6 sticky top-8"
            style={{ background: "var(--bg-surface)" }}
          >
            <h4 className="text-md font-medium mb-4">Ticket Status</h4>

            <div className="space-y-6">

              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  Status
                </label>

                <div className="mt-2">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      background:
                        currentTicket.status === "open"
                          ? "rgba(255, 87, 87, 0.15)"
                          : currentTicket.status === "pending"
                            ? "rgba(255, 196, 0, 0.15)"
                            : currentTicket.status === "resolved"
                              ? "rgba(52, 211, 153, 0.15)"
                              : "rgba(148, 163, 184, 0.15)",
                      color:
                        currentTicket.status === "open"
                          ? "#FF5A5F"
                          : currentTicket.status === "pending"
                            ? "#FACC15"
                            : currentTicket.status === "resolved"
                              ? "#34D399"
                              : "#94A3B8",
                    }}
                  >
                    {currentTicket.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  Priority
                </label>

                <div className="mt-2">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      background:
                        currentTicket.priority === "critical"
                          ? "rgba(220, 38, 38, 0.20)"
                          : currentTicket.priority === "high"
                            ? "rgba(239, 68, 68, 0.20)"
                            : currentTicket.priority === "medium"
                              ? "rgba(234,179,8,0.20)"
                              : "rgba(37, 99, 235, 0.20)",
                      color:
                        currentTicket.priority === "critical"
                          ? "#F87171"
                          : currentTicket.priority === "high"
                            ? "#EF4444"
                            : currentTicket.priority === "medium"
                              ? "#FACC15"
                              : "#60A5FA",
                    }}
                  >
                    {currentTicket.priority.toUpperCase()}
                  </span>
                </div>
              </div>


            
              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>Assigned To</label>

                <div className="mt-2">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      background: "rgba(124, 58, 237, 0.20)",
                      color: "var(--accent)",
                    }}
                  >
                    {currentTicket.assignedTo
                      ? typeof currentTicket.assignedTo === "object"
                        ? `${currentTicket.assignedTo.firstName ?? ""} ${currentTicket.assignedTo.lastName ?? ""}`.trim()
                        : currentTicket.assignedTo
                      : "Unassigned"}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center gap-3">
                  <select
                    className="rounded-lg px-3 py-2 text-sm flex-1"
                    style={{
                      background: isDark ? "var(--bg-main)" : "var(--bg-surface)",
                      color: "var(--text)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    value={currentTicket.assignedDepartment || ""} 
                    onChange={(e) =>
                      setCurrentTicket((prev) => ({
                        ...prev,
                        assignedDepartment: e.target.value,
                      }))
                    }
                  >
                    {["Management", "Content", "Technology", "Marketing", "Support"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(0,0,0,0.1)",
                      color: "var(--text)"
                    }}
                    onClick={() => setShowAssignModal(true)}  
                  >
                    Assign
                  </button>

                </div>

              </div>
            </div>
          </div>
        </aside>

      </div>
      <EditTicketModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ticket={currentTicket}
        theme={theme}
        onSave={(updatedTicket) => {
          setCurrentTicket(updatedTicket);  
        }}
      />


      <AssignTicketModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        ticket={currentTicket}
        theme={theme}
        onAssigned={(updated) => setCurrentTicket(updated)}
      />


      {showDialog && (
        <ConfirmDialog
          title="Escalate Ticket"
          message="Are you sure you want to escalate this ticket? This action cannot be undone."
          theme={theme}
          onCancel={() => setShowDialog(false)}
          onConfirm={handleEscalateTicket}
          loading={loading}
        />
      )}

      <AttachmentModal
  isOpen={showAttachmentModal}
  onClose={() => setShowAttachmentModal(false)}
  theme={theme}
  onSaveDraft={(files) => setDraftAttachments(files)}
/>

<InternalNoteModal
  isOpen={showInternalModal}
  onClose={() => setShowInternalModal(false)}
  theme={theme}
  ticketId={currentTicket.ticketId}
  existingNotes={currentTicket.internalNotes || []}
  onAdded={(newNote) =>
    setCurrentTicket((prev) => ({
      ...prev,
      internalNotes: [...prev.internalNotes, newNote],
    }))
  }
/>

    </div>
  );
}

function MessageBubble({ message }) {

  // admin + team_member on RIGHT
  // user on LEFT
  const isAgent =
    message.role === "admin" ||
    message.role === "team_member";

  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[82%] rounded-xl p-4 shadow-sm text-sm leading-relaxed"
        style={{
          background: isAgent
            ? "linear-gradient(90deg,#7C3AED,#6D28D9)"   // purple bubble for staff/admin
            : "var(--bg-surface)",                       // grey bubble for users
          color: isAgent ? "white" : "var(--text)",
        }}
      >
        <div
          className="text-xs mb-1"
          style={{
            color: isAgent
              ? "rgba(255,255,255,0.85)"
              : "var(--muted)",
          }}
        >
          {message.author} • {message.time}
        </div>

        <div>{message.message}</div>
      </div>
    </div>
  );
}

