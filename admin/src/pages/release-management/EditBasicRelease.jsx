import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Music, Save, Loader2, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalApi from '@/lib/GlobalApi';
import { toast } from 'sonner';
import { uploadToImageKit } from '@/lib/imageUpload';
import { languageOptions, genreOptions, territoryOptions, partnerOptions } from '@/constants/options';

const labelNames = [
  "Maheshwari Vishual"
];

const EditBasicRelease = ({ theme }) => {
  const navigate = useNavigate();
  const { id: editReleaseId } = useParams();
  const [releaseType, setReleaseType] = useState('');
  const [releaseId, setReleaseId] = useState('');
  const [worldWideRelease, setWorldWideRelease] = useState('yes');
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectAllPartners, setSelectAllPartners] = useState(false);
  const [copyrightOption, setCopyrightOption] = useState(''); // 'proceed' or 'upload'
  const [isUploadingCoverArt, setIsUploadingCoverArt] = useState(false);
  const [uploadingTrackId, setUploadingTrackId] = useState(null);
  const [isUploadingCopyrightDoc, setIsUploadingCopyrightDoc] = useState(false);
  
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Form data state
  const [formData, setFormData] = useState({
    // Cover Art & Track Info
    coverArt: '',
    coverArtPreview: null,
    coverArtInfo: {
      size: null,
      format: null,
    },
    releaseName: '',
    genre: '',
    upc: '',
    labelName: '',
    
    // Audio & Track Details
    tracks: [{
      id: generateUniqueId(),
      trackLink: '',
      audioFileName: '',
      songName: '',
      genre: '',
      singerName: '',
      composerName: '',
      lyricistName: '',
      producerName: '',
      isrc: '',
      previewCallTiming: '',
      language: ''
    }],
    
    // Delivery Details
    forFutureRelease: '',
    forPreorderPreSave: '',
    worldWideRelease: 'yes',
    territories: [],
    partners: [],
    copyrightOption: '',
    copyrightDocument: ''
  });

  // Fetch release details for editing
  useEffect(() => {
    const fetchReleaseDetails = async () => {
        try {
            setIsLoadingDetails(true);
            const response = await GlobalApi.getReleaseDetails(editReleaseId);
            const data = response.data.data;
            
            if (data) {
                setReleaseId(data.releaseId);
                setReleaseType(data.trackType);
                
                // Map data to state
                setFormData(prev => ({
                    ...prev,
                    coverArt: data.step1?.coverArt?.imageUrl || '',
                    coverArtPreview: data.step1?.coverArt?.imageUrl || null,
                    coverArtInfo: {
                        size: data.step1?.coverArt?.imageSize || null,
                        format: data.step1?.coverArt?.imageFormat || null
                    },
                    releaseName: data.step1?.releaseInfo?.releaseName || '',
                    genre: data.step1?.releaseInfo?.genre || '',
                    upc: data.step1?.releaseInfo?.upc || '',
                    labelName: typeof data.step1?.releaseInfo?.labelName === 'object' ? data.step1.releaseInfo.labelName.name : (data.step1?.releaseInfo?.labelName || ''),
            
                    tracks: (data.step2?.tracks && data.step2.tracks.length > 0) ? data.step2.tracks.map(track => ({
                        id: generateUniqueId(),
                        trackLink: track.trackLink || track.fileUrl || track.audioFiles?.[0]?.fileUrl || '',
                        audioFileName: (track.trackLink || track.fileUrl || track.audioFiles?.[0]?.fileUrl) ? 'Existing Audio' : '', 
                        songName: track.trackName || '',
                        genre: track.genre || '',
                        singerName: track.singerName || '',
                        composerName: track.composerName || '',
                        lyricistName: track.lyricistName || '',
                        producerName: track.producerName || '',
                        isrc: track.isrc || '',
                        previewCallTiming: `${track.previewTiming?.startTime || 0}-${track.previewTiming?.endTime || 0}`,
                        language: track.language || ''
                    })) : [{
                        id: generateUniqueId(),
                        trackLink: '',
                        audioFileName: '',
                        songName: '',
                        genre: '',
                        singerName: '',
                        composerName: '',
                        lyricistName: '',
                        producerName: '',
                        isrc: '',
                        previewCallTiming: '',
                        language: ''
                    }],

                    forFutureRelease: data.step3?.releaseDate ? new Date(data.step3.releaseDate).toISOString().split('T')[0] : '',
                    // Mapping forPreorderPreSave if logical reverse is applicable, else typically mapped from releaseDate or API
                    forPreorderPreSave: data.step3?.releaseDate ? new Date(data.step3.releaseDate).toISOString().split('T')[0] : '', 
                    
                    worldWideRelease: data.step3?.territorialRights?.hasRights ? 'yes' : 'no',
                    territories: data.step3?.territorialRights?.territories || [],
                    partners: data.step3?.partnerSelection?.partners || [],
                    copyrightOption: data.step3?.copyrights?.ownsCopyright ? 'upload' : 'proceed',
                    copyrightDocument: data.step3?.copyrights?.copyrightDocuments?.[0]?.documentUrl || ''
                }));

                // Helper for loose comparison
                const normalize = (val) => val ? val.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, '').trim() : '';

                if (data.step3?.territorialRights?.hasRights) {
                    setWorldWideRelease('yes');
                    setSelectedTerritories([]);
                } else {
                    setWorldWideRelease('no');
                    const apiTerritories = data.step3?.territorialRights?.territories || [];
                    
                    // Match API territories to Options, being flexible with format
                    const normalizedApiTerritories = apiTerritories.map(t => normalize(t));
                    const matchedTerritories = territoryOptions.filter(option => {
                        const normOption = normalize(option);
                        return normalizedApiTerritories.includes(normOption) || apiTerritories.includes(option);
                    });
                    
                    setSelectedTerritories(matchedTerritories);
                }

                if (data.step3?.partnerSelection?.partners?.length > 0) {
                    const apiPartners = data.step3?.partnerSelection?.partners || [];
                    
                    // Match API partners to Options
                    const allPartnerOptions = [
                        ...partnerOptions.callerTunePartners, 
                        ...partnerOptions.indianStores, 
                        ...partnerOptions.internationalStores
                    ];
                    
                    const normalizedApiPartners = apiPartners.map(p => normalize(p));
                    const matchedPartners = allPartnerOptions.filter(option => {
                         const normOption = normalize(option);
                         return normalizedApiPartners.includes(normOption) || apiPartners.includes(option);
                    });

                    setSelectedPartners(matchedPartners);

                    // Check if all are selected (approximate)
                    if (matchedPartners.length >= allPartnerOptions.length - 5) { 
                        setSelectAllPartners(true);
                    }
                }
                
                if (data.step3?.copyrights?.ownsCopyright) {
                    setCopyrightOption('upload');
                } else {
                    setCopyrightOption('proceed');
                }
            }
        } catch (error) {
            console.error("Failed to fetch release details", error);
            toast.error("Failed to load release details");
        } finally {
            setIsLoadingDetails(false);
        }
    };

    if (editReleaseId) {
        fetchReleaseDetails();
    }
  }, [editReleaseId]);

  const handleSave = async () => {
    try {
        setIsSubmitting(true);
        // Construct payload
        const payload = {
            trackType: releaseType,
            step1: {
                coverArt: {
                    imageUrl: formData.coverArt,
                    imageSize: formData.coverArtInfo?.size,
                    imageFormat: formData.coverArtInfo?.format
                },
                releaseInfo: {
                    releaseName: formData.releaseName,
                    genre: formData.genre,
                    upc: formData.upc || undefined,
                    labelName: formData.labelName
                }
            },
            step2: {
                tracks: formData.tracks.map(track => {
                    const timings = track.previewCallTiming ? track.previewCallTiming.split('-') : [0, 0];
                    return {
                        trackLink: track.trackLink,
                        trackName: track.songName,
                        genre: track.genre,
                        singerName: track.singerName,
                        composerName: track.composerName,
                        lyricistName: track.lyricistName,
                        producerName: track.producerName,
                        isrc: track.isrc || undefined,
                        previewTiming: {
                            startTime: parseFloat(timings[0]) || 0,
                            endTime: parseFloat(timings[1]) || 0
                        },
                        language: track.language
                    };
                })
            },
            step3: {
                releaseDate: formData.forFutureRelease,
                territorialRights: {
                    hasRights: worldWideRelease === 'yes',
                    territories: worldWideRelease === 'yes' ? [] : selectedTerritories.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, ''))
                },
                partnerSelection: {
                    hasPartners: selectedPartners.length > 0,
                    partners: selectedPartners.map(p => p.toLowerCase().replace(/\s+/g, '_'))
                },
                copyrights: {
                    ownsCopyright: copyrightOption === 'upload',
                    copyrightDocuments: copyrightOption === 'upload' && formData.copyrightDocument ? [{ documentUrl: formData.copyrightDocument }] : []
                }
            }
        };

        await GlobalApi.editRelease(releaseId, payload);
        toast.success("Release updated successfully");
        navigate('/admin/release-management');
    } catch (error) {
        console.error("Failed to update release", error);
        toast.error(error.response?.data?.message || "Failed to update release");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleTerritoryChange = (territory, checked) => {
    setSelectedTerritories(prev => {
      const updated = checked ? [...prev, territory] : prev.filter(t => t !== territory);
      setFormData(prevData => ({ ...prevData, territories: updated }));
      return updated;
    });
  };

  const handlePartnerChange = (partner, checked) => {
    setSelectedPartners(prev => {
      const updated = checked ? [...prev, partner] : prev.filter(p => p !== partner);
      if (!checked) setSelectAllPartners(false);
      setFormData(prevData => ({ ...prevData, partners: updated }));
      return updated;
    });
  };

  const handleSelectAllPartners = (checked) => {
    setSelectAllPartners(checked);
    const allPartnerNames = [
      ...partnerOptions.callerTunePartners,
      ...partnerOptions.indianStores,
      ...partnerOptions.internationalStores
    ];
    if (checked) {
      setSelectedPartners(allPartnerNames);
      setFormData(prev => ({ ...prev, partners: allPartnerNames }));
    } else {
      setSelectedPartners([]);
      setFormData(prev => ({ ...prev, partners: [] }));
    }
  };

  const handleCoverArtUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Please select a JPG or PNG image file');
        return;
      }
      setIsUploadingCoverArt(true);
      try {
        const response = await uploadToImageKit(file, 'basic_release/cover_art');
        const url = response.url || response;
        setFormData(prev => ({ 
          ...prev, 
          coverArt: url, 
          coverArtPreview: url,
          coverArtInfo: { size: file.size, format: file.type.split('/')[1] }
        }));
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Upload failed");
      } finally {
        setIsUploadingCoverArt(false);
      }
    }
  };

  const handleAudioUpload = async (trackId, event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      setUploadingTrackId(trackId);
      try {
        const response = await uploadToImageKit(file, 'basic_release/tracks');
         const url = response.url || response;
        setFormData(prev => ({
          ...prev,
          tracks: prev.tracks.map(track =>
            track.id === trackId
              ? { ...track, trackLink: url, audioFileName: file.name }
              : track
          )
        }));
      } catch (error) {
        console.error("Audio upload failed", error);
         toast.error("Audio upload failed");
      } finally {
        setUploadingTrackId(null);
      }
    }
  };

  const handleCopyrightDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        // Accept basic docs
        setIsUploadingCopyrightDoc(true);
        try {
            const response = await uploadToImageKit(file, 'basic_release/copyright_docs');
             const url = response.url || response;
            setFormData(prev => ({ ...prev, copyrightDocument: url }));
        } catch(e) {
            toast.error("Upload failed");
        } finally {
            setIsUploadingCopyrightDoc(false);
        }
    }
  }

  const handleTrackFieldChange = (trackId, field, value) => {
    setFormData(prev => ({
        ...prev,
        tracks: prev.tracks.map(track =>
          track.id === trackId
            ? { ...track, [field]: value }
            : track
        )
    }));
  };

  const addTrack = () => {
    if (releaseType === 'single' && formData.tracks.length >= 1) {
      toast.error('Single release can only have one track');
      return;
    }
    const newTrack = {
      id: generateUniqueId(),
      trackLink: '',
      audioFileName: '',
      songName: '',
      genre: '',
      singerName: '',
      composerName: '',
      lyricistName: '',
      producerName: '',
      isrc: '',
      previewCallTiming: '',
      language: ''
    };
    setFormData(prev => ({
        ...prev,
        tracks: [...prev.tracks, newTrack]
    }));
  };

  const removeTrack = (trackId) => {
    setFormData(prev => {
        if (prev.tracks.length <= 1) return prev;
        return {
            ...prev,
            tracks: prev.tracks.filter(track => track.id !== trackId)
        }
    });
  };

  // Helper for explicit dark mode styles in portals
  const dropdownClass = theme === 'dark' 
    ? "bg-[#1e293b] text-white border-gray-700 max-h-[200px]" 
    : "bg-white text-black border-gray-200 max-h-[200px]";

  if (isLoadingDetails) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/release-management')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Basic Release</h1>
        </div>
        <Button onClick={handleSave} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
             {isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Step 1: Cover Art & Core Info */}
        <div className="space-y-4">
             <h2 className="text-xl font-semibold">Step 1: Release Info</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Card className="lg:col-span-1 p-4">
            <div className="bg-muted/50 rounded-lg">
                <h3 className="text-foreground text-lg font-medium mb-6">Cover Art</h3>
                <div className="flex flex-col items-center">
                <div className="w-full h-[250px] bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                    {isUploadingCoverArt && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                        <span className="text-white">Uploading...</span>
                    </div>
                    )}
                    {formData.coverArtPreview ? (
                    <img src={formData.coverArtPreview} alt="Cover preview" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                    <div className="text-center p-4"><Music className="w-8 h-8 mx-auto mb-2 opacity-50"/><p>3000x3000px, JPG/PNG</p></div>
                    )}
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={handleCoverArtUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingCoverArt} />
                </div>
                </div>
            </div>
            </Card>

            <Card className="lg:col-span-3 p-4">
             <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Release Name</Label>
                        <Input value={formData.releaseName} onChange={(e) => setFormData(prev => ({...prev, releaseName: e.target.value}))} />
                    </div>
                    <div>
                        <Label>Genre</Label>
                        <Select value={formData.genre} onValueChange={(val) => setFormData(prev => ({...prev, genre: val}))}>
                            <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                             <SelectContent className={dropdownClass}>
                                {genreOptions.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                             </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>UPC</Label>
                        <Input value={formData.upc} onChange={(e) => setFormData(prev => ({...prev, upc: e.target.value}))} />
                    </div>
                     <div>
                        <Label>Label Name</Label>
                        <Select value={formData.labelName} onValueChange={(val) => setFormData(prev => ({...prev, labelName: val}))}>
                            <SelectTrigger><SelectValue placeholder="Select Label" /></SelectTrigger>
                             <SelectContent className={dropdownClass}>
                                {labelNames.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                             </SelectContent>
                        </Select>
                    </div>
                </div>
             </div>
            </Card>
            </div>
        </div>

        {/* Step 2: Tracks */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Tracks</h2>
             {formData.tracks.map((track, index) => (
                <Card key={track.id} className="p-4 border-l-4 border-l-purple-500">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-medium">Track {index + 1}</h3>
                        {releaseType === 'album' && formData.tracks.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)}><X className="h-4 w-4"/></Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1">
                             <div className="bg-muted p-4 rounded-lg text-center relative">
                                <Label>Audio File</Label>
                                {track.audioFileName ? <p className="text-sm font-medium mt-2 truncate">{track.audioFileName}</p> : <p className="text-xs text-muted-foreground mt-2">No file selected</p>}
                                <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(track.id, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {uploadingTrackId === track.id && <div className="absolute inset-0 bg-background/80 flex items-center justify-center">Uploading...</div>}
                             </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                            <div><Label>Song Name</Label><Input value={track.songName} onChange={(e) => handleTrackFieldChange(track.id, 'songName', e.target.value)} /></div>
                            <div>
                                <Label>Genre</Label>
                                <Select value={track.genre} onValueChange={(val) => handleTrackFieldChange(track.id, 'genre', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent className={dropdownClass}>
                                            {genreOptions.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Language</Label>
                                <Select value={track.language} onValueChange={(val) => handleTrackFieldChange(track.id, 'language', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent className={dropdownClass}>
                                            {languageOptions.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Singer</Label><Input value={track.singerName} onChange={(e) => handleTrackFieldChange(track.id, 'singerName', e.target.value)} /></div>
                                <div><Label>Composer</Label><Input value={track.composerName} onChange={(e) => handleTrackFieldChange(track.id, 'composerName', e.target.value)} /></div>
                                <div><Label>Lyricist</Label><Input value={track.lyricistName} onChange={(e) => handleTrackFieldChange(track.id, 'lyricistName', e.target.value)} /></div>
                                <div><Label>Producer</Label><Input value={track.producerName} onChange={(e) => handleTrackFieldChange(track.id, 'producerName', e.target.value)} /></div>
                                <div><Label>ISRC</Label><Input value={track.isrc} onChange={(e) => handleTrackFieldChange(track.id, 'isrc', e.target.value)} /></div>
                                <div><Label>Preview (Start-End)</Label><Input placeholder="0:30-1:00" value={track.previewCallTiming} onChange={(e) => handleTrackFieldChange(track.id, 'previewCallTiming', e.target.value)} /></div>
                        </div>
                    </div>
                </Card>
             ))}
             {releaseType === 'album' && (
                <Button variant="outline" onClick={addTrack} className="w-full"><Plus className="mr-2 h-4 w-4"/> Add Track</Button>
             )}
        </div>

        {/* Step 3: Distribution */}
         <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 3: Distribution & Rights</h2>
             <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Release Date</Label>
                        <Input type="date" value={formData.forFutureRelease} onChange={(e) => setFormData(prev => ({...prev, forFutureRelease: e.target.value}))} 
                        className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0"/>
                    </div>
                     <div>
                        <Label>For Preorder/Pre-save release</Label>
                        <Input type="date" value={formData.forPreorderPreSave} onChange={(e) => setFormData(prev => ({...prev, forPreorderPreSave: e.target.value}))}
                        className="[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0"/>
                    </div>
                </div>

                <div className="mt-6">
                 <h4 className="text-foreground font-medium mb-4">Territory Rights :</h4>
                 <div className="space-y-4">
                    <div>
                    <Label className="text-foreground font-medium">World Wide Release</Label>
                    <RadioGroup 
                        value={worldWideRelease} 
                        onValueChange={(value) => {
                        setWorldWideRelease(value);
                        setFormData(prev => ({...prev, worldWideRelease: value}));
                        }}
                        className="flex space-x-6 mt-2"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                        </div>
                    </RadioGroup>
                    </div>

                    {worldWideRelease === 'no' && (
                    <Card className="p-6 border border-muted bg-background rounded-lg">
                        <Label className="text-foreground">Select The Territories, Where you own the rights</Label>
                        <div className="grid grid-cols-3 gap-4 mt-4 max-h-60 overflow-y-auto custom-scroll">
                        {territoryOptions.map((territory) => (
                            <div key={territory} className="flex items-center space-x-2">
                            <Checkbox 
                                id={territory}
                                checked={selectedTerritories.includes(territory)}
                                onCheckedChange={(checked) => handleTerritoryChange(territory, checked)}
                            />
                            <Label htmlFor={territory} className="text-sm">{territory}</Label>
                            </div>
                        ))}
                        </div>
                    </Card>
                    )}
                 </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-foreground font-medium mb-4">Partner Selection :</h4>
                    {/* Select All */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                        id="selectAll"
                        checked={selectAllPartners}
                        onCheckedChange={handleSelectAllPartners}
                        />
                        <Label htmlFor="selectAll" className="font-medium">Select All Partners</Label>
                    </div>

                    {/* Render Each Category */}
                    {Object.entries(partnerOptions).map(([category, list]) => (
                        <Card key={category} className="p-6 border border-muted bg-background rounded-lg mb-6">
                        <Label className="text-primary font-medium">
                            {category === "callerTunePartners" && "CallerTune Partners"}
                            {category === "indianStores" && "Indian Stores"}
                            {category === "internationalStores" && "International Stores"}
                        </Label>

                        <div className="grid grid-cols-3 max-h-60 overflow-y-auto custom-scroll gap-4 mt-4">
                            {list.map((partner) => (
                            <div key={partner} className="flex items-center space-x-2">
                                <Checkbox
                                id={partner}
                                checked={selectedPartners.includes(partner)}
                                onCheckedChange={(checked) => handlePartnerChange(partner, checked)}
                                />
                                <Label htmlFor={partner} className="text-sm">{partner}</Label>
                            </div>
                            ))}
                        </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 space-y-4">
                    <h4 className="text-foreground font-medium mb-4">Copyright Options :</h4>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="proceedWithout"
                            checked={copyrightOption === 'proceed'}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setCopyrightOption('proceed');
                                    setFormData(prev => ({...prev, copyrightOption: 'proceed'}));
                                } else if (copyrightOption === 'proceed') {
                                    setCopyrightOption('');
                                    setFormData(prev => ({...prev, copyrightOption: ''}));
                                }
                            }}
                        />
                        <Label htmlFor="proceedWithout">Proceed without Uploading the Copyright Documents</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="ownCopyright"
                            checked={copyrightOption === 'upload'}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setCopyrightOption('upload');
                                    setFormData(prev => ({...prev, copyrightOption: 'upload'}));
                                } else if (copyrightOption === 'upload') {
                                    setCopyrightOption('');
                                    setFormData(prev => ({...prev, copyrightOption: ''}));
                                }
                            }}
                        />
                        <Label htmlFor="ownCopyright">I own the Copyrights Will Upload</Label>
                        </div>
                    </div>

                    {copyrightOption === 'upload' && (
                        <div className="ml-6 mt-4">
                        <Label className="text-foreground">Upload Copyright Document</Label>
                        <div className="flex items-center space-x-2 mt-2 relative">
                            <Input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            onChange={handleCopyrightDocumentUpload}
                            disabled={isUploadingCopyrightDoc}
                            id="copyright-doc-input"
                            />
                            <div className="flex-1 p-2 border rounded-md bg-background text-sm text-muted-foreground h-10 flex items-center truncate">
                            {formData.copyrightDocument 
                                ? new URL(formData.copyrightDocument).pathname.split('/').pop() 
                                : 'No file selected'
                            }
                            </div>
                            <Button variant="outline" size="sm" onClick={() => document.getElementById('copyright-doc-input').click()} disabled={isUploadingCopyrightDoc}>
                            {isUploadingCopyrightDoc ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="w-4 h-4" />}
                            <span className="ml-2">{isUploadingCopyrightDoc ? 'Uploading...' : 'Upload'}</span>
                            </Button>
                        </div>
                        </div>
                    )}
                </div>

             </Card>
         </div>

      </div>
    </div>
  );
};

export default EditBasicRelease;
