import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Music, Upload, Trash2, Loader2, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import GlobalApi from '@/lib/GlobalApi';
import { uploadToImageKit } from '@/lib/imageUpload';
import { genreOptions, territoryOptions, partnerOptions, languageOptions } from '@/constants/options';

const releaseTypes = [
  { value: "single", label: "Single" },
  { value: "album", label: "Album" },
  { value: "ep", label: "EP" },
  { value: "minialbum", label: "Mini Album" },
  { value: "ringtonerelease", label: "Ringtone Release" }
];

const soundRecordingProfessions = [
    "Actor", "Brand", "Choir", "Conductor", "Ensemble", "Mixer", 
    "Orchestra", "Musician", "Producer", "Programmer", "Remixer", 
    "Soloist", "Studio Personnel"
  ];
  
const musicalWorkRoles = [
    "Arranger", "Composer", "Librettist", "Lyricist", 
    "Publisher", "Non-Lyric Author", "Translator"
];

const EditAdvancedRelease = ({ theme }) => {

  const navigate = useNavigate();
  const { id: editReleaseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReleaseType, setSelectedReleaseType] = useState('');
  const [worldWideRelease, setWorldWideRelease] = useState('yes');
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectAllPartners, setSelectAllPartners] = useState(false);
  const [copyrightOption, setCopyrightOption] = useState('');
  const [isUploadingCoverArt, setIsUploadingCoverArt] = useState(false);
  const [uploadingTrackId, setUploadingTrackId] = useState(null);
  const [isUploadingCopyrightDoc, setIsUploadingCopyrightDoc] = useState(false);
  const [labelId, setLabelId] = useState(null);

  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const [formData, setFormData] = useState({
    coverArt: '',
    coverArtPreview: null,
    coverArtInfo: {
      size: null,
      format: null,
    },
    releaseName: '',
    releaseVersion: '',
    catalogNumber: '',
    releaseType: '',
    primaryArtists: [{ id: generateUniqueId(), value: '' }],
    featuringArtists: [{ id: generateUniqueId(), value: '' }],
    variousArtist: false,
    variousArtistNames: [{ id: generateUniqueId(), value: '' }],
    needUPC: 'yes',
    upc: '',
    labelName: '',
    cLine: '',
    cLineYear: '',
    pLine: '',
    pLineYear: '',
    releasePricingTier: '',
    
    tracks: [{
      id: generateUniqueId(),
      trackLink: '',
      audioFileName: '',
      trackName: '',
      mixVersion: '',
      primaryArtists: [{ id: generateUniqueId(), value: '' }],
      featuringArtists: [{ id: generateUniqueId(), value: '' }],
      contributorsToSound: [{ id: generateUniqueId(), profession: '', contributors: '' }],
      contributorsToMusical: [{ id: generateUniqueId(), profession: '', contributors: '' }],
      needISRC: 'yes',
      isrc: '',
      primaryGenre: '',
      secondaryGenre: '',
      explicitStatus: '',
      hasHumanVocals: 'no',
      language: '',
      isAvailableForDownload: 'no',
      previewStartTiming: ''
    }],
    
    forFutureRelease: '',
    forPreorderPreSave: '',
    worldWideRelease: 'yes',
    territories: [],
    partners: [],
    copyrightOption: '',
    copyrightDocument: ''
  });

  useEffect(() => {
    fetchReleaseDetails();
  }, [editReleaseId]);

  const fetchReleaseDetails = async () => {
    try {
      setLoading(true);
      const res = await GlobalApi.getAdvancedReleaseById(editReleaseId);
      const data = res.data.data.release;
      
      if (data) {
        setSelectedReleaseType(data.releaseType);
        
        const mapArrayToObjects = (arr) => arr && arr.length > 0 
            ? arr.map(val => ({ id: generateUniqueId(), value: val })) 
            : [{ id: generateUniqueId(), value: '' }];

        if (typeof data.step1?.releaseInfo?.labelName === 'object' && data.step1.releaseInfo.labelName?._id) {
            setLabelId(data.step1.releaseInfo.labelName._id);
        }

        setFormData(prev => ({
            ...prev,
            releaseType: data.releaseType,
            coverArt: data.step1?.coverArt?.imageUrl || '',
            coverArtPreview: data.step1?.coverArt?.imageUrl || null,
            coverArtInfo: {
                size: data.step1?.coverArt?.imageSize || null,
                format: data.step1?.coverArt?.imageFormat || null
            },
            releaseName: data.step1?.releaseInfo?.releaseName || '',
            releaseVersion: data.step1?.releaseInfo?.releaseVersion || '',
            catalogNumber: data.step1?.releaseInfo?.catalogNumber || '',
            primaryArtists: mapArrayToObjects(data.step1?.releaseInfo?.primaryArtists),
            featuringArtists: mapArrayToObjects(data.step1?.releaseInfo?.featuringArtists),
            variousArtist: data.step1?.releaseInfo?.variousArtist || false,
            variousArtistNames: mapArrayToObjects(data.step1?.releaseInfo?.variousArtistNames),
            needUPC: data.step1?.releaseInfo?.upc ? 'no' : 'yes',
            upc: data.step1?.releaseInfo?.upc || '',
            labelName: typeof data.step1?.releaseInfo?.labelName === 'object' ? (data.step1.releaseInfo.labelName?.name || '') : (data.step1?.releaseInfo?.labelName || ''),
            primaryGenre: data.step1?.releaseInfo?.primaryGenre || '',
            secondaryGenre: data.step1?.releaseInfo?.secondaryGenre || '',
            cLine: data.step1?.releaseInfo?.cLine?.text || '',
            cLineYear: data.step1?.releaseInfo?.cLine?.year?.toString() || '',
            pLine: data.step1?.releaseInfo?.pLine?.text || '',
            pLineYear: data.step1?.releaseInfo?.pLine?.year?.toString() || '',
            releasePricingTier: data.step1?.releaseInfo?.releasePricingTier || '',

            tracks: (data.step2?.tracks && data.step2.tracks.length > 0) ? data.step2.tracks.map(track => ({
                id: generateUniqueId(),
                trackLink: track.trackLink || track.fileUrl || track.audioFiles?.[0]?.fileUrl || '',
                audioFileName: (track.trackLink || track.fileUrl || track.audioFiles?.[0]?.fileUrl) ? 'Existing Audio' : '',
                trackName: track.trackName || '',
                mixVersion: track.mixVersion || '',
                primaryArtists: mapArrayToObjects(track.primaryArtists),
                featuringArtists: mapArrayToObjects(track.featuringArtists),
                contributorsToSound: (track.contributorsToSoundRecording || track.contributorsToSound)?.map(c => ({
                    id: generateUniqueId(),
                    profession: c.profession || '',
                    contributors: Array.isArray(c.contributors) ? c.contributors.join(', ') : (c.contributors || '')
                })) || [{ id: generateUniqueId(), profession: '', contributors: '' }],
                contributorsToMusical: (track.contributorsToMusicalWork || track.contributorsToMusical)?.map(c => ({
                    id: generateUniqueId(),
                    profession: c.profession || '',
                    contributors: Array.isArray(c.contributors) ? c.contributors.join(', ') : (c.contributors || '')
                })) || [{ id: generateUniqueId(), profession: '', contributors: '' }],
                needISRC: track.isrc ? 'no' : 'yes',
                isrc: track.isrc || '',
                primaryGenre: track.primaryGenre || '',
                secondaryGenre: track.secondaryGenre || '',
                explicitStatus: track.explicitStatus || '',
                hasHumanVocals: track.hasHumanVocals ? 'yes' : 'no',
                language: track.language || '',
                isAvailableForDownload: track.isAvailableForDownload ? 'yes' : 'no',
                previewStartTiming: track.previewTiming?.startTime || ''
            })) : [{
                id: generateUniqueId(),
                trackLink: '',
                audioFileName: '',
                trackName: '',
                mixVersion: '',
                primaryArtists: [{ id: generateUniqueId(), value: '' }],
                featuringArtists: [{ id: generateUniqueId(), value: '' }],
                contributorsToSound: [{ id: generateUniqueId(), profession: '', contributors: '' }],
                contributorsToMusical: [{ id: generateUniqueId(), profession: '', contributors: '' }],
                needISRC: 'yes',
                isrc: '',
                primaryGenre: '',
                secondaryGenre: '',
                explicitStatus: '',
                hasHumanVocals: 'no',
                language: '',
                isAvailableForDownload: 'no',
                previewStartTiming: ''
            }],

            forFutureRelease: data.step3?.deliveryDetails?.forFutureRelease ? new Date(data.step3.deliveryDetails.forFutureRelease).toISOString().split('T')[0] : '',
            forPreorderPreSave: data.step3?.deliveryDetails?.forPastRelease ? new Date(data.step3.deliveryDetails.forPastRelease).toISOString().split('T')[0] : '',
            worldWideRelease: data.step3?.territorialRights?.isWorldwide ? 'yes' : 'no',
            territories: data.step3?.territorialRights?.territories || [],
            partners: data.step3?.distributionPartners || [],
            copyrightOption: data.step3?.copyrightOptions?.ownsCopyrights ? 'upload' : 'proceed',
            copyrightDocument: data.step3?.copyrightOptions?.copyrightDocumentLink || ''
        }));

        // Helper for loose comparison
        const normalize = (val) => val ? val.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, '').trim() : '';

        if (data.step3?.territorialRights?.isWorldwide) {
            setWorldWideRelease('yes');
            setSelectedTerritories([]);
        } else {
            setWorldWideRelease('no');
            const apiTerritories = data.step3?.territorialRights?.territories || [];
            
            const normalizedApiTerritories = apiTerritories.map(t => normalize(t));
            const matchedTerritories = territoryOptions.filter(option => {
                const normOption = normalize(option);
                return normalizedApiTerritories.includes(normOption) || apiTerritories.includes(option);
            });
            
            setSelectedTerritories(matchedTerritories);
        }

        if (data.step3?.distributionPartners?.length > 0) {
            const apiPartners = data.step3?.distributionPartners || [];
            
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

            if (matchedPartners.length >= allPartnerOptions.length - 5) { 
                setSelectAllPartners(true);
            }
        }
        
        if (data.step3?.copyrightOptions?.ownsCopyrights) {
            setCopyrightOption('upload');
        } else {
            setCopyrightOption('proceed');
        }

      }
    } catch (error) {
      toast.error('Failed to fetch release details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
        setSubmitting(true);
        
        const payload = {
            step1: {
                coverArt: {
                    imageUrl: formData.coverArt,
                    imageSize: formData.coverArtInfo.size,
                    imageFormat: formData.coverArtInfo.format
                },
                releaseInfo: {
                    releaseName: formData.releaseName,
                    releaseVersion: formData.releaseVersion,
                    catalog: formData.catalogNumber,
                    releaseType: formData.releaseType,
                    primaryArtists: formData.primaryArtists.map(a => a.value).filter(Boolean),
                    featuringArtists: formData.featuringArtists.map(a => a.value).filter(Boolean),
                    variousArtists: formData.variousArtist, 
                    variousArtistNames: formData.variousArtist ? formData.variousArtistNames.map(a => a.value).filter(Boolean) : [],
                    needsUPC: formData.needUPC === 'yes',
                    upcCode: formData.needUPC === 'no' ? formData.upc : undefined,
                    primaryGenre: formData.primaryGenre,
                    secondaryGenre: formData.secondaryGenre || undefined,
                    labelName: labelId || formData.labelName, 
                    cLine: { text: formData.cLine, year: formData.cLineYear },
                    pLine: { text: formData.pLine, year: formData.pLineYear },
                    releasePricingTier: formData.releasePricingTier
                }
            },
            step2: {
                tracks: formData.tracks.map(track => ({
                    trackLink: track.trackLink,
                    trackName: track.trackName,
                    mixVersion: track.mixVersion,
                    primaryArtists: track.primaryArtists.map(a => a.value).filter(Boolean),
                    featuringArtists: track.featuringArtists.map(a => a.value).filter(Boolean),
                    contributorsToSoundRecording: track.contributorsToSound.map(c => ({
                        profession: c.profession,
                        contributors: c.contributors // Send as string, no split
                    })),
                    contributorsToMusicalWork: track.contributorsToMusical.map(c => ({
                        profession: c.profession,
                        contributors: c.contributors // Send as string, no split
                    })),
                    needISRC: track.needISRC === 'yes',
                    isrc: track.needISRC === 'no' ? track.isrc : undefined,
                    primaryGenre: track.primaryGenre,
                    secondaryGenre: track.secondaryGenre || undefined,
                    explicitStatus: track.explicitStatus,
                    hasHumanVocals: track.hasHumanVocals === 'yes',
                    language: track.language || undefined,
                    isAvailableForDownload: track.isAvailableForDownload === 'yes',
                    previewTiming: { startTime: track.previewStartTiming }
                }))
            },
            step3: {
                deliveryDetails: {
                    forFutureRelease: formData.forFutureRelease || null,
                    forPastRelease: formData.forPreorderPreSave || null
                },
                territorialRights: {
                    isWorldwide: worldWideRelease === 'yes',
                    territories: worldWideRelease === 'yes' ? [] : selectedTerritories.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, ''))
                },
                distributionPartners: selectedPartners.map(p => p.toLowerCase().replace(/\s+/g, '_')), 
                copyrightOptions: {
                    proceedWithoutCopyright: copyrightOption === 'proceed',
                    copyrightDocumentLink: formData.copyrightDocument,
                    ownsCopyrights: copyrightOption === 'upload'
                }
            }
        };

        await GlobalApi.editAdvancedRelease(editReleaseId, payload);
        toast.success("Release updated successfully");
        navigate('/admin/release-management');
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update release");
        console.error(error);
    } finally {
        setSubmitting(false);
    }
  };

  const addDynamicField = (section, trackId = null) => {
    setFormData(prev => {
      if (trackId) {
        const updatedTracks = prev.tracks.map(track => {
          if (track.id === trackId) {
            let newItem;
            if (section === 'contributorsToSound' || section === 'contributorsToMusical') {
              newItem = { id: generateUniqueId(), profession: '', contributors: '' };
            } else {
              newItem = { id: generateUniqueId(), value: '' };
            }
            return {
              ...track,
              [section]: [...track[section], newItem]
            };
          }
          return track;
        });
        return { ...prev, tracks: updatedTracks };
      } else {
        return {
          ...prev,
          [section]: [...prev[section], { id: generateUniqueId(), value: '' }]
        };
      }
    });
  };

  const removeDynamicField = (section, fieldId, trackId = null) => {
    setFormData(prev => {
      if (trackId) {
        const updatedTracks = prev.tracks.map(track => {
          if (track.id === trackId && track[section].length > 1) {
            return {
              ...track,
              [section]: track[section].filter(item => item.id !== fieldId)
            };
          }
          return track;
        });
        return { ...prev, tracks: updatedTracks };
      } else {
        if (prev[section].length > 1) {
          return {
            ...prev,
            [section]: prev[section].filter(item => item.id !== fieldId)
          };
        }
        return prev;
      }
    });
  };

  const updateDynamicField = (section, fieldId, value, trackId = null, fieldName = 'value') => {
    setFormData(prev => {
      if (trackId) {
        const updatedTracks = prev.tracks.map(track => {
            if (track.id === trackId) {
                return {
                    ...track,
                    [section]: track[section].map(item =>
                        item.id === fieldId ? { ...item, [fieldName]: value } : item
                    )
                };
            }
            return track;
        });
        return { ...prev, tracks: updatedTracks };
      } else {
        return {
          ...prev,
          [section]: prev[section].map(item =>
            item.id === fieldId ? { ...item, [fieldName]: value } : item
          )
        };
      }
    });
  };

  const handleAudioUpload = async (trackId, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadingTrackId(trackId);
      try {
        const response = await uploadToImageKit(file, 'advanced_release/tracks');
        const url = response.url || response;
        setFormData(prev => ({
          ...prev,
          tracks: prev.tracks.map(track =>
            track.id === trackId ? { ...track, trackLink: url, audioFileName: file.name } : track
          )
        }));
      } catch (error) {
        console.error("Audio upload failed for track:", trackId, error);
      } finally {
        setUploadingTrackId(null);
      }
    }
  };

  const handleTrackFieldChange = (trackId, field, value) => {
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId ? { ...track, [field]: value } : track
      )
    }));
  };

  const addTrack = () => {
    if ((selectedReleaseType === 'single' || selectedReleaseType === 'ringtonerelease') && formData.tracks.length >= 1) {
      toast.error('Single and Ringtone releases can only have one track');
      return;
    }
    const newTrack = {
      id: generateUniqueId(),
      trackLink: '',
      audioFileName: '',
      trackName: '',
      mixVersion: '',
      primaryArtists: [{ id: generateUniqueId(), value: '' }],
      featuringArtists: [{ id: generateUniqueId(), value: '' }],
      contributorsToSound: [{ id: generateUniqueId(), profession: '', contributors: '' }],
      contributorsToMusical: [{ id: generateUniqueId(), profession: '', contributors: '' }],
      needISRC: 'yes',
      isrc: '',
      primaryGenre: '',
      secondaryGenre: '',
      explicitStatus: '',
      hasHumanVocals: 'no',
      language: '',
      isAvailableForDownload: 'no',
      previewStartTiming: ''
    };
    setFormData(prev => ({ ...prev, tracks: [...prev.tracks, newTrack] }));
  };

  const removeTrack = (trackId) => {
    setFormData(prev => {
      if (prev.tracks.length > 1) {
        return { ...prev, tracks: prev.tracks.filter(track => track.id !== trackId) };
      }
      return prev;
    });
  };

  const handleTerritoryChange = (territory, checked) => {
    setSelectedTerritories(prev => {
      const updated = checked ? [...prev, territory] : prev.filter(t => t !== territory);
      return updated;
    });
  };

  const handlePartnerChange = (partner, checked) => {
    setSelectedPartners(prev => {
      const updated = checked ? [...prev, partner] : prev.filter(p => p !== partner);
      if (!checked) setSelectAllPartners(false);
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
    } else {
      setSelectedPartners([]);
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
        const response = await uploadToImageKit(file, 'advanced_release/cover_art');
        const url = response.url || response;
        setFormData(prev => ({
          ...prev,
          coverArt: url,
          coverArtPreview: url,
          coverArtInfo: { size: file.size, format: file.type.split('/')[1] }
        }));
      } catch (e) {
        console.error(e);
      } finally {
        setIsUploadingCoverArt(false);
      }
    }
  };

  const handleCopyrightDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        setIsUploadingCopyrightDoc(true);
        try {
            const response = await uploadToImageKit(file, 'advanced_release/copyright_docs');
            const url = response.url || response;
            setFormData(prev => ({ ...prev, copyrightDocument: url }));
        } catch(e) {
            toast.error("Upload failed");
        } finally {
            setIsUploadingCopyrightDoc(false);
        }
    }
  }

  // Dropdown style helper
  const dropdownClass = theme === 'dark' 
    ? "bg-[#1e293b] text-white border-gray-700 max-h-[200px]" 
    : "bg-white text-black border-gray-200 max-h-[200px]";

  if (loading) {
      return <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/release-management')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Advanced Release</h1>
        </div>
        <Button onClick={handleUpdate} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Update Release
        </Button>
      </div>

      <div className="space-y-8 pb-20">
        
        {/* Step 1: Cover Art & Release Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Cover Art Section */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <div className="flex flex-col gap-3">
                <h3 className="text-foreground text-lg font-medium">Cover Art</h3>
                <div className="w-full aspect-square bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group hover:bg-muted/50 transition-colors">
                    {isUploadingCoverArt && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-xs mt-2 font-medium">Uploading...</span>
                        </div>
                    )}
                    {formData.coverArtPreview ? (
                        <img src={formData.coverArtPreview} alt="Cover preview" className="absolute inset-0 z-10 w-full h-full object-contain bg-background" />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center z-10">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Music className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Upload Cover Art</p>
                            <p className="text-xs text-muted-foreground mt-1">3000x3000px, JPG/PNG</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleCoverArtUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                        disabled={isUploadingCoverArt}
                    />
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('cover-art-upload').click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Cover Art
                </Button>
                <input 
                    id="cover-art-upload"
                    type="file" 
                    accept=".jpg,.jpeg,.png" 
                    onChange={handleCoverArtUpload} 
                    className="hidden" 
                />
              </div>
            </Card>

            {/* Release Info Form */}
            <Card className="lg:col-span-3 p-6">
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">Release Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Release Name</Label>
                        <Input value={formData.releaseName} onChange={e => setFormData(p => ({...p, releaseName: e.target.value}))} className="mt-2" />
                    </div>
                    <div>
                        <Label>Release Version</Label>
                        <Input value={formData.releaseVersion} onChange={e => setFormData(p => ({...p, releaseVersion: e.target.value}))} className="mt-2" />
                    </div>
                    <div>
                        <Label>Catalog Number</Label>
                        <Input value={formData.catalogNumber} onChange={e => setFormData(p => ({...p, catalogNumber: e.target.value}))} className="mt-2" />
                    </div>
                    <div>
                        <Label>Release Type</Label>
                        <Select value={formData.releaseType} disabled>
                            <SelectTrigger className="mt-2 text-muted-foreground">
                                <SelectValue>{releaseTypes.find(t => t.value === formData.releaseType)?.label}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className={dropdownClass}>
                                    {releaseTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 space-y-4">
                            <div>
                            <Label>Primary Artists</Label>
                            {formData.primaryArtists.map((artist, idx) => (
                                <div key={artist.id} className="flex gap-2 mt-2">
                                    <Input value={artist.value} onChange={e => updateDynamicField('primaryArtists', artist.id, e.target.value)} />
                                    <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('primaryArtists') : removeDynamicField('primaryArtists', artist.id)}>
                                        {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                    </Button>
                                </div>
                            ))}
                            </div>
                            <div>
                            <Label>Featuring Artists</Label>
                            {formData.featuringArtists.map((artist, idx) => (
                                <div key={artist.id} className="flex gap-2 mt-2">
                                    <Input value={artist.value} onChange={e => updateDynamicField('featuringArtists', artist.id, e.target.value)} />
                                    <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('featuringArtists') : removeDynamicField('featuringArtists', artist.id)}>
                                        {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                    </Button>
                                </div>
                            ))}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                            <Checkbox id="variousArtist" checked={formData.variousArtist} onCheckedChange={(checked) => setFormData(prev => ({...prev, variousArtist: checked}))} />
                            <Label htmlFor="variousArtist" className="text-sm">Various Artist</Label>
                            </div>
                            {formData.variousArtist && (
                            <div className="space-y-2">
                                <Label>Various Artist Names</Label>
                                {formData.variousArtistNames.map((artist, idx) => (
                                    <div key={artist.id} className="flex gap-2">
                                        <Input value={artist.value} onChange={e => updateDynamicField('variousArtistNames', artist.id, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('variousArtistNames') : removeDynamicField('variousArtistNames', artist.id)}>
                                            {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            )}
                            
                            <div className="my-4">
                            <Label>Do you need a UPC for this release?</Label>
                            <RadioGroup value={formData.needUPC} onValueChange={(val) => setFormData(prev => ({...prev, needUPC: val}))} className="flex space-x-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="upcYes"/><Label htmlFor="upcYes">Yes</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="upcNo"/><Label htmlFor="upcNo">No</Label></div>
                            </RadioGroup>
                            {formData.needUPC === 'no' && (
                                    <Input className="mt-2" placeholder="Enter UPC" value={formData.upc} onChange={(e) => setFormData(prev => ({...prev, upc: e.target.value}))} />
                            )}
                            </div>
                    </div>

                    <div>
                        <Label>Primary Genre</Label>
                        <Select value={formData.primaryGenre} onValueChange={v => setFormData(p => ({...p, primaryGenre: v}))}>
                            <SelectTrigger className="mt-2"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                            <SelectContent className={dropdownClass}>{genreOptions.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Secondary Genre</Label>
                        <Select value={formData.secondaryGenre} onValueChange={v => setFormData(p => ({...p, secondaryGenre: v}))}>
                            <SelectTrigger className="mt-2"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                            <SelectContent className={dropdownClass}>{genreOptions.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Label Name</Label>
                        <Input value={formData.labelName} onChange={e => setFormData(p => ({...p, labelName: e.target.value}))} className="mt-2" placeholder="Label Name" />
                    </div>
                    <div>
                        <Label>Rights</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input placeholder="C Line Year" value={formData.cLineYear} onChange={e => setFormData(p => ({...p, cLineYear: e.target.value}))} />
                            <Input placeholder="C Line Text" value={formData.cLine} onChange={e => setFormData(p => ({...p, cLine: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input placeholder="P Line Year" value={formData.pLineYear} onChange={e => setFormData(p => ({...p, pLineYear: e.target.value}))} />
                            <Input placeholder="P Line Text" value={formData.pLine} onChange={e => setFormData(p => ({...p, pLine: e.target.value}))} />
                        </div>
                    </div>

                </div>
            </Card>
        </div>

        {/* Step 2: Tracks Section - FULL WIDTH */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tracks</h3>
                <Button onClick={addTrack} size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Track</Button>
            </div>
            
            {formData.tracks.map((track, trackIndex) => (
                <Card key={track.id} className="p-6 relative border-l-4 border-l-purple-500">
                    {formData.tracks.length > 1 && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-destructive"
                            onClick={() => removeTrack(track.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <h4 className="font-medium mb-4">Track {trackIndex + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Left: Audio Upload */}
                        <div className="col-span-1 flex flex-col gap-3">
                            <div className="w-full aspect-square bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group hover:bg-muted/50 transition-colors">
                                {uploadingTrackId === track.id && (
                                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <span className="text-xs mt-2 font-medium">Uploading...</span>
                                    </div>
                                )}
                                
                                <div className="flex flex-col items-center justify-center p-4 text-center z-10 w-full">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                        <Music className="h-6 w-6 text-primary" />
                                    </div>
                                    {track.audioFileName ? (
                                        <div className="max-w-full px-2">
                                            <p className="text-sm font-semibold truncate text-foreground">{track.audioFileName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Ready to distribute</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Upload Track</p>
                                            <p className="text-xs text-muted-foreground mt-1">WAV or MP3</p>
                                        </div>
                                    )}
                                </div>

                                <input 
                                    type="file" 
                                    accept="audio/*" 
                                    onChange={(e) => handleAudioUpload(track.id, e)} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                                    disabled={uploadingTrackId === track.id}
                                />
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => document.getElementById(`audio-upload-${track.id}`).click()}>
                                <Upload className="mr-2 h-4 w-4" /> Upload Track
                            </Button>
                            <input 
                                id={`audio-upload-${track.id}`}
                                type="file" 
                                accept="audio/*" 
                                onChange={(e) => handleAudioUpload(track.id, e)} 
                                className="hidden" 
                            />
                        </div>

                        {/* Right: Form Fields */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">
                            <div>
                                <Label>Track Name</Label>
                                <Input 
                                    value={track.trackName} 
                                    onChange={e => handleTrackFieldChange(track.id, 'trackName', e.target.value)}
                                    className="mt-2" 
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label>Primary Artists</Label>
                                    {track.primaryArtists.map((artist, idx) => (
                                        <div key={artist.id} className="flex gap-2 mt-2">
                                            <Input value={artist.value} onChange={e => updateDynamicField('primaryArtists', artist.id, e.target.value, track.id)} />
                                            <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('primaryArtists', track.id) : removeDynamicField('primaryArtists', artist.id, track.id)}>
                                                {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Label>Featuring Artists</Label>
                                    {track.featuringArtists.map((artist, idx) => (
                                        <div key={artist.id} className="flex gap-2 mt-2">
                                            <Input value={artist.value} onChange={e => updateDynamicField('featuringArtists', artist.id, e.target.value, track.id)} />
                                            <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('featuringArtists', track.id) : removeDynamicField('featuringArtists', artist.id, track.id)}>
                                                {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                <Label>Contributors to Sound Recording</Label>
                                {track.contributorsToSound.map((contributor, idx) => (
                                    <div key={contributor.id} className="flex gap-2 mt-2 items-start">
                                        <Select value={contributor.profession} onValueChange={(val) => updateDynamicField('contributorsToSound', contributor.id, val, track.id, 'profession')}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent className={dropdownClass}>
                                                {soundRecordingProfessions.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Input 
                                            placeholder="Name" 
                                            value={contributor.contributors}
                                            onChange={(e) => updateDynamicField('contributorsToSound', contributor.id, e.target.value, track.id, 'contributors')}
                                            className="flex-1"
                                        />
                                        <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('contributorsToSound', track.id) : removeDynamicField('contributorsToSound', contributor.id, track.id)}>
                                            {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                        </Button>
                                    </div>
                                ))}
                                </div>
                                <div>
                                <Label>Contributors to Musical Work</Label>
                                {track.contributorsToMusical.map((contributor, idx) => (
                                    <div key={contributor.id} className="flex gap-2 mt-2 items-start">
                                        <Select value={contributor.profession} onValueChange={(val) => updateDynamicField('contributorsToMusical', contributor.id, val, track.id, 'profession')}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent className={dropdownClass}>
                                                {musicalWorkRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Input 
                                            placeholder="Name" 
                                            value={contributor.contributors}
                                            onChange={(e) => updateDynamicField('contributorsToMusical', contributor.id, e.target.value, track.id, 'contributors')}
                                            className="flex-1"
                                        />
                                        <Button size="icon" variant="ghost" onClick={() => idx === 0 ? addDynamicField('contributorsToMusical', track.id) : removeDynamicField('contributorsToMusical', contributor.id, track.id)}>
                                            {idx === 0 ? <Plus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                        </Button>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div className="my-4">
                                <Label>Do you have an ISRC for this track?</Label>
                                <RadioGroup value={track.needISRC} onValueChange={(val) => handleTrackFieldChange(track.id, 'needISRC', val)} className="flex space-x-4 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`isrcYes-${track.id}`}/><Label htmlFor={`isrcYes-${track.id}`}>No (Generate one)</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`isrcNo-${track.id}`}/><Label htmlFor={`isrcNo-${track.id}`}>Yes</Label></div>
                                </RadioGroup>
                                {track.needISRC === 'no' && (
                                        <Input className="mt-2" placeholder="Enter ISRC" value={track.isrc} onChange={(e) => handleTrackFieldChange(track.id, 'isrc', e.target.value)} />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Primary Genre</Label>
                                    <Select value={track.primaryGenre} onValueChange={v => handleTrackFieldChange(track.id, 'primaryGenre', v)}>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                                        <SelectContent className={dropdownClass}>{genreOptions.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Secondary Genre</Label>
                                    <Select value={track.secondaryGenre} onValueChange={v => handleTrackFieldChange(track.id, 'secondaryGenre', v)}>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                                        <SelectContent className={dropdownClass}>{genreOptions.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                <Label>Does this track contain explicit lyrics?</Label>
                                <RadioGroup value={track.explicitStatus} onValueChange={v => handleTrackFieldChange(track.id, 'explicitStatus', v)} className="flex gap-4 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`explYes-${track.id}`}/><Label htmlFor={`explYes-${track.id}`}>Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`explNo-${track.id}`}/><Label htmlFor={`explNo-${track.id}`}>No</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="clean" id={`explClean-${track.id}`}/><Label htmlFor={`explClean-${track.id}`}>Clean</Label></div>
                                </RadioGroup>
                                </div>
                                <div>
                                <Label>Does this track contain human vocals?</Label>
                                <RadioGroup value={track.hasHumanVocals} onValueChange={v => handleTrackFieldChange(track.id, 'hasHumanVocals', v)} className="flex gap-4 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`vocYes-${track.id}`}/><Label htmlFor={`vocYes-${track.id}`}>Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`vocNo-${track.id}`}/><Label htmlFor={`vocNo-${track.id}`}>No</Label></div>
                                </RadioGroup>
                                </div>
                                {track.hasHumanVocals === 'yes' && (
                                    <div>
                                        <Label>Language of Lyrics</Label>
                                        <Select value={track.language} onValueChange={v => handleTrackFieldChange(track.id, 'language', v)}>
                                        <SelectTrigger className="mt-2"><SelectValue placeholder="Select Language" /></SelectTrigger>
                                        <SelectContent className={dropdownClass}>{languageOptions.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div>
                                    <Label>Available for Download?</Label>
                                    <RadioGroup value={track.isAvailableForDownload} onValueChange={v => handleTrackFieldChange(track.id, 'isAvailableForDownload', v)} className="flex gap-4 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`dlYes-${track.id}`}/><Label htmlFor={`dlYes-${track.id}`}>Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`dlNo-${track.id}`}/><Label htmlFor={`dlNo-${track.id}`}>No</Label></div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Label>Preview Start Time (mm:ss)</Label>
                                    <Input placeholder="00:30" className="mt-2" value={track.previewStartTiming} onChange={e => handleTrackFieldChange(track.id, 'previewStartTiming', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                </Card>
            ))}
        </div>

        {/* Step 3: Distribution Section - FULL WIDTH */}
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 border-b pb-2">Distribution Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Release Date (Future)</Label>
                    <Input type="date" value={formData.forFutureRelease} onChange={e => setFormData(p => ({...p, forFutureRelease: e.target.value}))} 
                    className="mt-2 [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0" />
                </div>
                <div>
                    <Label>Original Release Date (Past)</Label>
                    <Input type="date" value={formData.forPreorderPreSave} onChange={e => setFormData(p => ({...p, forPreorderPreSave: e.target.value}))} 
                    className="mt-2 [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0" />
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
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                id="selectAll"
                checked={selectAllPartners}
                onCheckedChange={handleSelectAllPartners}
                />
                <Label htmlFor="selectAll" className="font-medium">Select All Partners</Label>
            </div>

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
                        } else if (copyrightOption === 'proceed') {
                            setCopyrightOption('');
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
                        } else if (copyrightOption === 'upload') {
                            setCopyrightOption('');
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
  );
};

export default EditAdvancedRelease;
