import { useState, useEffect } from "react";
import { ExternalLink, Trash2, Plus, Upload, Edit, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadToImageKit } from "@/lib/imageUpload";
import GlobalApi from "@/lib/GlobalApi";

export default function NewsManagement({ theme = "dark" }) {
    const isDark = theme === "dark";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // ── fetch on mount ─────────────────────────────────────────────────────
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await GlobalApi.getAllNews();
            const fetched = (res.data?.data?.news || []).map((n) => ({
                ...n,
                _tempId: n._id,
                editingUrl: false,
                isNew: false,
                dirty: false,
            }));
            setItems(fetched);
        } catch {
            toast.error("Failed to load news items");
        } finally {
            setLoading(false);
        }
    };

    // ── helpers ────────────────────────────────────────────────────────────
    const updateItem = (id, patch) =>
        setItems((prev) =>
            prev.map((it) => (it._tempId === id ? { ...it, ...patch, dirty: true } : it))
        );

    const addNew = () => {
        const _tempId = `temp_${Date.now()}`;
        setItems((prev) => [
            {
                _tempId,
                articleUrl: "",
                imageUrl: "",
                display: false,
                order: 0,
                editingUrl: true,
                isNew: true,
                dirty: true,
            },
            ...prev,
        ]);
    };

    const removeLocalItem = (id) =>
        setItems((prev) => prev.filter((it) => it._tempId !== id));

    // ── image upload ───────────────────────────────────────────────────────
    const handleFileChange = async (id, file) => {
        if (!file) return;
        setUploadingId(id);
        try {
            const res = await uploadToImageKit(file, "news/logos");
            updateItem(id, { imageUrl: res.url });
        } catch {
            toast.error("Image upload failed");
        } finally {
            setUploadingId(null);
        }
    };

    // ── save (create or update) ────────────────────────────────────────────
    const handleSave = async (item) => {
        if (!item.articleUrl) return toast.error("Article URL is required");
        if (!item.imageUrl) return toast.error("Please upload a publisher image");

        setSavingId(item._tempId);
        try {
            const payload = {
                articleUrl: item.articleUrl,
                imageUrl: item.imageUrl,
                display: item.display,
                order: item.order || 0,
            };

            if (item.isNew) {
                const res = await GlobalApi.createNews(payload);
                const saved = res.data?.data;
                setItems((prev) =>
                    prev.map((it) =>
                        it._tempId === item._tempId
                            ? { ...saved, _tempId: saved._id, isNew: false, dirty: false, editingUrl: false }
                            : it
                    )
                );
                toast.success("News item added!");
            } else {
                const res = await GlobalApi.updateNews(item._id, payload);
                const saved = res.data?.data;
                setItems((prev) =>
                    prev.map((it) =>
                        it._tempId === item._tempId
                            ? { ...saved, _tempId: saved._id, isNew: false, dirty: false, editingUrl: false }
                            : it
                    )
                );
                toast.success("News item updated!");
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || e.message || "Save failed");
        } finally {
            setSavingId(null);
        }
    };

    // ── toggle display (instant — no Save needed) ──────────────────────────
    const handleToggleDisplay = async (item) => {
        const newVal = !item.display;
        // optimistic update
        setItems((prev) =>
            prev.map((it) => (it._tempId === item._tempId ? { ...it, display: newVal } : it))
        );
        if (!item.isNew && item._id) {
            try {
                await GlobalApi.updateNews(item._id, { display: newVal });
            } catch {
                // revert on failure
                setItems((prev) =>
                    prev.map((it) => (it._tempId === item._tempId ? { ...it, display: !newVal } : it))
                );
                toast.error("Failed to update display status");
            }
        }
    };

    // ── delete ─────────────────────────────────────────────────────────────
    const handleDelete = async (item) => {
        if (item.isNew) {
            removeLocalItem(item._tempId);
            return;
        }
        setDeletingId(item._tempId);
        try {
            await GlobalApi.deleteNews(item._id);
            removeLocalItem(item._tempId);
            toast.success("Item deleted");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    // ── styles ─────────────────────────────────────────────────────────────
    const containerClass = isDark
        ? "bg-[#111A22] text-white min-h-screen p-6"
        : "bg-gray-50 text-[#111A22] min-h-screen p-6";

    const cardClass = `${isDark ? "bg-[#151F28]" : "bg-white"} rounded-xl border ${
        isDark ? "border-gray-700" : "border-gray-200"
    } shadow p-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative`;

    const labelClass = `${isDark ? "text-gray-300" : "text-gray-700"} text-sm font-medium`;

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">News / Press Management</h1>
                    <p className="text-gray-400 text-sm">
                        Add publisher logos with article links — displayed on the Press page
                    </p>
                </div>
                <Button
                    onClick={addNew}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                    <Plus size={16} /> Add New
                </Button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No news items yet. Click <strong>Add New</strong> to get started.
                </div>
            )}

            {/* Cards */}
            <div className="space-y-4">
                {items.map((it) => (
                    <div key={it._tempId} className={cardClass}>
                        {/* Delete */}
                        <button
                            onClick={() => handleDelete(it)}
                            disabled={deletingId === it._tempId}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-400 disabled:opacity-50"
                        >
                            {deletingId === it._tempId ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Trash2 size={18} />
                            )}
                        </button>

                        {/* Image preview */}
                        {it.imageUrl && (
                            <div
                                className={`w-[120px] h-[70px] rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${
                                    isDark ? "bg-[#1e2d3d]" : "bg-gray-100"
                                }`}
                            >
                                <img
                                    src={it.imageUrl}
                                    alt="publisher"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Article Link */}
                        <div className="flex-1 min-w-[250px] w-full">
                            <label className={labelClass}>Article Link</label>
                            <div className="flex items-center gap-3 mt-1">
                                {it.editingUrl ? (
                                    <input
                                        type="text"
                                        value={it.articleUrl}
                                        onChange={(e) =>
                                            updateItem(it._tempId, { articleUrl: e.target.value })
                                        }
                                        onBlur={() =>
                                            setItems((prev) =>
                                                prev.map((x) =>
                                                    x._tempId === it._tempId ? { ...x, editingUrl: false } : x
                                                )
                                            )
                                        }
                                        autoFocus
                                        placeholder="https://rollingstone.com/..."
                                        className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            isDark
                                                ? "bg-[#111A22] text-gray-200 border border-gray-600"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    />
                                ) : (
                                    <div
                                        className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm ${
                                            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                                        } cursor-pointer`}
                                        onClick={() =>
                                            setItems((prev) =>
                                                prev.map((x) =>
                                                    x._tempId === it._tempId ? { ...x, editingUrl: true } : x
                                                )
                                            )
                                        }
                                    >
                                        <span className="truncate">
                                            {it.articleUrl || "Click to add URL…"}
                                        </span>
                                        <Edit size={14} className="ml-2 shrink-0 opacity-60" />
                                    </div>
                                )}

                                {it.articleUrl && !it.editingUrl && (
                                    <a href={it.articleUrl} target="_blank" rel="noopener noreferrer">
                                        <button
                                            className={`p-2 rounded-md ${
                                                isDark
                                                    ? "bg-gray-700 hover:bg-gray-600"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="flex-1 min-w-[220px] w-full">
                            <label className={labelClass}>Publisher Image</label>
                            <div className="flex items-center gap-3 mt-1">
                                <label className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-500 text-sm cursor-pointer shrink-0">
                                    {uploadingId === it._tempId ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    {uploadingId === it._tempId ? "Uploading…" : "Choose File"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingId === it._tempId}
                                        onChange={(e) =>
                                            handleFileChange(it._tempId, e.target.files[0])
                                        }
                                    />
                                </label>
                                <div
                                    className={`text-sm px-3 py-2 rounded-md truncate max-w-[180px] ${
                                        isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {it.imageUrl ? "Image uploaded ✓" : "No file chosen"}
                                </div>
                            </div>
                        </div>

                        {/* Display Toggle */}
                        <div className="flex flex-col min-w-[120px] mt-3 md:mt-0">
                            <span className={labelClass}>Display</span>
                            <label className="relative inline-flex items-center cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={it.display}
                                    onChange={() => handleToggleDisplay(it)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-purple-600 transition-colors" />
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                            </label>
                        </div>

                        {/* Save Button */}
                        {(it.isNew || it.dirty) && (
                            <div className="shrink-0">
                                <Button
                                    onClick={() => handleSave(it)}
                                    disabled={savingId === it._tempId || uploadingId === it._tempId}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm"
                                >
                                    {savingId === it._tempId ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                    {savingId === it._tempId ? "Saving…" : "Save"}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
