import React, { useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function InternalNoteModal({
  isOpen,
  onClose,
  ticketId,
  existingNotes = [],
  theme = "dark",
  onAdded
}) {
  const isDark = theme === "dark";
  const { user: currentUser } = useAuth();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const payload = { note: note.trim() };

      await GlobalApi.addInternalNote(ticketId, payload);

      const newNote = {
        note: note.trim(),
        createdAt: new Date().toISOString(),
        addedBy: {
            firstName: currentUser?.firstName || "Admin",
            lastName: currentUser?.lastName || "User",
        }
      };

      onAdded(newNote);   // ← tell parent to update UI
      toast.success("Internal note added");
      setNote("");
      onClose();

    } catch (error) {
      console.error("Internal note add failed", error);
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-md rounded-xl p-6"
        style={{
          background: isDark ? "#151F28" : "#FFFFFF",
          color: "var(--text)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Add Internal Note</h2>

        {/* Existing Notes */}
        {existingNotes.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto space-y-2 p-3 rounded-md"
            style={{
              background: isDark ? "#0F1720" : "#F3F4F6",
            }}
          >
            {[...existingNotes].reverse().map((n, i) => (
              <div
                key={i}
                className="text-xs p-2 rounded-md"
                style={{
                  background: isDark ? "#1E293B" : "#E5E7EB",
                }}
              >
                <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {n.addedBy?.firstName} {n.addedBy?.lastName}
                    </span>
                    <span className="text-[10px] opacity-70">
                        {new Date(n.createdAt).toLocaleString()}
                    </span>
                </div>
                <div className="font-medium">{n.note}</div>
              </div>
            ))}
          </div>
        )}

        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write an internal note..."
          className="w-full p-3 rounded-lg text-sm"
          style={{
            background: isDark ? "#0F1720" : "#F3F4F6",
            color: "var(--text)",
          }}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ background: "transparent", color: "var(--muted)" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleAddNote}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
    </div>
  );
}
