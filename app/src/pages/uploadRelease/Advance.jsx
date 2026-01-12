import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Music, Upload, Trash2, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  createAdvancedRelease,
  updateAdvancedReleaseStep1,
  updateAdvancedReleaseStep2,
  updateAdvancedReleaseStep3,
  submitAdvancedRelease
} from '../../services/api.services';
import { showToast } from '../../utils/toast';
import { uploadToImageKit } from '../../utils/imagekitUploader.js';
import { languageOptions, genreOptions, territoryOptions, partnerOptions } from '../../constants/options';





const labelNames = ["Maheshwari Vishual"];

const soundRecordingProfessions = [
  "Actor", "Brand", "Choir", "Conductor", "Ensemble", "Mixer", 
  "Orchestra", "Musician", "Producer", "Programmer", "Remixer", 
  "Soloist", "Studio Personnel"
];

const musicalWorkRoles = [
  "Arranger", "Composer", "Librettist", "Lyricist", 
  "Publisher", "Non-Lyric Author", "Translator"
];

const releaseTypes = [
  { value: "single", label: "Single" },
  { value: "album", label: "Album" },
  { value: "ep", label: "EP" },
  { value: "minialbum", label: "Mini Album" },
  { value: "ringtonerelease", label: "Ringtone Release" }
];

