import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Plus, ArrowLeft, ChevronLeft, ChevronRight, Music } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getMySyncSubmissions,
  submitSyncRequest,
  getMyPlaylistPitchingSubmissions,
  submitPlaylistPitchingRequest
} from "../../services/api.services"
import { showToast } from "../../utils/toast"

import {
  genreOptions,
  moodOptions,
  languageOptions,
  themeOptions,
  vocalsPresentOptions,
  syncClearedOptions,
  storeOptions,
  masterRightsOptions,
  publishingRightsOptions,
} from "../../constants/options";
export default function MVMarketing() {
  const [activeTab, setActiveTab] = useState('sync') // 'sync' or 'playlistPitching'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Unified state to manage form visibility, data, and view-only mode for both tabs
  const [viewState, setViewState] = useState({
    sync: { showForm: false, data: null, isViewOnly: false },
    playlistPitching: { showForm: false, data: null, isViewOnly: false },
  })

  const queryClient = useQueryClient()

  // --- DATA FETCHING ---
  const { data: syncData, isLoading: isSyncLoading } = useQuery({
    queryKey: ['syncSubmissions', currentPage],
    queryFn: () => getMySyncSubmissions({ page: currentPage, limit: itemsPerPage }),
    enabled: activeTab === 'sync',
    keepPreviousData: true,
  })

  const { data: pitchingData, isLoading: isPitchingLoading } = useQuery({
    queryKey: ['playlistPitchingSubmissions', currentPage],
    queryFn: () => getMyPlaylistPitchingSubmissions({ page: currentPage, limit: itemsPerPage }),
    enabled: activeTab === 'playlistPitching',
    keepPreviousData: true,
  })

  const syncRequests = syncData?.data?.submissions || []
  const syncPagination = syncData?.data?.pagination

  const pitchingRequests = pitchingData?.data?.submissions || []
  const pitchingPagination = pitchingData?.data?.pagination

  const isLoading = activeTab === 'sync' ? isSyncLoading : isPitchingLoading
  const currentRequests = activeTab === 'sync' ? syncRequests : pitchingRequests
  const currentPagination = activeTab === 'sync' ? syncPagination : pitchingPagination


  // --- FORM DATA ---

  const initialSyncFormData = {
    trackName: "", artistName: "", labelName: "", isrc: "", genres: "pop", mood: "uplifting", isVocalsPresent: false, language: "beats", theme: "journey & travel", tempoBPM: "", masterRightsOwner: "artist", publishingRightsOwner: "artist", isFullyClearedForSync: true, proAffiliation: "", projectSuitability: { ad_campaigns: false, ott_web_series: false, tv_film_score: false, trailers: false, podcasts: false, corporate_films: false, fashion_or_product_launch: false, gaming_animation: false, festival_documentaries: false, short_films_student_projects: false }, trackLinks: ""
  };
  
  const initialPitchingFormData = {
    trackName: "", artistName: "", labelName: "", isrc: "", genres: "pop", mood: "uplifting", isVocalsPresent: false, language: "beats", theme: "journey & travel", selectedStore: "", trackLinks: [{platform: '', url: ''}]
  };

  // --- HANDLERS ---
  
  const handleNewRequest = (tab) => {
    const initialData = tab === 'sync' ? initialSyncFormData : initialPitchingFormData;
    setViewState(prev => ({
        ...prev,
        [tab]: { showForm: true, data: initialData, isViewOnly: false }
    }));
  };

  const handleView = (tab, item) => {
    let projectSuitability = {};
    if (tab === 'sync') {
      // Convert array from API to object for checkboxes
      Object.keys(initialSyncFormData.projectSuitability).forEach(key => {
        projectSuitability[key] = item.projectSuitability.includes(key);
      });
    }

    setViewState(prev => ({
        ...prev,
        [tab]: { 
          showForm: true, 
          data: {
            ...item,
            // The API sends genres as an array, but the Select component expects a single value.
            // We take the first genre from the array for display purposes.
            genres: Array.isArray(item.genres) ? item.genres[0] : item.genres,
            projectSuitability: tab === 'sync' ? projectSuitability : undefined,
            trackLinks: tab === 'sync' ? (item.trackLinks?.[0]?.url || '') : (item.trackLinks || [{platform: '', url: ''}])
          }, 
          isViewOnly: true }
    }));
  };
  
  const handleBackToList = (tab) => {
    setViewState(prev => ({
      ...prev,
      [tab]: { ...prev[tab], showForm: false, data: null }
    }));
  };

  const syncMutation = useMutation({
    mutationFn: submitSyncRequest,
    onSuccess: () => {
      showToast.success("Sync request submitted successfully!");
      queryClient.invalidateQueries(['syncSubmissions']);
      handleBackToList('sync');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Failed to submit sync request.");
    }
  });

  const pitchingMutation = useMutation({
    mutationFn: submitPlaylistPitchingRequest,
    onSuccess: () => {
      showToast.success("Playlist pitch submitted successfully!");
      queryClient.invalidateQueries(['playlistPitchingSubmissions']);
      handleBackToList('playlistPitching');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Failed to submit playlist pitch.");
    }
  });

  const handleFormSubmit = (tab) => {
    const formData = viewState[tab].data;
    if (tab === 'sync') {
      const payload = {
        ...formData,
        genres: [formData.genres], // Already lowercase
        proAffiliation: formData.proAffiliation.toLowerCase(),
        language: formData.language.toLowerCase(),
        theme: formData.theme.toLowerCase(),
        projectSuitability: Object.keys(formData.projectSuitability).filter(key => formData.projectSuitability[key]),
        trackLinks: [{ platform: "Spotify", url: formData.trackLinks }] // Assuming Spotify for now
      };
      syncMutation.mutate(payload);
    } else {
      const payload = {
        ...formData,
        genres: [formData.genres], // Already lowercase
        language: formData.language.toLowerCase(),
        theme: formData.theme.toLowerCase(),
        trackLinks: formData.trackLinks,
      };
      pitchingMutation.mutate(payload);
    }
  };

  const isSubmitting = syncMutation.isLoading || pitchingMutation.isLoading;

  const handleTrackLinkChange = (index, url) => {
    setViewState(prev => {
      const newTrackLinks = [...prev.playlistPitching.data.trackLinks];
      newTrackLinks[index] = { ...newTrackLinks[index], url };
      return {
        ...prev,
        playlistPitching: {
          ...prev.playlistPitching,
          data: {
            ...prev.playlistPitching.data,
            trackLinks: newTrackLinks,
          }
        }
      }
    });
  };

  const handleInputChange = (tab, field, value) => {
    setViewState(prev => {
        const newData = { ...prev[tab].data, [field]: value };
        if (field === 'isVocalsPresent' && value === false) {
            newData.language = '';
        }
        if (tab === 'playlistPitching' && field === 'selectedStore') {
            if (value === 'select_all') {
                newData.trackLinks = [
                    { platform: 'Spotify', url: '' },
                    { platform: 'Apple Music', url: '' },
                    { platform: 'JioSaavn', url: '' },
                    { platform: 'Amazon Music', url: '' },
                ];
            } else {
                newData.trackLinks = [{ platform: value, url: '' }];
            }
        }
        return {
            ...prev,
            [tab]: {
                ...prev[tab],
                data: newData
            }
        };
    });
  };

  const handleCheckboxChange = (field, checked) => {
    setViewState(prev => ({
        ...prev,
        sync: {
            ...prev.sync,
            data: {
                ...prev.sync.data,
                projectSuitability: { ...prev.sync.data.projectSuitability, [field]: checked }
            }
        }
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (currentPagination?.totalPages || 1)) {
        setCurrentPage(newPage)
    }
  }


  // --- RENDER FUNCTIONS ---

  const renderSyncForm = () => {
    const { data, isViewOnly } = viewState.sync;
    if (!data) return null;

    return (
        <div>
          <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="icon" onClick={() => handleBackToList('sync')}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isViewOnly ? 'View Sync Request' : 'New Sync Request'}</h1>
                <p className="text-muted-foreground">{isViewOnly ? 'Viewing the details for your sync submission.' : 'Fill in the details for your sync submission.'}</p>
              </div>
          </div>
          <Card>
              <CardContent className="p-8 space-y-8">
                  {/* Basic Information Section */}
                  <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputWithLabel id="trackName" label="Track Name" placeholder="Artist" value={data.trackName} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'trackName', e.target.value)} />
                          <InputWithLabel id="artistName" label="Artist Name" placeholder="Name" value={data.artistName} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'artistName', e.target.value)} />
                          <InputWithLabel id="labelName" label="Label Name" placeholder="Label Name" value={data.labelName} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'labelName', e.target.value)} />
                          <InputWithLabel id="isrc" label="ISRC of the Track" placeholder="9856674676476" value={data.isrc} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'isrc', e.target.value)} />
                          <SelectWithLabel id="genres" label="Genres" value={data.genres} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'genres', value)} options={genreOptions} />
                          <SelectWithLabel id="mood" label="Mood" value={data.mood} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'mood', value)} options={moodOptions} />
                          <SelectWithLabel id="isVocalsPresent" label="Is Vocals Present?" value={data.isVocalsPresent} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'isVocalsPresent', value)} options={vocalsPresentOptions} />
                          <SelectWithLabel id="language" label="Language" value={data.language} disabled={isViewOnly || !data.isVocalsPresent} onValueChange={(value) => handleInputChange('sync', 'language', value)} options={languageOptions} />
                          <div className="md:col-span-2">
                             <SelectWithLabel id="theme" label="Theme" value={data.theme} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'theme', value)} options={themeOptions} />
                          </div>
                          <InputWithLabel id="tempoBPM" label="Tempo/BPM" placeholder="Lorem ipsum" value={data.tempoBPM} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'tempoBPM', e.target.value)} />
                      </div>
                  </div>

                  {/* Rights Ownership Section */}
                  <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20h-6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v5"/><path d="M11 12H7"/><path d="M11 8H7"/><path d="m18 16 2 2 4-4"/></svg>Rights Ownership and Clearence</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectWithLabel id="masterRightsOwner" label="Who owns the Master Rights?" value={data.masterRightsOwner} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'masterRightsOwner', value)} options={masterRightsOptions} />
                          <SelectWithLabel id="publishingRightsOwner" label="Who owns the Publishing Rights?" value={data.publishingRightsOwner} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'publishingRightsOwner', value)} options={publishingRightsOptions} />
                          <div className="md:col-span-2">
                            <SelectWithLabel id="isFullyClearedForSync" label="Is the Track fully cleared for sync use?" value={data.isFullyClearedForSync} disabled={isViewOnly} onValueChange={(value) => handleInputChange('sync', 'isFullyClearedForSync', value)} options={syncClearedOptions} />
                          </div>
                          <InputWithLabel id="proAffiliation" label="PRO affiliation (e.g. BMI, IPRS, ASCAP)" placeholder="Lorem ipsum" value={data.proAffiliation} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'proAffiliation', e.target.value)} />
                      </div>
                  </div>
                  
                  {/* Project Suitability Section */}
                  <div>
                    <Label className="text-base font-semibold">Project Suitability</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                        {Object.keys(initialSyncFormData.projectSuitability).map((key) => {
                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return <CheckboxWithLabel key={key} id={key} label={label} checked={data.projectSuitability[key]} disabled={isViewOnly} onCheckedChange={(checked) => handleCheckboxChange(key, checked)} />
                        })}
                    </div>
                  </div>

                   {/* Track Link Section */}
                  <div>
                    <InputWithLabel id="trackLinks" label="Track Link (Any Store) Please share the most streamed platform link." placeholder="Link" value={data.trackLinks} disabled={isViewOnly} onChange={(e) => handleInputChange('sync', 'trackLinks', e.target.value)} />
                  </div>
                  
                  {!isViewOnly && (
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => handleFormSubmit('sync')} disabled={isSubmitting} className="bg-[#711CE9] hover:bg-[#6f14ef] text-white w-full md:w-auto px-10">
                            Submit Ticket
                        </Button>
                    </div>
                  )}
              </CardContent>
          </Card>
        </div>
    )
  }

  const renderPlaylistPitchingForm = () => {
    const { data, isViewOnly } = viewState.playlistPitching;
    if (!data) return null;
    
    return (
        <div>
          <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="icon" onClick={() => handleBackToList('playlistPitching')}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isViewOnly ? 'View Playlist Pitch' : 'New Playlist Pitching Request'}</h1>
                <p className="text-muted-foreground">{isViewOnly ? 'Viewing the details for your playlist pitch.' : 'Fill in the details for your playlist pitch.'}</p>
              </div>
          </div>
          <Card>
              <CardContent className="p-8 space-y-8">
                  {/* Basic Information Section */}
                  <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputWithLabel id="trackName" label="Track Name" placeholder="Artist" value={data.trackName} disabled={isViewOnly} onChange={(e) => handleInputChange('playlistPitching', 'trackName', e.target.value)} />
                          <InputWithLabel id="artistName" label="Artist Name" placeholder="Name" value={data.artistName} disabled={isViewOnly} onChange={(e) => handleInputChange('playlistPitching', 'artistName', e.target.value)} />
                          <InputWithLabel id="labelName" label="Label name" placeholder="Label Name" value={data.labelName} disabled={isViewOnly} onChange={(e) => handleInputChange('playlistPitching', 'labelName', e.target.value)} />
                          <InputWithLabel id="isrc" label="ISRC of the Track" placeholder="9856674676476" value={data.isrc} disabled={isViewOnly} onChange={(e) => handleInputChange('playlistPitching', 'isrc', e.target.value)} />
                          <SelectWithLabel id="genres" label="Genres" value={data.genres} disabled={isViewOnly} onValueChange={(value) => handleInputChange('playlistPitching', 'genres', value)} options={genreOptions} />
                          <SelectWithLabel id="mood" label="Mood" value={data.mood} disabled={isViewOnly} onValueChange={(value) => handleInputChange('playlistPitching', 'mood', value)} options={moodOptions} />
                          <SelectWithLabel id="isVocalsPresent" label="Is Vocals Present?" value={data.isVocalsPresent} disabled={isViewOnly} onValueChange={(value) => handleInputChange('playlistPitching', 'isVocalsPresent', value)} options={vocalsPresentOptions} />
                          <SelectWithLabel id="language" label="Language" value={data.language} disabled={isViewOnly || !data.isVocalsPresent} onValueChange={(value) => handleInputChange('playlistPitching', 'language', value)} options={languageOptions} />
                          <SelectWithLabel id="theme" label="Theme" value={data.theme} disabled={isViewOnly} onValueChange={(value) => handleInputChange('playlistPitching', 'theme', value)} options={themeOptions} />
                          <SelectWithLabel id="selectedStore" label="Select Store" value={data.selectedStore} disabled={isViewOnly} onValueChange={(value) => handleInputChange('playlistPitching', 'selectedStore', value)} options={storeOptions} />
                          <div className="md:col-span-2">
                            {data.selectedStore === 'select_all' ? (
                              <div className="space-y-4">
                                {data.trackLinks.map((trackLink, index) => (
                                  <InputWithLabel 
                                    key={index}
                                    id={`trackLink-${index}`} 
                                    label={`Track Link for ${trackLink.platform}`} 
                                    placeholder={`Link for ${trackLink.platform}`} 
                                    value={trackLink.url} 
                                    disabled={isViewOnly} 
                                    onChange={(e) => handleTrackLinkChange(index, e.target.value)} 
                                  />
                                ))}
                              </div>
                            ) : (
                              <InputWithLabel id="trackLink" label="Track Link" placeholder="Link" value={data.trackLinks[0]?.url || ''} disabled={isViewOnly} onChange={(e) => handleTrackLinkChange(0, e.target.value)} />
                            )}
                          </div>
                      </div>
                  </div>
                  {!isViewOnly && (
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => handleFormSubmit('playlistPitching')} disabled={isSubmitting} className="bg-[#711CE9] hover:bg-[#6f14ef] text-white w-full md:w-auto px-10">
                            Submit Ticket
                        </Button>
                    </div>
                  )}
              </CardContent>
          </Card>
        </div>
    )
  }

  // --- MAIN RENDER ---
  
  if (viewState[activeTab].showForm) {
    return (
        <div className="min-h-screen bg-background text-foreground p-6">
           {activeTab === 'sync' ? renderSyncForm() : renderPlaylistPitchingForm()}
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Main Page Header */}
      <div>
        <h1 className="text-2xl font-bold">MV Marketing</h1>
        <p className="text-muted-foreground">Create and manage marketing campaigns for your music</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-lg bg-card w-full max-w-lg my-6">
          <button onClick={() => { setActiveTab('sync'); setCurrentPage(1); }} className={`px-4 py-1.5 w-full  text-sm font-medium rounded-md transition-colors ${activeTab === 'sync' ? 'bg-muted-foreground/20 text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}>
              Sync
          </button>
          <button onClick={() => { setActiveTab('playlistPitching'); setCurrentPage(1); }} className={`px-4 w-full py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'playlistPitching' ? 'bg-muted-foreground/20 text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}>
              Playlist Pitching
          </button>
      </div>

      {/* Tab-Specific Content */}
      <div>
        {/* Tab Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">{activeTab === 'sync' ? 'Sync Requests' : 'Playlist Pitching Requests'}</h2>
            <p className="text-muted-foreground text-sm">View, create, and manage your submissions below.</p>
          </div>
          <Button onClick={() => handleNewRequest(activeTab)} className="bg-[#711CE9] hover:bg-[#6f14ef] text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {activeTab === 'sync' ? 'New Sync Request' : 'New Playlist Pitch'}
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground border-b border-border">
                      <tr className="whitespace-nowrap">
                        <th className="p-4 font-medium">Track Name</th>
                        <th className="p-4 font-medium">Artist Name</th>
                        <th className="p-4 font-medium">Language</th>
                        <th className="p-4 font-medium">Genres</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Submit Date</th>
                        <th className="p-4 font-medium text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequests.map((request) => (
                        <tr key={request._id} className="border-b border-border last:border-b-0 hover:bg-muted/50 whitespace-nowrap">
                          <td className="p-4">{request.trackName}</td>
                          <td className="p-4">{request.artistName}</td>
                          <td className="p-4 capitalize">{request.language}</td>
                          <td className="p-4 capitalize">{request.genres.join(', ')}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 capitalize">
                              {request.status}
                            </span>
                          </td>
                          <td className="p-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <Button variant="outline" size="sm" onClick={() => handleView(activeTab, request)} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {currentRequests.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-12">
                            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No submissions found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {currentPagination && currentPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Showing {((currentPagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPagination.currentPage * itemsPerPage, currentPagination.totalCount)} of {currentPagination.totalCount} submissions
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === currentPagination.totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


// --- HELPER COMPONENTS ---

const InputWithLabel = ({ id, label, value, onChange, disabled, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} value={value} onChange={onChange} disabled={disabled} className="bg-background border-border" {...props} />
    </div>
);

const SelectWithLabel = ({ id, label, value, onValueChange, disabled, options }) => (
    <div className="space-y-2 ">
        <Label htmlFor={id}>{label}</Label>
        <Select  value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger id={id} className=" bg-background border-border">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => <SelectItem key={option.label} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);

const CheckboxWithLabel = ({ id, label, checked, onCheckedChange, disabled }) => (
    <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
    </div>
);