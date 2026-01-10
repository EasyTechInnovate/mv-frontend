import { useEffect, useState } from "react";
import {
    MoreHorizontal,
    Star,
    Search,
    Plus,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import TestimonialModal from "@/components/testimonials/TestimonialModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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

export default function TestimonialManager({ theme }) {
    const [testimonials, setTestimonials] = useState([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [loading, setLoading] = useState(true);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [stats, setStats] = useState({});

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 10,
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (statusFilter !== "all") params.status = statusFilter;
            if (ratingFilter !== "all") params.rating = ratingFilter;

            const res = await GlobalApi.getAllTestimonials(params);
            const fetched = res.data?.data?.testimonials || [];
            setTestimonials(fetched);
            setPagination(res.data?.data?.pagination || { totalPages: 1 });
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchStats = async () => {
        try {
            const res = await GlobalApi.getTestimonialStats();
            const statsData = res.data?.data;
            if (statsData) {
                const total = statsData.totalTestimonials || 0;
                const totalRating = statsData.ratingDistribution.reduce((acc, curr) => acc + (curr._id * curr.count), 0);
                const totalRatingsCount = statsData.ratingDistribution.reduce((acc, curr) => acc + curr.count, 0);
                const avgRating = totalRatingsCount > 0 ? (totalRating / totalRatingsCount).toFixed(1) : "0";

                setStats({
                    total,
                    published: statsData.publishedTestimonials || 0,
                    pending: statsData.draftTestimonials || 0,
                    avgRating
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    }

    useEffect(() => {
        fetchTestimonials();
        fetchStats();
    }, [page, debouncedSearch, statusFilter, ratingFilter]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, ratingFilter]);


    const cardClass =
        theme === "dark"
            ? "bg-[#151F28] text-white border-gray-700"
            : "bg-white text-black border-gray-200";


    const handleDelete = async (id) => {
        try {
            await GlobalApi.deleteTestimonial(id);
            toast.success("Testimonial deleted successfully");
            setConfirmDelete(null);
            fetchTestimonials();
            fetchStats();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete testimonial");
        }
    };

    return (
        <div className="space-y-6">
            <Toaster richColors position="top-center" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Testimonial Manager</h1>
                    <p className="text-sm text-gray-500">
                        Manage customer testimonials and reviews for Maheshwari Visuals
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedTestimonial(null);
                        setShowModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center gap-2"
                >
                    <Plus size={16} /> Add Testimonial
                </Button>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: stats.total },
                    { label: "Published", value: stats.published, color: "text-green-500" },
                    { label: "Average Rating", value: stats.avgRating, color: "text-yellow-500" },
                    { label: "Pending", value: stats.pending },
                ].map((s) => (
                    <Card key={s.label} className={cardClass}>
                        <CardContent className="p-4">
                            <p className="text-sm">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value ?? '0'}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <div
                    className={`flex items-center px-3 py-2 rounded-lg w-full md:w-1/3 ${theme === "dark" ? "bg-[#151F28]" : "bg-gray-200"
                        }`}
                >
                    <Search
                        className={`w-4 h-4 mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                    />
                    <input
                        type="text"
                        placeholder="Search by name, company, or content..."
                        className={`w-full text-sm focus:outline-none ${theme === "dark"
                                ? "bg-[#151F28] text-white placeholder-gray-400"
                                : "bg-gray-200 text-black placeholder-gray-500"
                            }`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`rounded-md px-3 py-2 text-sm ${theme === "dark"
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className={`rounded-md px-3 py-2 text-sm ${theme === "dark"
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                >
                    <option value="all">All Ratings</option>
                    {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
                    ))}
                </select>
            </div>

            <div
                className={`overflow-x-auto rounded-xl border ${theme === "dark"
                        ? "bg-[#151F28] border-[#151F28]"
                        : "bg-white border-gray-200"
                    }`}
            >
                {loading ? (
                    <div className="text-center py-10 text-sm text-gray-500">
                        Loading testimonials...
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-500">
                        No testimonial data
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead
                            className={`text-left ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            <tr>
                                {[
                                    "Customer",
                                    "Designation",
                                    "Company",
                                    "Rating",
                                    "Content",
                                    "Status",
                                    "Actions",
                                ].map((header) => (
                                    <th key={header} className="px-4 py-3 font-medium">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((t) => (
                                <tr
                                    key={t._id}
                                    className={`border-b ${theme === "dark"
                                            ? "border-[#151F28] hover:bg-[#151F28]/50"
                                            : "border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <img
                                            src={t.profileImageUrl || "/placeholder-user.png"}
                                            alt=""
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span>{t.customerName}</span>
                                    </td>
                                    <td className="px-4 py-3">{t.designation}</td>
                                    <td className="px-4 py-3">{t.company}</td>
                                    <td className="px-4 py-3 flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i <= t.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-400"
                                                    }`}
                                            />
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 truncate max-w-xs">
                                        {t.testimonialContent}
                                    </td>
                                    <td className="px-4 py-3 capitalize">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${t.status === "published"
                                                    ? "bg-green-100 text-green-700"
                                                    : t.status === "pending" || t.status === "draft"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal className="w-5 h-5" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className={`${theme === "dark"
                                                        ? "bg-[#1F2A37] text-white border border-gray-700"
                                                        : "bg-white text-black border border-gray-200"
                                                    }`}
                                            >
                                                <DropdownMenuItem
                                                    onClick={async () => {
                                                        const res = await GlobalApi.getTestimonialById(t._id);
                                                        setSelectedTestimonial(res.data.data);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setConfirmDelete(t._id)}
                                                    className="text-red-500"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
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


            {showModal && (
                <TestimonialModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    testimonialId={selectedTestimonial?._id || null}
                    onSaved={() => {
                        fetchTestimonials();
                        fetchStats();
                    }}
                    theme={theme}
                />
            )}

            {confirmDelete && (
                <ConfirmDialog
                    title="Delete Testimonial"
                    message="Are you sure you want to delete this testimonial?"
                    onConfirm={() => handleDelete(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}