const AdvancedReleaseBuilder = () => {

  const navigate = useNavigate()

  const [selectedReleaseType, setSelectedReleaseType] = useState('');
  const [releaseId, setReleaseId] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [worldWideRelease, setWorldWideRelease] = useState('yes');
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectAllPartners, setSelectAllPartners] = useState(false);
  const [copyrightOption, setCopyrightOption] = useState('');
  const [isUploadingCoverArt, setIsUploadingCoverArt] = useState(false);
  const [uploadingTrackId, setUploadingTrackId] = useState(null);
  const [isUploadingCopyrightDoc, setIsUploadingCopyrightDoc] = useState(false);

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
    accountId: '',
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
      featuringArtists: [{ id: generateUniqueId(), value: '' }], // Added for track-level featuring artists
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
    copyrightOption: '', // This seems redundant, top-level copyrightOption state is used
    copyrightDocument: ''
  });






  // API Mutations
  const createReleaseMutation = useMutation({
    mutationFn: (releaseType) => createAdvancedRelease(releaseType),
    onSuccess: (data) => {
      setReleaseId(data.data.releaseId);
      showToast.success('Advanced release created successfully!');
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to create advanced release');
    }
  });

  const updateStep1Mutation = useMutation({
    mutationFn: (data) => updateAdvancedReleaseStep1(releaseId, data),
    onSuccess: () => {
      showToast.success('Step 1 saved successfully!');
      setCurrentStep(1);
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to save step 1');
    }
  });

  const updateStep2Mutation = useMutation({
    mutationFn: (data) => updateAdvancedReleaseStep2(releaseId, data),
    onSuccess: () => {
      showToast.success('Step 2 saved successfully!');
      setCurrentStep(2);
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to save step 2');
    }
  });

  const updateStep3Mutation = useMutation({
    mutationFn: (data) => updateAdvancedReleaseStep3(releaseId, data),
    onSuccess: () => {
      showToast.success('Step 3 saved successfully!');
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to save step 3');
    }
  });

  const submitReleaseMutation = useMutation({
    mutationFn: () => submitAdvancedRelease(releaseId),
    onSuccess: () => {
      showToast.success('Release submitted successfully for review!');
      navigate('/app/catalog');
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to submit release');
    }
  });

  const handleCoverArtUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        showToast.error('Please select a JPG or PNG image file');
        return;
      }
      setIsUploadingCoverArt(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            if (img.width < 3000 || img.height < 3000) {
              showToast.error('Image must be at least 3000x3000 pixels');
              return;
            }
            const response = await uploadToImageKit(file, 'advanced_release/cover_art');
            setFormData(prev => ({
              ...prev,
              coverArt: response.url,
              coverArtPreview: response.url,
              coverArtInfo: { size: file.size, format: file.type.split('/')[1] }
            }));
          } finally {
            setIsUploadingCoverArt(false);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const addDynamicField = (section, trackId = null) => {
    setFormData(prev => {
      if (trackId) {
        const updatedTracks = prev.tracks.map(track => {
          if (track.id === trackId) {
            let newItem;
            if (section === 'contributorsToSound') {
              newItem = { id: generateUniqueId(), profession: '', contributors: '' };
            } else if (section === 'contributorsToMusical') {
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
        setFormData(prev => ({
          ...prev,
          tracks: prev.tracks.map(track =>
            track.id === trackId ? { ...track, trackLink: response.url, audioFileName: file.name } : track
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

  const handleReleaseTypeSelection = async (type) => {
    const loadingToast = showToast.loading('Creating advanced release...');
    try {
      await createReleaseMutation.mutateAsync(type);
      setSelectedReleaseType(type);
      setFormData(prev => ({ ...prev, releaseType: type }));
      showToast.dismiss(loadingToast);
      setCurrentStep(0);
    } catch (error) {
      showToast.dismiss(loadingToast);
      console.error('Failed to create release:', error);
    }
  };

  const addTrack = () => {
    if ((selectedReleaseType === 'single' || selectedReleaseType === 'ringtonerelease') && formData.tracks.length >= 1) {
      showToast.error('Single and Ringtone releases can only have one track');
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
      const updatedTerritories = checked
        ? [...prev, territory]
        : prev.filter(t => t !== territory);
      setFormData(prevData => ({ ...prevData, territories: updatedTerritories }));
      return updatedTerritories;
    });
  };

  const handlePartnerChange = (partner, checked) => {
    setSelectedPartners(prev => {
      const updatedPartners = checked
        ? [...prev, partner]
        : prev.filter(p => p !== partner);
      if (!checked) {
        setSelectAllPartners(false);
      }
      setFormData(prevData => ({ ...prevData, partners: updatedPartners }));
      return updatedPartners;
    });
  };

  const handleSelectAllPartners = (checked) => {
    setSelectAllPartners(checked);
    const allPartnerNames = checked
      ? [
          ...partnerOptions.callerTunePartners,
          ...partnerOptions.indianStores,
          ...partnerOptions.internationalStores
        ]
      : [];
    setSelectedPartners(allPartnerNames);
    setFormData(prev => ({ ...prev, partners: allPartnerNames }));
  };

  const renderStep1 = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 p-4">
          <div className="bg-muted/50 rounded-lg">
            <h3 className="text-foreground text-lg font-medium mb-6">Cover Art</h3>
            <div className="flex flex-col items-center">
              <div className="w-full h-[250px] bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                {isUploadingCoverArt && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white mt-2 text-sm">Uploading...</p>
                  </div>
                )}
                {formData.coverArtPreview ? (
                  <img src={formData.coverArtPreview} alt="Cover preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <>
                    <div className='rounded-xl p-6 bg-muted-foreground/10 mb-4'>
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Upload Cover Art</p>
                    <p className="text-muted-foreground text-sm mb-4">3000x3000px, JPG/PNG</p>
                  </>
                )}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleCoverArtUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploadingCoverArt}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => document.querySelector('input[type="file"]').click()} disabled={isUploadingCoverArt}>
                {isUploadingCoverArt ? 'Uploading...' : 'Choose Image'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-4">
          <div className="bg-muted/50 rounded-lg">
            <h3 className="text-foreground text-lg font-medium mb-6">Track Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-foreground">Release Name</Label>
                  <Input placeholder="Enter release name" className="mt-1" value={formData.releaseName} onChange={(e) => setFormData(prev => ({...prev, releaseName: e.target.value}))} />
                </div>
                <div>
                  <Label className="text-foreground">Release Version</Label>
                  <Input placeholder="Enter release version" className="mt-1" value={formData.releaseVersion} onChange={(e) => setFormData(prev => ({...prev, releaseVersion: e.target.value}))} />
                  <p className="text-[10px] text-muted-foreground mt-1">Use for non-original release EG: Remastered, Live, Remixes etc</p>
                </div>
                <div>
                  <Label className="text-foreground">Catalog #</Label>
                  <Input placeholder="Enter catalog number" className="mt-1" value={formData.catalogNumber} onChange={(e) => setFormData(prev => ({...prev, catalogNumber: e.target.value}))} />
                  <p className="text-[10px] text-muted-foreground mt-1">Your internal identifier for this release. This cannot be changed after audio is uploaded to the release.</p>
                </div>
                <div>
                  <Label className="text-foreground">Release Type</Label>
                  <Input
                    value={releaseTypes.find(t => t.value === selectedReleaseType)?.label || ""}
                    disabled
                    className="mt-1 opacity-60 cursor-not-allowed bg-muted"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Release type cannot be changed after creation</p>
                </div>
                <div>
                  <Label className="text-foreground">Account ID</Label>
                  <Input placeholder="Enter account ID" className="mt-1" value={formData.accountId} onChange={(e) => setFormData(prev => ({...prev, accountId: e.target.value}))} />
                </div>
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Primary Artists</Label>
                {formData.primaryArtists.map((artist, index) => (
                  <div key={artist.id} className="flex items-center gap-2 mb-2">
                    <Input placeholder="Enter primary artist name" className="flex-1" value={artist.value} onChange={(e) => updateDynamicField('primaryArtists', artist.id, e.target.value)} />
                    {index === formData.primaryArtists.length - 1 ? (
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('primaryArtists')}>
                        <Plus className="w-5 h-5 text-primary" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('primaryArtists', artist.id)}>
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="variousArtist" checked={formData.variousArtist} onCheckedChange={(checked) => setFormData(prev => ({...prev, variousArtist: checked}))} />
                  <Label htmlFor="variousArtist" className="text-sm">Various Artist</Label>
                </div>
                
                {formData.variousArtist && (
                  <div className="mt-4 ml-6 space-y-2">
                    <Label className="text-foreground text-sm">Various Artist Names</Label>
                    {formData.variousArtistNames.map((artist, index) => (
                      <div key={artist.id} className="flex items-center gap-2">
                        <Input placeholder="Enter various artist name" className="flex-1" value={artist.value} onChange={(e) => updateDynamicField('variousArtistNames', artist.id, e.target.value)} />
                        {index === formData.variousArtistNames.length - 1 ? (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('variousArtistNames')}>
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('variousArtistNames', artist.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Featuring Artists(optional)</Label>
                {formData.featuringArtists.map((artist, index) => (
                  <div key={artist.id} className="flex items-center gap-2 mb-2">
                    <Input placeholder="Enter featuring artist name" className="flex-1" value={artist.value} onChange={(e) => updateDynamicField('featuringArtists', artist.id, e.target.value)} />
                    {index === formData.featuringArtists.length - 1 ? (
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('featuringArtists')}>
                        <Plus className="w-5 h-5 text-primary" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('featuringArtists', artist.id)}>
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-foreground font-medium">Do you need a UPC for this release?</Label>
                <RadioGroup value={formData.needUPC} onValueChange={(value) => setFormData(prev => ({...prev, needUPC: value}))} className="flex space-x-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="upc-yes" />
                    <Label htmlFor="upc-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="upc-no" />
                    <Label htmlFor="upc-no">No</Label>
                  </div>
                </RadioGroup>
                <p className="text-[10px] text-muted-foreground mt-1">Gearnuun can be able to view your UPC once</p>
              </div>

              {formData.needUPC === 'no' && (
                <div>
                  <Label className="text-foreground">UPC</Label>
                  <Input placeholder="Enter UPC code" className="mt-1" value={formData.upc} onChange={(e) => setFormData(prev => ({...prev, upc: e.target.value}))} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Primary Genre</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, primaryGenre: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">Secondary Genre</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, secondaryGenre: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Label Name</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, labelName: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      {labelNames.map((label) => (
                        <SelectItem key={label} value={label}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">CLine</Label>
                  <div className="flex gap-2 mt-1">
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, cLineYear: value}))} className="w-32">
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Enter CLine details" className="flex-1" value={formData.cLine} onChange={(e) => setFormData(prev => ({...prev, cLine: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">PLine</Label>
                  <div className="flex gap-2 mt-1">
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, pLineYear: value}))} className="w-32">
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Enter PLine details" className="flex-1" value={formData.pLine} onChange={(e) => setFormData(prev => ({...prev, pLine: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Release pricing tier</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, releasePricingTier: value}))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Front" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Front</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="back">Back</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const canAddMultipleTracks = formData.releaseType && !['single', 'ringtone'].includes(formData.releaseType);
    
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {formData.tracks.map((track, index) => (
          <div key={track.id} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Card className="lg:col-span-1 p-4">
              <div className="bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground text-lg font-medium">Track Details</h3>
                  {canAddMultipleTracks && formData.tracks.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)} className="text-destructive hover:text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full h-[250px] bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center mb-4 relative">
                    {uploadingTrackId === track.id && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-white mt-2 text-sm">Uploading...</p>
                      </div>
                    )}
                    {track.audioFileName && ! (uploadingTrackId === track.id) ? (
                      <div className="text-center p-4">
                        <Music className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-foreground font-medium text-sm">{track.audioFileName}</p>
                        <p className="text-muted-foreground text-xs">Audio uploaded</p>
                      </div>
                    ) : (
                      <>
                        <div className='rounded-xl p-6 bg-muted-foreground/10 mb-4'>
                          <Music className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium mb-4">Upload Track</p>
                      </>
                    )}
                    <input
                      id={`audio-upload-${track.id}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioUpload(track.id, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingTrackId === track.id}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById(`audio-upload-${track.id}`).click()} disabled={uploadingTrackId === track.id}>
                    {uploadingTrackId === track.id ? 'Uploading...' : 'Choose Audio'}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-3 p-4">
              <div className="bg-muted/50 rounded-lg">
                <h3 className="text-foreground text-lg font-medium mb-6">Track Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">Track Name</Label>
                      <Input placeholder="Enter track name" className="mt-1" value={track.trackName} onChange={(e) => handleTrackFieldChange(track.id, 'trackName', e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-foreground">Mix version</Label>
                      <Input placeholder="Enter mix version" className="mt-1" value={track.mixVersion} onChange={(e) => handleTrackFieldChange(track.id, 'mixVersion', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block">Primary Artists</Label>
                    {track.primaryArtists.map((artist, idx) => (
                      <div key={artist.id} className="flex items-center gap-2 mb-2">
                        <Input placeholder="Enter primary artist name" className="flex-1" value={artist.value} onChange={(e) => updateDynamicField('primaryArtists', artist.id, e.target.value, track.id)} />
                        {idx === track.primaryArtists.length - 1 ? (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('primaryArtists', track.id)}>
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('featuringArtists', artist.id, track.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block">Featuring Artists (optional)</Label>
                    {track.featuringArtists.map((artist, idx) => (
                      <div key={artist.id} className="flex items-center gap-2 mb-2">
                        <Input placeholder="Enter featuring artist name" className="flex-1" value={artist.value} onChange={(e) => updateDynamicField('featuringArtists', artist.id, e.target.value, track.id)} />
                        {idx === track.featuringArtists.length - 1 ? (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('featuringArtists', track.id)}>
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('featuringArtists', artist.id, track.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label className="text-foreground mb-2 block">Contributors to Sound Recording</Label>
                    {track.contributorsToSound.map((contributor, idx) => (
                      <div key={contributor.id} className="flex items-center gap-2 mb-2">
                        <Select onValueChange={(value) => updateDynamicField('contributorsToSound', contributor.id, value, track.id, 'profession')}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                          <SelectContent>
                            {soundRecordingProfessions.map((prof) => (
                              <SelectItem key={prof} value={prof.toLowerCase()}>{prof}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input placeholder="Enter contributor name" className="flex-1" value={contributor.contributors} onChange={(e) => updateDynamicField('contributorsToSound', contributor.id, e.target.value, track.id, 'contributors')} />
                        {idx === track.contributorsToSound.length - 1 ? (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('contributorsToSound', track.id)}>
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('contributorsToSound', contributor.id, track.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block">Contributors to Musical Work</Label>
                    {track.contributorsToMusical.map((contributor, idx) => (
                      <div key={contributor.id} className="flex items-center gap-2 mb-2">
                        <Select onValueChange={(value) => updateDynamicField('contributorsToMusical', contributor.id, value, track.id, 'profession')}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                          <SelectContent>
                            {musicalWorkRoles.map((role) => (
                              <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input placeholder="Enter contributor name" className="flex-1" value={contributor.contributors} onChange={(e) => updateDynamicField('contributorsToMusical', contributor.id, e.target.value, track.id, 'contributors')} />
                        {idx === track.contributorsToMusical.length - 1 ? (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => addDynamicField('contributorsToMusical', track.id)}>
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="p-2" onClick={() => removeDynamicField('contributorsToMusical', contributor.id, track.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Do you need a ISRC for this release?</Label>
                    <RadioGroup value={track.needISRC} onValueChange={(value) => handleTrackFieldChange(track.id, 'needISRC', value)} className="flex space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`isrc-yes-${track.id}`} />
                        <Label htmlFor={`isrc-yes-${track.id}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`isrc-no-${track.id}`} />
                        <Label htmlFor={`isrc-no-${track.id}`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {track.needISRC === 'no' && (
                    <div>
                      <Label className="text-foreground">ISRC</Label>
                      <Input placeholder="Enter ISRC code" className="mt-1" value={track.isrc} onChange={(e) => handleTrackFieldChange(track.id, 'isrc', e.target.value)} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">Primary Genre</Label>
                      <Select onValueChange={(value) => handleTrackFieldChange(track.id, 'primaryGenre', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {genreOptions.map((genre) => (
                            <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-foreground">Secondary Genre</Label>
                      <Select onValueChange={(value) => handleTrackFieldChange(track.id, 'secondaryGenre', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {genreOptions.map((genre) => (
                            <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Explicit Status</Label>
                    <RadioGroup value={track.explicitStatus} onValueChange={(value) => handleTrackFieldChange(track.id, 'explicitStatus', value)} className="flex space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`explicit-yes-${track.id}`} />
                        <Label htmlFor={`explicit-yes-${track.id}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`explicit-no-${track.id}`} />
                        <Label htmlFor={`explicit-no-${track.id}`}>No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cleaned" id={`explicit-cleaned-${track.id}`} />
                        <Label htmlFor={`explicit-cleaned-${track.id}`}>Cleaned</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Does this Track have Human Vocals?</Label>
                    <RadioGroup value={track.hasHumanVocals} onValueChange={(value) => handleTrackFieldChange(track.id, 'hasHumanVocals', value)} className="flex space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`vocals-yes-${track.id}`} />
                        <Label htmlFor={`vocals-yes-${track.id}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`vocals-no-${track.id}`} />
                        <Label htmlFor={`vocals-no-${track.id}`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {track.hasHumanVocals === 'yes' && (
                    <div>
                      <Label className="text-foreground">Language</Label>
                      <Select onValueChange={(value) => handleTrackFieldChange(track.id, 'language', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {languageOptions.map((language) => (
                            <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label className="text-foreground font-medium">Is Track is available for download Purchase?</Label>
                    <RadioGroup value={track.isAvailableForDownload} onValueChange={(value) => handleTrackFieldChange(track.id, 'isAvailableForDownload', value)} className="flex space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`download-yes-${track.id}`} />
                        <Label htmlFor={`download-yes-${track.id}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`download-no-${track.id}`} />
                        <Label htmlFor={`download-no-${track.id}`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-foreground">Preview Start Timing / Callertune Start Timing</Label>
                    <Input placeholder="Enter timing in seconds" className="mt-1" value={track.previewStartTiming} onChange={(e) => handleTrackFieldChange(track.id, 'previewStartTiming', e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}

        {canAddMultipleTracks && (
          <div className="flex justify-center">
            <Button onClick={addTrack} variant="outline" className="w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Track
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="mx-auto space-y-8">
      <Card className="space-y-6 p-6">
        <h3 className="text-foreground text-xl font-semibold">Delivery Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-foreground">For Future release</Label>
            <div className="mt-2 relative">
              <Input 
                type="date" 
                placeholder="mm/dd/yyyy" 
                className="w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:invert" 
                value={formData.forFutureRelease}
                onChange={(e) => setFormData(prev => ({...prev, forFutureRelease: e.target.value}))}
                min={(() => {
                  const today = new Date();
                  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return oneWeekLater.toISOString().split('T')[0];
                })()}
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">For Previous/Past release</Label>
            <div className="mt-2 relative">
              <Input 
                type="date" 
                placeholder="mm/dd/yyyy" 
                className="w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:invert" 
                value={formData.forPreorderPreSave}
                onChange={(e) => setFormData(prev => ({...prev, forPreorderPreSave: e.target.value}))}
                max={(() => {
                  const today = new Date();
                  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                  return yesterday.toISOString().split('T')[0];
                })()}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-4">Territory Rights :</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium">World Wide Release</Label>
              <RadioGroup value={worldWideRelease} onValueChange={(value) => {
                setWorldWideRelease(value);
                setFormData(prev => ({...prev, worldWideRelease: value}));
              }} className="flex space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="worldwide-yes" />
                  <Label htmlFor="worldwide-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="worldwide-no" />
                  <Label htmlFor="worldwide-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {worldWideRelease === 'no' && (
              <Card className="p-6 border border-muted bg-background rounded-lg">
                <Label className="text-foreground font-medium">Select The Territories, Where you own the rights</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-60 overflow-y-auto custom-scroll">
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

        {/* Partner Selection */}
        <div>
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
            <Card key={category} className="p-6 border  border-muted bg-background rounded-lg mb-6">
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


        <div className="space-y-4">
          <h4 className="text-foreground font-semibold">Copyright Options :</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="proceedWithoutCopyright"
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
              <Label htmlFor="proceedWithoutCopyright">Proceed without Uploading the Copyright Documents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ownCopyrightUpload"
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
              <Label htmlFor="ownCopyrightUpload">I own the Copyrights Will Upload</Label>
            </div>
          </div>

          {copyrightOption === 'upload' && (
            <div className="ml-6 mt-4">
              <Label htmlFor="copyright-doc-input" className="text-foreground">Upload Copyright Document</Label>
              <div className="flex items-center space-x-2 mt-2 relative">
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="copyright-doc-input"
                  disabled={isUploadingCopyrightDoc}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIsUploadingCopyrightDoc(true);
                      try {
                        const response = await uploadToImageKit(file, 'advanced_release/copyright_docs');
                        setFormData(prev => ({ ...prev, copyrightDocument: response.url }));
                      } finally {
                        setIsUploadingCopyrightDoc(false);
                      }
                    }
                  }} 
                />
                <div className="flex-1 p-2 border rounded-md bg-background text-sm text-muted-foreground h-10 flex items-center truncate">
                  {formData.copyrightDocument 
                    ? new URL(formData.copyrightDocument).pathname.split('/').pop() 
                    : 'No file selected'
                  }
                </div>
                <Button variant="outline" size="sm" onClick={() => document.getElementById('copyright-doc-input').click()} disabled={isUploadingCopyrightDoc}>
                  {isUploadingCopyrightDoc ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <Upload className="w-4 h-4" />}
                  <span className="ml-2">{isUploadingCopyrightDoc ? 'Uploading...' : 'Upload'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderReleaseTypeSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-foreground text-2xl font-semibold mb-2">Select Release Type</h2>
        <p className="text-muted-foreground text-sm">Choose the type of release you want to create</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releaseTypes.map((type) => (
          <div
            key={type.value}
            className="relative border-2 border-dashed border-slate-600 rounded-lg p-8 hover:border-slate-500 transition-colors cursor-pointer group"
            onClick={() => handleReleaseTypeSelection(type.value)}
          >
            <div className="flex flex-col items-center justify-center text-center h-32">
              <div className="mb-4">
                <Plus className="w-10 h-10 text-slate-400 group-hover:text-slate-300 transition-colors" />
              </div>
              <h3 className="text-foreground text-lg font-medium mb-1">{type.label}</h3>
              <p className="text-muted-foreground text-xs">
                {(type.value === 'single' || type.value === 'ringtonerelease') ? '1 Track' : 'Multiple Tracks'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      default: return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Cover Details';
      case 1: return 'Track Details';
      case 2: return 'Distribution';
      default: return '';
    }
  };

  const handleStepSubmit = async () => {
    if (currentStep === 0) {
      // Step 1: Cover Art & Release Info
      const step1Data = {
        coverArt: {
          imageUrl: formData.coverArt,
          imageSize: formData.coverArtInfo.size,
          imageFormat: formData.coverArtInfo.format
        },
        releaseInfo: {
          releaseName: formData.releaseName,
          releaseVersion: formData.releaseVersion,
          catalog: formData.catalogNumber,
          releaseType: selectedReleaseType,
          primaryArtists: formData.primaryArtists.map(a => a.value).filter(v => v),
          variousArtists: formData.variousArtist ? formData.variousArtistNames.map(a => a.value).filter(v => v) : [],
          featuringArtists: formData.featuringArtists.map(a => a.value).filter(v => v),
          needsUPC: formData.needUPC === 'yes',
          upcCode: formData.needUPC === 'no' ? formData.upc : '',
          primaryGenre: formData.primaryGenre,
          secondaryGenre: formData.secondaryGenre,
          labelName: formData.labelName,
          cLine: formData.cLine && formData.cLineYear ? {
            year: parseInt(formData.cLineYear),
            text: formData.cLine
          } : null,
          pLine: formData.pLine && formData.pLineYear ? {
            year: parseInt(formData.pLineYear),
            text: formData.pLine
          } : null,
          releasePricingTier: formData.releasePricingTier
        }
      };

      await updateStep1Mutation.mutateAsync(step1Data);
    } else if (currentStep === 1) {
      // Step 2: Tracks
      const tracksData = {
        tracks: formData.tracks.map(track => ({
          ...(track.needISRC === 'no' && track.isrc && { isrcCode: track.isrc }),
          trackLink: track.trackLink,
          trackName: track.trackName,
          mixVersion: track.mixVersion,
          primaryArtists: track.primaryArtists.map(a => a.value).filter(v => v),
          featuringArtists: track.featuringArtists.map(a => a.value).filter(v => v),
          contributorsToSoundRecording: track.contributorsToSound
            .filter(c => c.profession && c.contributors)
            .map(c => ({
              profession: c.profession,
              contributors: c.contributors
            })),
          contributorsToMusicalWork: track.contributorsToMusical
            .filter(c => c.profession && c.contributors)
            .map(c => ({
              profession: c.profession,
              contributors: c.contributors
            })),
          needsISRC: track.needISRC === 'yes',
          callertuneStartTiming: track.previewStartTiming ? parseInt(track.previewStartTiming) : null,
          primaryGenre: track.primaryGenre,
          secondaryGenre: track.secondaryGenre,
          hasHumanVocals: track.hasHumanVocals === 'yes',
          ...(track.language && { language: track.language }),
          explicitStatus: track.explicitStatus,
          isAvailableForDownload: track.isAvailableForDownload === 'yes'
        }))
      };

      await updateStep2Mutation.mutateAsync(tracksData);
    } else if (currentStep === 2) {
      // Step 3: Delivery Details
      const step3Data = {
        deliveryDetails: {
          forFutureRelease: formData.forFutureRelease ? new Date(formData.forFutureRelease).toISOString() : null,
          forPastRelease: formData.forPreorderPreSave ? new Date(formData.forPreorderPreSave).toISOString() : null
        },
        territorialRights: {
          territories: worldWideRelease === 'yes'
            // ? territories.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, ''))
            ?[]
            : selectedTerritories.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, '')),
          isWorldwide: worldWideRelease === 'yes'
        },
        distributionPartners: selectAllPartners
          ? [
              ...partnerOptions.callerTunePartners,
              ...partnerOptions.indianStores,
              ...partnerOptions.internationalStores
            ].map(p => p.toLowerCase().replace(/\s+/g, '_'))
          : selectedPartners.map(p => p.toLowerCase().replace(/\s+/g, '_')),
        copyrightOptions: {
          proceedWithoutCopyright: copyrightOption === 'proceed',
          copyrightDocumentLink: copyrightOption === 'upload' ? formData.copyrightDocument : null,
          ownsCopyrights: copyrightOption === 'upload',
        }
      };

      await updateStep3Mutation.mutateAsync(step3Data);

      // After step 3, submit the release
      await submitReleaseMutation.mutateAsync();
    }
  };

  const handleSubmit = () => {
    console.log('Advanced Release Form Data:', formData);
  };

  // If no release type selected, show selection screen
  if (!selectedReleaseType) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button onClick={()=>navigate('/app/upload-release/')} variant="outline" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-foreground text-3xl font-semibold">Advanced Release Builder</h1>
                <p className="text-muted-foreground text-sm">Create and distribute your advanced music release</p>
              </div>
            </div>
          </div>
          {renderReleaseTypeSelection()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={()=>navigate('/app/upload-release/')} variant="outline" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-foreground text-3xl font-semibold">Upload Release</h1>
              <p className="text-muted-foreground text-sm">Upload your music and distribute it to all major platforms</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium">
            Step {currentStep + 1} of 3
          </div>
        </div>

        <Card className="flex flex-row items-center justify-between px-10 mb-8 py-3 space-x-4">
          {[
            { icon: Upload, label: 'Cover Details', step: 0 },
            { icon: Music, label: 'Track Details', step: 1 },
            { icon: Globe, label: 'Distribution', step: 2 }
          ].map(({icon: Icon, label, step}) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center space-x-2 px-4 py-2  `}>
                <div className={`p-2 rounded-full ${currentStep === step ? 'bg-[#711CE9] text-white' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                <Icon className={`w-5 h-5  `} />

                </div>
                <span className="font-medium hidden md:inline">{label}</span>
              </div>
              {step < 2 && <div className="w-12 h-px bg-muted mx-2"></div>}
            </div>
          ))}
        </Card>

        <div className="mb-12">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep ? 'bg-primary text-primary-foreground' : step < currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step + 1}
                </div>
                <span className={`ml-2 text-sm ${step === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Step {step + 1}
                </span>
                {step < 2 && <div className="w-8 h-px bg-muted mx-4"></div>}
              </div>
            ))} */}
          </div>

          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/app/upload-release')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStepSubmit}
              disabled={
                createReleaseMutation.isPending ||
                updateStep1Mutation.isPending ||
                updateStep2Mutation.isPending ||
                updateStep3Mutation.isPending ||
                submitReleaseMutation.isPending
              }
              className="bg-primary text-primary-foreground"
            >
              {updateStep1Mutation.isPending || updateStep2Mutation.isPending || updateStep3Mutation.isPending || submitReleaseMutation.isPending
                ? 'Saving...'
                : currentStep === 2
                  ? 'Submit'
                  : 'Next Step'}
              {currentStep < 2 && !updateStep1Mutation.isPending && !updateStep2Mutation.isPending && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReleaseBuilder;