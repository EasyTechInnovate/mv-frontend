import React, { useState, useEffect } from 'react';
import { Eye, Plus, Upload, X, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { createMerchStore, getMerchStores, submitMerchDesigns, deleteMerchStore, getApprovedDesigns } from '@/services/api.services';
import { uploadToImageKit } from '@/utils/imagekitUploader';
import { showToast } from '@/utils/toast';

const MerchStore = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'submitDesign', 'viewDesigns'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [approvedDesigns, setApprovedDesigns] = useState([]);
  const [approvedPagination, setApprovedPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [formData, setFormData] = useState({
    artistName: '',
    artistFacebookLink: '',
    appleProfileLink: '',
    artistInstagramLink: '',
    spotifyProfileLink: '',
    youtubeChannelLink: '',
    productPreferences: {
      t_shirt: false,
      hoodie: false,
      sipper_bottle: false,
      posters: false,
      tote_bags: false,
      stickers: false,
      others: ''
    },
    marketingPlan: 'Yes',
    channels: {
      instagram: false,
      youtube: false,
      email_newsletter: false,
      live_events: false,
      others: ''
    },
    mmcAssist: 'Yes',
    legalTerms: {
      reviewProcess: false,
      revisionsRight: false,
      emailNewsletter: false,
      showcasingConsent: false
    }
  });

  const [designSlots, setDesignSlots] = useState(5);
  const [designNames, setDesignNames] = useState({});

  // Helper function to map API product names to UI labels
  const productMapping = {
    't_shirt': 'T-Shirts',
    'hoodie': 'Hoodies',
    'sipper_bottle': 'Sipper Bottles',
    'posters': 'Posters',
    'tote_bags': 'Tote Bags',
    'stickers': 'Stickers'
  };

  // Helper function to map API channel names to UI labels
  const channelMapping = {
    'instagram': 'Instagram',
    'youtube': 'YouTube',
    'email_newsletter': 'Email Newsletter',
    'live_events': 'Live Events'
  };

  // Fetch merch stores on component mount and when page changes
  useEffect(() => {
    fetchMerchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // Fetch approved designs when approved tab is active or pagination changes
  useEffect(() => {
    if (activeTab === 'approved') {
      fetchApprovedDesigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, approvedPagination.currentPage]);

  const fetchMerchStores = async () => {
    setLoading(true);
    try {
      const response = await getMerchStores({ page: pagination.currentPage, limit: 10 });
      if (response.success) {
        // Map API response to UI format
        const mappedRequests = response.data.merchStores.map(store => ({
          id: store._id,
          storeId: store._id,
          artistName: store.artistInfo.artistName,
          productPreferences: store.productPreferences.selectedProducts
            .map(p => productMapping[p] || p)
            .join(', ') + (store.productPreferences.otherProductDescription ? `, ${store.productPreferences.otherProductDescription}` : ''),
          marketingPlan: store.marketingPlan.planToPromote ? 'Yes' : 'No',
          channel: store.marketingPlan.promotionChannels
            .map(c => channelMapping[c] || c)
            .join(', ') + (store.marketingPlan.otherChannelDescription ? `, ${store.marketingPlan.otherChannelDescription}` : '') || 'N/A',
          mmcAssist: store.marketingPlan.mmcMarketingAssistance ? 'Yes' : 'No',
          status: mapStatusToUI(store.status),
          submitDate: new Date(store.createdAt).toISOString().split('T')[0],
          hasDesignSubmitted: store.status === 'design_submitted' || store.status === 'design_approved' || (store.designs && store.designs.length > 0),
          designs: store.designs || [],
          rawData: store
        }));
        setRequests(mappedRequests);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching merch stores:', error);
      showToast.error('Failed to fetch merch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedDesigns = async () => {
    setLoading(true);
    try {
      const response = await getApprovedDesigns({ page: approvedPagination.currentPage, limit: 10 });
      if (response.success) {
        setApprovedDesigns(response.data.designs);
        setApprovedPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching approved designs:', error);
      showToast.error('Failed to fetch approved designs');
    } finally {
      setLoading(false);
    }
  };

  // Map API status to UI status
  const mapStatusToUI = (apiStatus) => {
    const statusMap = {
      'pending': 'Pending',
      'design_pending': 'Design Pending',
      'rejected': 'Rejected',
      'design_rejected': 'Design Rejected',
      'design_submitted': 'Design Submitted',
      'design_approved': 'Live'
    };
    return statusMap[apiStatus] || apiStatus;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (slotIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      // Show uploading state
      setUploadedFiles(prev => ({
        ...prev,
        [slotIndex]: {
          uploading: true,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));

      try {
        // Upload to ImageKit immediately
        const uploadResult = await uploadToImageKit(file, 'merch-designs');
        
        // Store the uploaded URL
        setUploadedFiles(prev => ({
          ...prev,
          [slotIndex]: {
            uploading: false,
            uploaded: true,
            url: uploadResult.url,
            name: file.name,
            size: file.size,
            type: file.type
          }
        }));
        
        showToast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error('Error uploading file:', error);
        showToast.error(`Failed to upload ${file.name}`);
        
        // Remove from state on error
        setUploadedFiles(prev => {
          const updated = { ...prev };
          delete updated[slotIndex];
          return updated;
        });
      }
    }
  };

  const handleNewRequest = () => {
    setCurrentView('form');
    setSelectedRequest(null);
    setFormData({
      artistName: '',
      artistFacebookLink: '',
      appleProfileLink: '',
      artistInstagramLink: '',
      spotifyProfileLink: '',
      youtubeChannelLink: '',
      productPreferences: {
        t_shirt: false,
        hoodie: false,
        sipper_bottle: false,
        posters: false,
        tote_bags: false,
        stickers: false,
        others: ''
      },
      marketingPlan: 'Yes',
      channels: {
        instagram: false,
        youtube: false,
        email_newsletter: false,
        live_events: false,
        others: ''
      },
      mmcAssist: 'Yes',
      legalTerms: {
        reviewProcess: false,
        revisionsRight: false,
        emailNewsletter: false,
        showcasingConsent: false
      }
    });
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setCurrentView('form');

    // Get raw data from API
    const rawData = request.rawData;

    // Map API response to form fields
    setFormData({
      artistName: rawData.artistInfo.artistName,
      artistFacebookLink: rawData.artistInfo.facebookLink || '',
      appleProfileLink: rawData.artistInfo.appleMusicProfileLink || '',
      artistInstagramLink: rawData.artistInfo.instagramLink || '',
      spotifyProfileLink: rawData.artistInfo.spotifyProfileLink || '',
      youtubeChannelLink: rawData.artistInfo.youtubeMusicProfileLink || '',
      productPreferences: {
        t_shirt: rawData.productPreferences.selectedProducts.includes('t_shirt'),
        hoodie: rawData.productPreferences.selectedProducts.includes('hoodie'),
        sipper_bottle: rawData.productPreferences.selectedProducts.includes('sipper_bottle'),
        posters: rawData.productPreferences.selectedProducts.includes('posters'),
        tote_bags: rawData.productPreferences.selectedProducts.includes('tote_bags'),
        stickers: rawData.productPreferences.selectedProducts.includes('stickers'),
        others: rawData.productPreferences.otherProductDescription || ''
      },
      marketingPlan: rawData.marketingPlan.planToPromote ? 'Yes' : 'No',
      channels: {
        instagram: rawData.marketingPlan.promotionChannels.includes('instagram'),
        youtube: rawData.marketingPlan.promotionChannels.includes('youtube'),
        email_newsletter: rawData.marketingPlan.promotionChannels.includes('email_newsletter'),
        live_events: rawData.marketingPlan.promotionChannels.includes('live_events'),
        others: rawData.marketingPlan.otherChannelDescription || ''
      },
      mmcAssist: rawData.marketingPlan.mmcMarketingAssistance ? 'Yes' : 'No',
      legalTerms: {
        reviewProcess: rawData.legalConsents.agreeToReviewProcess,
        revisionsRight: rawData.legalConsents.understandRevisionRights,
        emailNewsletter: false,
        showcasingConsent: rawData.legalConsents.consentToShowcase
      }
    });
  };

  const handleSubmitDesign = (request) => {
    setSelectedRequest(request);
    setCurrentView('submitDesign');
    setUploadedFiles({});
    setDesignNames({});
  };

  const handleViewDesigns = (request) => {
    setSelectedRequest(request);
    setCurrentView('viewDesigns');
  };

  const handleApply = async () => {
    if (selectedRequest) {
      // Viewing mode - just go back to list
      setCurrentView('list');
      return;
    }

    // Create new request - map form data to API format
    setLoading(true);
    try {
      const selectedProducts = Object.keys(formData.productPreferences)
        .filter(key => key !== 'others' && formData.productPreferences[key] === true);

      const promotionChannels = Object.keys(formData.channels)
        .filter(key => key !== 'others' && formData.channels[key] === true);

      const requestData = {
        artistInfo: {
          artistName: formData.artistName,
          instagramLink: formData.artistInstagramLink,
          facebookLink: formData.artistFacebookLink,
          spotifyProfileLink: formData.spotifyProfileLink,
          appleMusicProfileLink: formData.appleProfileLink,
          youtubeMusicProfileLink: formData.youtubeChannelLink
        },
        productPreferences: {
          selectedProducts,
          otherProductDescription: formData.productPreferences.others
        },
        marketingPlan: {
          planToPromote: formData.marketingPlan === 'Yes',
          promotionChannels,
          otherChannelDescription: formData.channels.others,
          mmcMarketingAssistance: formData.mmcAssist === 'Yes'
        },
        legalConsents: {
          agreeToReviewProcess: formData.legalTerms.reviewProcess,
          understandRevisionRights: formData.legalTerms.revisionsRight,
          consentToShowcase: formData.legalTerms.showcasingConsent
        }
      };

      const response = await createMerchStore(requestData);
      if (response.success) {
        showToast.success('Merch store request created successfully!');
        setCurrentView('list');
        fetchMerchStores(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating merch store:', error);
      showToast.error(error?.response?.data?.message || 'Failed to create merch store request');
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status, solid = false }) => {
    const solidStyles = {
      pending: "bg-yellow-500 text-white border-yellow-600",
      approved: "bg-green-600 text-white border-green-700",
      rejected: "bg-red-600 text-white border-red-700",
      design_pending: "bg-blue-500 text-white border-blue-600",
      design_submitted: "bg-purple-600 text-white border-purple-700",
      design_approved: "bg-emerald-600 text-white border-emerald-700",
      design_rejected: "bg-orange-600 text-white border-orange-700",
    };

    const transparentStyles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      design_pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      design_submitted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      design_approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      design_rejected: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };

    const labels = {
       'pending': 'Pending',
       'design_pending': 'Design Pending',
       'rejected': 'Rejected',
       'design_rejected': 'Design Rejected',
       'design_submitted': 'Design Submitted',
       'design_approved': 'Live',
       'approved': 'Approved'
     };

    // Normalize status key: handling "Design Pending" -> "design_pending"
    const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_');
    const styles = solid ? solidStyles : transparentStyles;
    const statusKey = styles[normalizedStatus] ? normalizedStatus : 'pending';

    if (solid) {
        return (
             <span className={`px-2.5 py-1 rounded shadow-sm text-xs font-bold uppercase tracking-wider border ${styles[statusKey]}`}>
               {labels[statusKey] || status}
             </span>
        );
    }
    
    return (
      <Badge variant="outline" className={`px-2.5 py-0.5 border ${styles[statusKey]}`}>
        {labels[statusKey] || status}
      </Badge>
    );
  };

  const renderApprovedDesigns = () => {
    return (
      <div className="space-y-6">
        {approvedDesigns.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
            {approvedDesigns.map((design, index) => (
              <div key={design._id || index} className="rounded-lg border border-border overflow-hidden flex flex-col shadow-sm bg-card text-card-foreground">
                
                {/* Upper Section: Split View */}
                <div className="flex flex-col md:flex-row border-b border-border">
                  
                  {/* Left: Image & Name */}
                  <div className="w-full md:w-1/2 p-4 flex flex-col gap-3">
                     <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-muted-foreground uppercase font-bold" title={design.designName}>{design.designName || `Design ${index + 1}`} {design.artistName && `by ${design.artistName} (${design.accountId})` } </label>
                     </div>

                     <div className="relative h-[200px] w-full bg-muted/20 rounded-lg overflow-hidden group flex items-center justify-center">
                        <img 
                          src={design.designLink} 
                          alt={design.designName} 
                          className="w-full h-full object-contain md:object-cover rounded-xl"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Design+Preview'; }}
                        />
                        <div className="absolute top-2 left-2 z-10">
                          <StatusBadge status="design_approved" solid={true} /> 
                        </div>
                     </div>
                  </div>

                  {/* Right: Products */}
                  <div className="w-full md:w-1/2 p-4 flex flex-col">
                     <div className="flex justify-between items-center mb-3">
                        <label className="text-xs text-muted-foreground uppercase font-bold">Approved Products</label>
                     </div>

                     <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 pr-1 custom-scroll">
                        {design.products && design.products.length > 0 ? (
                           design.products.map((prod, i) => (
                              <div key={i} className="flex items-center justify-between p-2.5 rounded bg-background border border-border shadow-sm">
                                 <div className="flex flex-col min-w-0">
                                   <span className="font-medium text-xs truncate" title={prod.name}>{prod.name}</span>
                                    {prod.link && <span className="text-[10px] text-muted-foreground truncate">{new URL(prod.link).hostname}</span>}
                                 </div>
                                 <a 
                                   href={prod.link} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10 ml-2"
                                   title="Open Store Link"
                                 >
                                   <Eye size={14} />
                                 </a>
                              </div>
                           ))
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg p-4">
                             <p className="text-xs italic text-center">No products linked</p>
                           </div>
                        )}
                     </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{loading ? 'Loading...' : 'No approved designs found.'}</p>
          </div>
        )}
      </div>
    );
  };

  const renderList = () => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Merch Store</h1>
            <p className="text-muted-foreground">Set up your merchandise store and manage products</p>
          </div>
          <Button onClick={handleNewRequest} className="bg-[#711CE9] hover:bg-[#6f14ef] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved Designs</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto custom-scroll">
                  <table className="w-full  whitespace-nowrap ">
                    <thead className="border-b text-muted-foreground  ">
                      <tr>
                        <th className="text-left p-4 font-medium">Artist/Label Name</th>
                        <th className="text-left p-4 font-medium">Product Preferences</th>
                        <th className="text-left p-4 font-medium">Marketing & Launch Plan</th>
                        <th className="text-left p-4 font-medium">Channel</th>
                        <th className="text-left p-4 font-medium">MMC Assist</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Submit Date</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && requests.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-muted-foreground">
                            Loading...
                          </td>
                        </tr>
                      ) : requests.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-muted-foreground">
                            No merch store requests found. Click "New Request" to create one.
                          </td>
                        </tr>
                      ) : (
                        requests.map((request) => (
                        <tr key={request.id} className="border-b">
                          <td className="p-4">{request.artistName}</td>
                          <td className="p-4">{request.productPreferences}</td>
                          <td className="p-4">{request.marketingPlan}</td>
                          <td className="p-4">{request.channel}</td>
                          <td className="p-4">{request.mmcAssist}</td>
                          <td className="p-4">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="p-4">{request.submitDate}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {/* Changed View to Review for consistency if needed, but keeping View for now as per instructions "view button make it review button with eye icon" - implementing this change */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="w-4 h-4" /> Review
                              </Button>
                              {request.status === 'Design Pending' && !request.hasDesignSubmitted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSubmitDesign(request)}
                                  className="text-green-400 border-green-500/30"
                                >
                                  Submit Design
                                </Button>
                              )}
                              {/* View Merch Logic Updated: Show for any status if designs exist, to see notes/rejections */}
                              {(request.hasDesignSubmitted || request.designs.length > 0) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDesigns(request)}
                                  className="text-blue-400 border-blue-500/30"
                                >
                                  View Merch
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to delete this merch store request?')) {
                                    setLoading(true);
                                    try {
                                      const response = await deleteMerchStore(request.storeId);
                                      if (response.success) {
                                        showToast.success('Merch store deleted successfully');
                                        fetchMerchStores(); // Refresh the list
                                      }
                                    } catch (error) {
                                      console.error('Error deleting merch store:', error);
                                      showToast.error(error?.response?.data?.message || 'Failed to delete merch store');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                className="text-red-400 border-red-500/30"
                                disabled={loading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total requests)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={!pagination.hasPrevPage || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={!pagination.hasNextPage || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
             {renderApprovedDesigns()}
             
             {/* Pagination Controls for Approved Designs */}
             {approvedPagination.totalPages > 1 && (
               <div className="flex items-center justify-between mt-6">
                 <div className="text-sm text-muted-foreground">
                   Showing page {approvedPagination.currentPage} of {approvedPagination.totalPages} ({approvedPagination.totalCount} total approved designs)
                 </div>
                 <div className="flex gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setApprovedPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                     disabled={!approvedPagination.hasPrevPage || loading}
                   >
                     Previous
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setApprovedPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                     disabled={!approvedPagination.hasNextPage || loading}
                   >
                     Next
                   </Button>
                 </div>
               </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentView('list')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Merch Store</h1>
              <p className="text-muted-foreground">Set up your merchandise store and manage products</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="artistName">Artist/Label Name</Label>
              <Input
                id="artistName"
                value={formData.artistName}
                onChange={(e) => handleInputChange('artistName', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="Artist"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Artist's Instagram Link</Label>
              <Input
                id="instagram"
                value={formData.artistInstagramLink}
                onChange={(e) => handleInputChange('artistInstagramLink', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="Instagram URL"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Artist Facebook Page Link</Label>
              <Input
                id="facebook"
                value={formData.artistFacebookLink}
                onChange={(e) => handleInputChange('artistFacebookLink', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="Facebook URL"
              />
            </div>
            <div>
              <Label htmlFor="spotify">Spotify Profile Link</Label>
              <Input
                id="spotify"
                value={formData.spotifyProfileLink}
                onChange={(e) => handleInputChange('spotifyProfileLink', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="Spotify URL"
              />
            </div>
            <div>
              <Label htmlFor="apple">Apple Music Profile Link</Label>
              <Input
                id="apple"
                value={formData.appleProfileLink}
                onChange={(e) => handleInputChange('appleProfileLink', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="Apple Music URL"
              />
            </div>
            <div>
              <Label htmlFor="youtube">YouTube Channel Link</Label>
              <Input
                id="youtube"
                value={formData.youtubeChannelLink}
                onChange={(e) => handleInputChange('youtubeChannelLink', e.target.value)}
                disabled={selectedRequest !== null}
                placeholder="YouTube URL"
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Preferences</CardTitle>
            <CardDescription>Select the types of products you want to launch with your designs:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { key: 't_shirt', label: 'T-Shirts' },
                { key: 'hoodie', label: 'Hoodies' },
                { key: 'sipper_bottle', label: 'Sipper Bottles' },
                { key: 'posters', label: 'Posters' },
                { key: 'tote_bags', label: 'Tote Bags' },
                { key: 'stickers', label: 'Stickers' }
              ].map(product => (
                <div key={product.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={product.key}
                    checked={formData.productPreferences[product.key]}
                    onCheckedChange={(checked) => handleNestedChange('productPreferences', product.key, checked)}
                    disabled={selectedRequest !== null}
                  />
                  <Label htmlFor={product.key}>{product.label}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="othersProduct">Others:</Label>
              <Input
                id="othersProduct"
                value={formData.productPreferences.others}
                onChange={(e) => handleNestedChange('productPreferences', 'others', e.target.value)}
                disabled={selectedRequest !== null}
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing & Launch Plan */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Marketing & Launch Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="marketingPlan">Do you plan to promote the merch drop?</Label>
              <Select
                value={formData.marketingPlan}
                onValueChange={(value) => handleInputChange('marketingPlan', value)}
                disabled={selectedRequest !== null}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-4 block">Channels you'll use:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'instagram', label: 'Instagram' },
                  { key: 'youtube', label: 'YouTube' },
                  { key: 'email_newsletter', label: 'Email Newsletter' },
                  { key: 'live_events', label: 'Live Events' }
                ].map(channel => (
                  <div key={channel.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.key}
                      checked={formData.channels[channel.key]}
                      onCheckedChange={(checked) => handleNestedChange('channels', channel.key, checked)}
                      disabled={selectedRequest !== null}
                    />
                    <Label htmlFor={channel.key}>{channel.label}</Label>
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="othersChannel">Others:</Label>
                <Input
                  id="othersChannel"
                  value={formData.channels.others}
                  onChange={(e) => handleNestedChange('channels', 'others', e.target.value)}
                  disabled={selectedRequest !== null}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mmcAssist">Would you like MMC to assist with marketing?</Label>
              <Select
                value={formData.mmcAssist}
                onValueChange={(value) => handleInputChange('mmcAssist', value)}
                disabled={selectedRequest !== null}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Approval Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Legal & Approval Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'reviewProcess', label: "I agree to MMC's review and approval process before merch goes live." },
                { key: 'revisionsRight', label: "I understand that MMC reserves the right to reject or request revisions to submitted designs." },
                { key: 'emailNewsletter', label: "Email Newsletter" },
                { key: 'showcasingConsent', label: "I consent to MMC showcasing approved designs on its platform and social media." }
              ].map(term => (
                <div key={term.key} className="flex items-start space-x-2">
                  <Checkbox
                    id={term.key}
                    checked={formData.legalTerms[term.key]}
                    onCheckedChange={(checked) => handleNestedChange('legalTerms', term.key, checked)}
                    disabled={selectedRequest !== null}
                    className="mt-0.5"
                  />
                  <Label htmlFor={term.key} className="text-sm leading-5">{term.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentView('list')}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-[#711CE9] text-white hover:bg-[#6f14ef]"
            disabled={selectedRequest !== null || loading}
          >
            {loading ? 'Submitting...' : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSubmitDesign = () => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentView('list')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Merch Store</h1>
              <p className="text-muted-foreground">Set up your merchandise store and manage products</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Submit Your Designs (Minimum 5)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: designSlots }, (_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Design {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Design Name Input */}
                  <div>
                    <Label htmlFor={`design-name-${index}`} className="mb-2 -mt-2">Design Name (Optional)</Label>
                    <Input
                      id={`design-name-${index}`}
                      placeholder={`Design ${index + 1}`}
                      value={designNames[index] || ''}
                      onChange={(e) => setDesignNames(prev => ({
                        ...prev,
                        [index]: e.target.value
                      }))}
                    />
                  </div>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    {uploadedFiles[index] ? (
                      uploadedFiles[index].uploading ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto border-4 border-[#711CE9] border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-medium">Uploading {uploadedFiles[index].name}...</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFiles[index].size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Check className="w-12 h-12 text-green-500 mx-auto" />
                          <p className="text-sm font-medium">{uploadedFiles[index].name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFiles[index].size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-xs text-green-500">✓ Uploaded successfully</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUploadedFiles(prev => {
                                const updated = { ...prev };
                                delete updated[index];
                                return updated;
                              });
                              setDesignNames(prev => {
                                const updated = { ...prev };
                                delete updated[index];
                                return updated;
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Drop your Design file here</p>
                        <p className="text-sm text-muted-foreground mb-4">Supports: PNG, JPG, SVG, PDF</p>
                        <div className="relative">
                          <Button className="bg-[#711CE9] hover:bg-[#6f14ef] text-white">
                            Choose File
                          </Button>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            onChange={(e) => handleFileUpload(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add more design slot */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add more Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Plus className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Add another design slot</p>
                <p className="text-sm text-muted-foreground mb-4">Increase your design options</p>
                <Button
                  onClick={() => setDesignSlots(prev => prev + 1)}
                  variant="outline"
                >
                  Add Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal & Approval Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Legal & Approval Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "I confirm that all submitted designs are original and do not infringe on third-party rights.",
                "I agree to MMC's review and approval process before merch goes live.",
                "I understand that MMC reserves the right to reject or request revisions to submitted designs.",
                "I consent to MMC showcasing approved designs on its platform and social media."
              ].map((term, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox id={`design-term-${index}`} className="mt-0.5" />
                  <Label htmlFor={`design-term-${index}`} className="text-sm leading-5">{term}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentView('list')}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const uploadedFileCount = Object.keys(uploadedFiles).length;

              // Validate minimum 5 designs
              if (uploadedFileCount < 5) {
                showToast.error('Please upload at least 5 designs');
                return;
              }

              // Check if any files are still uploading
              const stillUploading = Object.values(uploadedFiles).some(file => file.uploading);
              if (stillUploading) {
                showToast.error('Please wait for all files to finish uploading');
                return;
              }

              // Check if all files have been uploaded successfully
              const allUploaded = Object.values(uploadedFiles).every(file => file.uploaded && file.url);
              if (!allUploaded) {
                showToast.error('Some files failed to upload. Please remove and re-upload them.');
                return;
              }

              setLoading(true);
              try {
                // Prepare designs array with already-uploaded URLs and names
                const designs = Object.keys(uploadedFiles).map(fileIndex => ({
                  designLink: uploadedFiles[fileIndex].url,
                  designName: designNames[fileIndex] || `Design ${parseInt(fileIndex) + 1}`
                }));

                // Submit designs to API
                const response = await submitMerchDesigns(selectedRequest.storeId, designs);

                if (response.success) {
                  showToast.success('Designs submitted successfully!');
                  setCurrentView('list');
                  setUploadedFiles({});
                  fetchMerchStores(); // Refresh the list
                }
              } catch (error) {
                console.error('Error submitting designs:', error);
                showToast.error(error?.response?.data?.message || 'Failed to submit designs');
              } finally {
                setLoading(false);
              }
            }}
            className="bg-[#711CE9] hover:bg-[#6f14ef] text-white"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Designs'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderViewDesigns = () => {
    // Helper to get status color
    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      }
    };

    return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentView('list')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Merch Store</h1>
              <p className="text-muted-foreground">{selectedRequest?.artistName} - Design Application</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Designs</CardTitle>
            <CardDescription>
              {selectedRequest?.designs?.length} designs submitted. Review status and details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRequest?.designs && selectedRequest.designs.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
                {selectedRequest.designs.map((design, index) => (
                  <div key={design._id || index} className="rounded-lg border border-border overflow-hidden flex flex-col shadow-sm bg-card text-card-foreground">
                    
                    {/* Upper Section: Split View */}
                    <div className="flex flex-col md:flex-row border-b border-border">
                      {/* Left: Image & Name */}
                      <div className="w-full md:w-1/2 p-4 ">
                         <div className="flex justify-between items-center mb-3">
                            <label className="text-xs text-muted-foreground uppercase font-bold" title={design.designName}>{design.designName || `Design ${index + 1}`}</label>
                         </div>
                        
                         <div className="relative h-[200px] w-full bg-muted/20 rounded-lg overflow-hidden group flex items-center justify-center">
                            <img 
                              src={design.designLink} 
                              alt={design.designName || `Design ${index + 1}`} 
                              className="w-full h-full object-contain md:object-cover   rounded-xl"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Design+Preview'; }}
                            />
                            <div className="absolute top-2 left-2 z-10">
                              <StatusBadge status={design.status || 'pending'} solid={true} /> 
                            </div>
                         </div>
                      </div>

                      {/* Right: Products & Details */}
                      <div className="w-full md:w-1/2 p-4 flex flex-col ">
                         <div className="flex justify-between items-center mb-3">
                            <label className="text-xs text-muted-foreground uppercase font-bold">Linked Products</label>
                         </div>

                         <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 pr-1 custom-scroll">
                            {design.products && design.products.length > 0 ? (
                               design.products.map((prod, i) => (
                                  <div key={i} className="flex items-center justify-between p-2.5 rounded bg-background border border-border shadow-sm">
                                     <div className="flex flex-col min-w-0">
                                       <span className="font-medium text-xs truncate" title={prod.name}>{prod.name}</span>
                                        {prod.link && <span className="text-[10px] text-muted-foreground truncate">{new URL(prod.link).hostname}</span>}
                                     </div>
                                     <a 
                                       href={prod.link} 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10 ml-2"
                                       title="Open Store Link"
                                     >
                                       <Eye size={14} />
                                     </a>
                                  </div>
                               ))
                            ) : (
                               <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg p-4">
                                 <p className="text-xs italic text-center">No products linked</p>
                                 {design.status === 'approved' && <p className="text-[10px] text-muted-foreground mt-1">Contact Admin to add</p>}
                               </div>
                            )}
                         </div>
                      </div>
                    </div>

                    {/* Lower Section: Actions & Rejection Reason */}
                   {/* <div className="p-3 bg-muted/30 flex items-center justify-between min-h-[60px] border-t border-border">
                       <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                           {(design.rejectionReason || design.adminNotes) && (
                             <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded border truncate max-w-full ${design.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`} title={design.rejectionReason || design.adminNotes}>
                                <span className="truncate flex-1"><strong>{design.status === 'rejected' ? 'Rejection:' : 'Note:'}</strong> {design.rejectionReason || design.adminNotes}</span>
                             </div>
                           )}
                       </div>
                       <div>
                           <label className="text-xs text-muted-foreground uppercase font-bold mb-1 block">Design Name</label>
                           <p className="font-medium text-sm truncate" title={design.designName}>{design.designName || `Design ${index + 1}`}</p>
                         </div>
                       
                       <a 
                         href={design.designLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex-shrink-0"
                       >
                         <Button size="sm" variant="outline" className="flex items-center gap-2 text-xs">
                            <Eye className="w-4 h-4" /> View High-Res
                         </Button>
                       </a>
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No designs submitted yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
  };

  // Main render
  switch (currentView) {
    case 'form':
      return renderForm();
    case 'submitDesign':
      return renderSubmitDesign();
    case 'viewDesigns':
      return renderViewDesigns();
    default:
      return renderList();
  }
};

export default MerchStore;