import { useEffect, useState, useRef } from "react";
import GlobalApi from "../../lib/GlobalApi";
import { Search, Download, Check, X, Eye, Users, Clock, CheckCircle, Package, Edit2, Link as LinkIcon, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner"; 

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500 text-white border-yellow-600",
    approved: "bg-green-600 text-white border-green-700",
    rejected: "bg-red-600 text-white border-red-700",
    design_pending: "bg-blue-500 text-white border-blue-600",
    design_submitted: "bg-purple-600 text-white border-purple-700",
    design_approved: "bg-emerald-600 text-white border-emerald-700",
    design_rejected: "bg-orange-600 text-white border-orange-700",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    design_pending: "Design Pending",
    design_submitted: "Design Submitted",
    design_approved: "Live",
    design_rejected: "Design Rejected",
  };

  return (
    <span className={`px-2.5 py-1 rounded shadow-sm text-xs font-bold uppercase tracking-wider border ${styles[status?.toLowerCase()] || "bg-gray-500 text-white"}`}>
      {labels[status?.toLowerCase()] || status}
    </span>
  );
};

export default function MerchStoreManagement({ theme }) {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modal States
  const [selectedStore, setSelectedStore] = useState(null);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  
  // Action Modals State
  const [noteModal, setNoteModal] = useState({ open: false, title: '', label: '', action: null });
  const [productModal, setProductModal] = useState({ open: false, storeId: null, designId: null, currentProducts: [] });

  const [designActionLoading, setDesignActionLoading] = useState(false);

  // helpers for theme styling
  const boxBg = theme === "dark" ? "bg-[#151F28] border border-gray-800" : "bg-white border border-gray-200";
  const inputBg = theme === "dark" ? "bg-[#151F28] text-gray-200 border border-gray-700" : "bg-white text-gray-800 border border-gray-300";
  const softBtn = theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-[#111A22]";
  const modalBg = theme === "dark" ? "bg-[#111A22] border border-gray-800" : "bg-white border border-gray-200";
  const overlayBg = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4";

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [activeTab, pagination.page, searchQuery, statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await GlobalApi.getMerchStoreStats();
      setStats(res.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'requests') {
        const res = await GlobalApi.getAllMerchStores(pagination.page, pagination.limit, searchQuery, statusFilter);
        setRequests(res.data.data.merchStores);
        setPagination(prev => ({ ...prev, totalPages: res.data.data.pagination.totalPages }));
      } else {
        const res = await GlobalApi.getListedProducts(pagination.page, pagination.limit, searchQuery);
        setListedProducts(res.data.data); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openStatusUpdateModal = (storeId, newStatus) => {
    if (newStatus === 'approved') {
      if (window.confirm('Are you sure you want to accept this request?')) {
        handleStatusUpdate(storeId, newStatus);
      }
    } else {
      setNoteModal({
        open: true,
        title: `Reject Request`,
        label: 'Rejection Reason',
        action: (reason) => handleStatusUpdate(storeId, newStatus, reason)
      });
    }
  };

  const handleStatusUpdate = async (storeId, newStatus, reason = "") => {
    try {
      await GlobalApi.updateMerchStoreStatus(storeId, { status: newStatus, rejectionReason: reason });
      fetchData();
      fetchStats();
      toast.success("Status updated successfully");
      setNoteModal({ ...noteModal, open: false });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewStore = async (storeId, mode = 'designs') => {
    setLoading(true);
    try {
      const res = await GlobalApi.getMerchStoreById(storeId);
      setSelectedStore(res.data.data);
      if (mode === 'details') {
        setShowRequestDetailsModal(true);
      } else {
        setShowDesignModal(true);
      }
    } catch (error) {
      console.error("Error fetching store:", error);
      toast.error("Failed to fetch store details");
    } finally {
      setLoading(false);
    }
  };

  const handleDesignAction = async (storeId, designId, action, payload = {}) => {
    setDesignActionLoading(true);
    try {
      if (action === 'status') {
        await GlobalApi.updateDesignStatus(storeId, designId, payload);
      } else if (action === 'products') {
        await GlobalApi.manageDesignProducts(storeId, designId, { products: payload });
      } else if (action === 'name') {
        await GlobalApi.updateDesignName(storeId, designId, { designName: payload });
      }
      
      // Refresh selected store data
      const res = await GlobalApi.getMerchStoreById(storeId);
      setSelectedStore(res.data.data);
      toast.success("Updated successfully");
    } catch (error) {
      console.error("Error updating design:", error);
      toast.error("Failed to update design");
    } finally {
      setDesignActionLoading(false);
    }
  };

  const downloadImage = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'design-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        window.open(url, '_blank'); // Fallback
    }
  };

  // Reusable Note Modal
  const NoteModal = () => {
    const [value, setValue] = useState('');
    if (!noteModal.open) return null;

    return (
      <div className={overlayBg}>
        <div className={`${modalBg} w-full max-w-md rounded-xl p-6 relative shadow-xl`}>
          <button onClick={() => setNoteModal({ ...noteModal, open: false })} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
          <h3 className="text-xl font-bold mb-4">{noteModal.title}</h3>
          <label className="text-sm text-gray-400 mb-2 block">{noteModal.label}</label>
          <textarea 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className={`${inputBg} w-full rounded p-3 min-h-[100px] text-sm mb-4`}
            placeholder="Enter details..."
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setNoteModal({ ...noteModal, open: false })} className={`${softBtn} px-4 py-2 rounded text-sm`}>Cancel</button>
            <button 
              onClick={() => {
                 if(value.trim()) noteModal.action(value);
              }} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Modal
  const ProductModal = () => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    if (!productModal.open) return null;

    return (
      <div className={overlayBg}>
         <div className={`${modalBg} w-full max-w-md rounded-xl p-6 relative shadow-xl`}>
          <button onClick={() => setProductModal({ ...productModal, open: false })} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
          <h3 className="text-xl font-bold mb-4">Add Product</h3>
          
          <div className="space-y-4">
             <div>
               <label className="text-sm text-gray-400 block mb-1">Product Name</label>
               <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputBg} w-full rounded p-2 text-sm`} placeholder="e.g. Graphic T-Shirt" />
             </div>
             <div>
               <label className="text-sm text-gray-400 block mb-1">Product Link</label>
               <input value={link} onChange={(e) => setLink(e.target.value)} className={`${inputBg} w-full rounded p-2 text-sm`} placeholder="https://..." />
             </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setProductModal({ ...productModal, open: false })} className={`${softBtn} px-4 py-2 rounded text-sm`}>Cancel</button>
            <button 
              onClick={() => {
                 if(name && link) {
                    const newProducts = [...productModal.currentProducts, { name, link }];
                    handleDesignAction(productModal.storeId, productModal.designId, 'products', newProducts);
                    setProductModal({ ...productModal, open: false });
                 }
              }} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Request Details Modal
  const RequestDetailsModal = () => {
    if (!selectedStore) return null;
    return (
      <div className={overlayBg} style={{zIndex: 55}}> 
        <div className={`${modalBg} w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative`}>
          <button onClick={() => setShowRequestDetailsModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20"><X size={20} /></button>
          <h2 className="text-2xl font-bold mb-6">Request Details</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-gray-500 uppercase">Artist Name</p>
                 <p className="font-medium">{selectedStore.artistInfo?.artistName}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase">User Name</p>
                 <p className="font-medium">{selectedStore.userId?.firstName} {selectedStore.userId?.lastName}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase">Social Links</p>
                 <div className="flex gap-2 mt-1">
                    {/* Simplified view of links */}
                    {selectedStore.artistInfo?.artistInstagramLink && <a href={selectedStore.artistInfo.artistInstagramLink} target="_blank" className="text-blue-400 text-xs hover:underline">Instagram</a>}
                    {selectedStore.artistInfo?.spotifyProfileLink && <a href={selectedStore.artistInfo.spotifyProfileLink} target="_blank" className="text-green-400 text-xs hover:underline">Spotify</a>}
                 </div>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase">Submit Date</p>
                 <p className="font-medium">{new Date(selectedStore.createdAt).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="bg-gray-500/5 p-4 rounded-lg">
              <p className="text-xs text-gray-500 uppercase mb-2">Product Preferences</p>
              <div className="flex flex-wrap gap-2">
                 {selectedStore.productPreferences?.selectedProducts?.map(p => (
                   <span key={p} className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs capitalize">{p.replace('_', ' ')}</span>
                 ))}
                 {selectedStore.productPreferences?.otherProductDescription && <span className="text-xs text-gray-400 italic"> + {selectedStore.productPreferences.otherProductDescription}</span>}
              </div>
            </div>

            <div className="bg-gray-500/5 p-4 rounded-lg">
               <p className="text-xs text-gray-500 uppercase mb-2">Marketing Plan</p>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Plan to Promote:</span> {selectedStore.marketingPlan?.planToPromote ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="text-gray-500">MMC Assistance:</span> {selectedStore.marketingPlan?.mmcMarketingAssistance ? 'Yes' : 'No'}
                  </div>
                  <div className="col-span-2">
                     <span className="text-gray-500">Channels:</span> {selectedStore.marketingPlan?.promotionChannels?.join(', ')}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Design Modal Component (UPDATED LAYOUT)
  const DesignModal = () => {
    if (!selectedStore) return null;

    return (
      <div className={overlayBg}>
        <div className={`${modalBg} w-full max-w-6xl h-[90vh] flex flex-col rounded-xl shadow-2xl p-6 relative`}>
          <button 
            onClick={() => setShowDesignModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20"
          >
            <X size={20} />
          </button>
          
          <div className="mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold mb-1">Manage Designs</h2>
            <div className="flex gap-4 text-sm text-gray-400">
               <span>Artist: {selectedStore.artistInfo?.artistName} ({selectedStore.userId?.firstName} {selectedStore.userId?.lastName})</span>
               <span>•</span>
               <span>Total Designs: {selectedStore.designs?.length || 0}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scroll min-h-0">
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-4">
            {selectedStore.designs?.map((design, index) => (
              <div key={design._id} className={`${theme === 'dark' ? 'bg-[#1A2632]' : 'bg-gray-50'} rounded-lg border border-gray-700/30 overflow-hidden flex flex-col shadow-sm h-fit`}>
                
                {/* Upper Section: Split View */}
                <div className="flex flex-col md:flex-row border-b border-gray-700/30">
                  
                  {/* Left: Image & Name */}
                  <div className={`w-full md:w-1/2 p-4 ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200'} md:border-r flex flex-col gap-3`}>
                     {/* Image Container - Fixed Height for Stability */}
                     <div className="relative h-[200px] md:h-[200px] w-full bg-black/5 dark:bg-black/40 rounded-lg overflow-hidden group flex items-center justify-center">
                        <img src={design.designLink} alt="Design" className="w-full h-full max-md:object-contain md:object-cover " />
                        <div className="absolute top-2 left-2 z-10">
                          <StatusBadge status={design.status || 'pending'} />
                        </div>
                     </div>
                     <div>
                       <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Design Name</label>
                       <div className="relative">
                         <input 
                           defaultValue={design.designName}
                           placeholder={`Design ${index + 1}`}
                           className={`${inputBg} w-full text-sm font-medium px-3 py-2 rounded focus:ring-1 focus:ring-purple-500 border-transparent`}
                           onBlur={(e) => {
                             if (e.target.value !== design.designName) {
                               handleDesignAction(selectedStore._id, design._id, 'name', e.target.value);
                             }
                           }}
                         />
                         <Edit2 size={12} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                       </div>
                     </div>
                  </div>

                  {/* Right: Products */}
                  <div className="w-full md:w-1/2 p-4 flex flex-col bg-gray-500/5">
                     <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-gray-500 uppercase font-bold">Linked Products</label>
                        {design.status === 'approved' && (
                            <button 
                              onClick={() => setProductModal({ open: true, storeId: selectedStore._id, designId: design._id, currentProducts: design.products || [] })}
                              className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 font-bold bg-purple-500/10 px-2 py-1 rounded transition-colors"
                            >
                              <Plus size={14} /> Add Product
                            </button>
                        )}
                     </div>

                     <div className="flex-1 overflow-y-auto max-h-[230px] space-y-2 pr-1 custom-scroll">
                        {design.products && design.products.length > 0 ? (
                           design.products.map((prod, i) => (
                              <div key={i} className={`flex items-center justify-between p-2.5 rounded group ${theme === 'dark' ? 'bg-[#111A22] border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
                                 <div className="flex flex-col min-w-0">
                                   <span className="font-medium text-xs truncate" title={prod.name}>{prod.name}</span>
                                    {prod.link && <span className="text-[10px] text-gray-500 truncate">{new URL(prod.link).hostname}</span>}
                                 </div>
                                 <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity ml-2">
                                   <a 
                                     href={prod.link} 
                                     target="_blank" 
                                     rel="noopener noreferrer" 
                                     className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10"
                                     title="Open Link"
                                   >
                                     <LinkIcon size={14} />
                                   </a>
                                   {design.status === 'approved' && (
                                   <button 
                                     onClick={() => {
                                        if(window.confirm('Unlink this product?')) {
                                          const newProducts = design.products.filter((_, idx) => idx !== i);
                                          handleDesignAction(selectedStore._id, design._id, 'products', newProducts);
                                        }
                                     }}
                                     className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10"
                                   >
                                     <X size={14} />
                                   </button>
                                   )}
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700/30 rounded-lg p-4">
                             <p className="text-xs italic text-center">No products linked</p>
                           </div>
                        )}
                     </div>
                  </div>
                </div>

                {/* Lower Section: Actions & Details */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-[#151F28]' : 'bg-gray-100'} flex flex-col sm:flex-row gap-3 items-center justify-between min-h-[60px] flex-none border-t border-gray-700/30`}>
                   
                   <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button 
                        onClick={() => downloadImage(design.designLink, `${design.designName || 'design'}.png`)}
                        className={`${softBtn} px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap`}
                      >
                        <Download size={14} /> Download
                      </button>
                      
                      {/* Rejection Reason Display */}
                      {design.rejectionReason && design.status === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-400 text-xs px-2 py-1 bg-red-500/10 rounded border border-red-500/20 truncate max-w-full" title={design.rejectionReason}>
                           <AlertCircle size={14} className="flex-shrink-0" />
                           <span className="truncate">{design.rejectionReason}</span>
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-2 flex-shrink-0">
                     {design.status !== 'approved' && (
                       <button 
                         onClick={() => handleDesignAction(selectedStore._id, design._id, 'status', { status: 'approved' })}
                         className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                         disabled={designActionLoading}
                       >
                         <Check size={14} /> Approve
                       </button>
                     )}
                     {design.status !== 'rejected' && (
                       <button 
                         onClick={() => {
                            setNoteModal({
                              open: true,
                              title: 'Reject Design',
                              label: 'Reason for Rejection',
                              action: (reason) => handleDesignAction(selectedStore._id, design._id, 'status', { status: 'rejected', rejectionReason: reason })
                            });
                         }}
                         className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                         disabled={designActionLoading}
                       >
                         <X size={14} /> Reject
                       </button>
                     )}
                   </div>

                </div>

              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme === "dark" ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"} min-h-screen p-4 sm:p-6 rounded-2xl`}>
      <h1 className="text-2xl sm:text-2xl font-semibold mb-1">Merch Store Management</h1>
      <p className="text-gray-400 text-xs sm:text-sm mb-6">Manage merchandise store requests and approvals</p>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
           <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
             <Users className="absolute top-4 right-4 h-5 w-5 text-gray-400" />
             <p className="text-gray-400 text-sm">Total Stores</p>
             <p className="text-2xl font-bold">{stats.totalStores}</p>
           </div>
           <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
             <Clock className="absolute top-4 right-4 h-5 w-5 text-yellow-400" />
             <p className="text-gray-400 text-sm">Pending Approval</p>
             <p className="text-2xl font-bold text-yellow-400">{stats.pendingStores}</p>
           </div>
           <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
             <Package className="absolute top-4 right-4 h-5 w-5 text-purple-400" />
             <p className="text-gray-400 text-sm">Design Submitted</p>
             <p className="text-2xl font-bold text-purple-400">{stats.designSubmittedStores}</p>
           </div>
           <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
             <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-green-400" />
             <p className="text-gray-400 text-sm">Live Stores</p>
             <p className="text-2xl font-bold text-green-400">{stats.designApprovedStores}</p>
           </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className={`${inputBg} flex items-center w-full sm:w-1/3 rounded-lg px-3 py-2`}>
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by user or artist name..."
            className="bg-transparent w-full text-sm outline-none placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className={`${inputBg} text-sm rounded-lg px-3 py-2`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="design_pending">Design Pending</option>
            <option value="design_submitted">Design Submitted</option>
            <option value="design_approved">Live</option>
          </select>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex ${theme === "dark" ? "border-gray-700" : "border-gray-300"} border-b mb-6`}>
        {["requests", "listed"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPagination(p => ({...p, page: 1})); }}
            className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-purple-500 text-purple-500" : "text-gray-400"}`}
          >
            {tab === "requests" ? "Requests" : "Listed Products"}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={`${boxBg} overflow-x-auto rounded-2xl shadow`}>
        {loading ? (
             <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
             <thead className={`${theme === "dark" ? "bg-[#151F28] text-gray-400" : "bg-gray-100 text-gray-600"}`}>
               {activeTab === 'requests' ? (
                 <tr>
                   <th className="px-4 py-3 text-left">Artist Label</th>
                   <th className="px-4 py-3 text-left">Account Info</th>
                   <th className="px-4 py-3 text-left">Status</th>
                   <th className="px-4 py-3 text-left">Marketing</th>
                   <th className="px-4 py-3 text-left">Submitted On</th>
                   <th className="px-4 py-3 text-left">Actions</th>
                 </tr>
               ) : (
                 <tr>
                    <th className="px-4 py-3 text-left">Artist Name</th>
                    <th className="px-4 py-3 text-left">Account ID</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Approved Designs</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                 </tr>
               )}
            </thead>
            <tbody>
              {activeTab === 'requests' ? (
                requests.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No requests found</td></tr>
                ) : (
                    requests.map((req) => (
                        <tr key={req._id} className={`${theme === "dark" ? "border-gray-800 hover:bg-gray-800/40" : "border-gray-200 hover:bg-gray-50"} border-t`}>
                           <td className="px-4 py-3 font-medium">
                             {req.artistInfo?.artistName}
                           </td>
                           <td className="px-4 py-3">
                             <div className="flex flex-col">
                               <span className="text-xs text-gray-400">ID: {req.userId?.accountId || 'N/A'}</span>
                               <span>{req.userId?.firstName} {req.userId?.lastName}</span>
                             </div>
                           </td>
                           <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                           <td className="px-4 py-3">
                             {req.marketingPlan?.planToPromote ? <span className="text-green-400 text-xs">Yes</span> : <span className="text-gray-500 text-xs">No</span>}
                             {req.marketingPlan?.mmcMarketingAssistance && <span className="ml-2 text-purple-400 text-xs">+MMC</span>}
                           </td>
                           <td className="px-4 py-3 text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                           <td className="px-4 py-3 flex gap-2">
                              <button 
                                onClick={() => handleViewStore(req._id, 'details')}
                                className={`${softBtn} px-2 py-1 rounded flex items-center gap-1 text-xs`}
                                title="View Request Details"
                              >
                                <Eye size={12} /> View
                              </button>

                             {/* Initial Approval Actions */}
                             {req.status === 'pending' && (
                               <>
                                 <button 
                                   onClick={() => openStatusUpdateModal(req._id, 'approved')}
                                   className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1 text-xs"
                                 >
                                   <Check size={12} /> Accept
                                 </button>
                                 <button 
                                   onClick={() => openStatusUpdateModal(req._id, 'rejected')}
                                   className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center gap-1 text-xs"
                                 >
                                   <X size={12} /> Reject
                                 </button>
                               </>
                             )}

                             {/* Design Management Actions */}
                             {(req.status === 'design_submitted' || req.designs?.length > 0) && (
                               <button 
                                 onClick={() => { setSelectedStore(req); setShowDesignModal(true); }}
                                 className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded flex items-center gap-1 text-xs"
                               >
                                 <Package size={12} /> View Designs
                               </button>
                             )}
                           </td>
                        </tr>
                    ))
                )
              ) : (
                listedProducts.length === 0 ? (
                     <tr><td colSpan="5" className="p-8 text-center text-gray-500">No listed products found</td></tr>
                ) : (
                    listedProducts.map((user) => (
                        <tr key={user._id} className={`${theme === "dark" ? "border-gray-800 hover:bg-gray-800/40" : "border-gray-200 hover:bg-gray-50"} border-t`}>
                            <td className="px-4 py-3 font-medium">{user.artistName}</td>
                            <td className="px-4 py-3 text-gray-400">{user.accountId}</td>
                            <td className="px-4 py-3 text-gray-400">{user.email}</td>
                            <td className="px-4 py-3 text-center">
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">{user.approvedDesignsCount}</span>
                            </td>
                            <td className="px-4 py-3">
                                <button 
                                  onClick={() => handleViewStore(user._id, 'designs')}
                                  className={`${softBtn} px-2 py-1 rounded flex items-center gap-1 text-xs`}
                                >
                                   <Eye size={12} /> View
                                </button>
                            </td>
                        </tr>
                    ))
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page <= 1 || loading}
            className={`${softBtn} px-3 py-1.5 rounded disabled:opacity-50 text-sm`}
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages || loading}
            className={`${softBtn} px-3 py-1.5 rounded disabled:opacity-50 text-sm`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDesignModal && <DesignModal />}
      {showRequestDetailsModal && <RequestDetailsModal />}
      {noteModal.open && <NoteModal />}
      {productModal.open && <ProductModal />}
    </div>
  );
}
