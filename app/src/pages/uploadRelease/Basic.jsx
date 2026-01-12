import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Music, Upload, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createRelease, updateReleaseStep1, updateReleaseStep2, updateReleaseStep3, submitRelease } from '../../services/api.services';
import { showToast } from '../../utils/toast';
import { uploadToImageKit } from '../../utils/imagekitUploader.js';
import { languageOptions, genreOptions, territoryOptions, partnerOptions } from '../../constants/options';





const labelNames = [
  "Maheshwari Vishual"
];

const BasicReleaseBuilder = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0);
  const [releaseType, setReleaseType] = useState('');
  const [releaseId, setReleaseId] = useState('');
  const [worldWideRelease, setWorldWideRelease] = useState('no');
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectAllPartners, setSelectAllPartners] = useState(false);
  const [copyrightOption, setCopyrightOption] = useState(''); // 'proceed' or 'upload'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCoverArt, setIsUploadingCoverArt] = useState(false);
  const [uploadingTrackId, setUploadingTrackId] = useState(null);
  const [isUploadingCopyrightDoc, setIsUploadingCopyrightDoc] = useState(false);
  // const [tracks, setTracks] = useState([{ id: 1 }]);

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

  const tracks = formData.tracks;

  // API Mutations
  const createReleaseMutation = useMutation({
    mutationFn: (trackType) => createRelease(trackType),
    onSuccess: (data) => {
      setReleaseId(data.data.releaseId);
      showToast.success('Release created successfully!');
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to create release');
    }
  });

  const updateStep1Mutation = useMutation({
    mutationFn: (data) => updateReleaseStep1(releaseId, data),
    onSuccess: (data) => {
      showToast.success('Step 1 completed successfully!');
      setCurrentStep(1);
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to update step 1');
    }
  });

  const updateStep2Mutation = useMutation({
    mutationFn: (data) => updateReleaseStep2(releaseId, data),
    onSuccess: (data) => {
      showToast.success('Step 2 completed successfully!');
      setCurrentStep(2);
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to update step 2');
    }
  });

  const updateStep3Mutation = useMutation({
    mutationFn: (data) => updateReleaseStep3(releaseId, data),
    onSuccess: (data) => {
      showToast.success('Step 3 completed successfully!');
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to update step 3');
    }
  });

  const submitReleaseMutation = useMutation({
    mutationFn: (releaseId) => submitRelease(releaseId),
    onSuccess: (data) => {
      showToast.success('Release submitted for review successfully!');
      setTimeout(() => {
        navigate('/app/catalog');
      }, 2000);
    },
    onError: (error) => {
      showToast.error(error?.response?.data?.message || 'Failed to submit release');
    }
  });






  // Handle cover art upload
  const handleCoverArtUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
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
            const response = await uploadToImageKit(file, 'basic_release/cover_art');
            setFormData(prev => ({ 
              ...prev, 
              coverArt: response.url, 
              coverArtPreview: response.url,
              coverArtInfo: { size: file.size, format: file.type.split('/')[1] }
            }));
          } catch (error) {
            // In case of upload error, you might want to clear the preview
            console.error("Upload failed, clearing preview.", error);
          } finally {
            setIsUploadingCoverArt(false);
          }
        };
        img.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  };

  // Handle audio file upload
  const handleAudioUpload = async (trackId, event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        showToast.error('Please select an audio file');
        return;
      }

      setUploadingTrackId(trackId);
      try {
        const response = await uploadToImageKit(file, 'basic_release/tracks');
        setFormData(prev => ({
          ...prev,
          tracks: prev.tracks.map(track =>
            track.id === trackId
              ? { ...track, trackLink: response.url, audioFileName: file.name }
              : track
          )
        }));
      } catch (error) {
        console.error("Audio upload failed for track:", trackId, error);
      } finally {
        setUploadingTrackId(null);
      }
    }
  };

  // Handle track field changes
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
    // Prevent adding multiple tracks for single release
    if (releaseType === 'single' && formData.tracks.length >= 1) {
      showToast.error('Single release can only have one track');
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

  const handleCopyrightOptionChange = (option) => {
    setCopyrightOption(option);
    setFormData(prev => ({ ...prev, copyrightOption: option }));
  };

  const handleCopyrightDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        showToast.error('Please select a PDF or DOC file.');
        return;
      }
      setIsUploadingCopyrightDoc(true);
      try {
        const response = await uploadToImageKit(file, 'basic_release/copyright_docs');
        setFormData(prev => ({ ...prev, copyrightDocument: response.url }));
      } catch (error) {
        console.error("Copyright document upload failed:", error);
      } finally {
        setIsUploadingCopyrightDoc(false);
      }
    }
  };

  const handleReleaseTypeSelection = async (type) => {
    const loadingToast = showToast.loading('Creating release...');
    try {
      await createReleaseMutation.mutateAsync(type);
      setReleaseType(type);
      showToast.dismiss(loadingToast);
    } catch (error) {
      showToast.dismiss(loadingToast);
    }
  };

  const renderReleaseTypeSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="relative border-2 border-dashed border-slate--600 rounded-lg p-12 hover:border-slate-500 transition-colors cursor-pointer group"
          onClick={() => handleReleaseTypeSelection('single')}
        >
          <div className="flex flex-col items-center justify-center text-center h-48">
            <div className="mb-6">
              <Plus className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h3 className="text-foreground text-xl font-medium mb-2">Select a Single track</h3>
            <p className="text-muted-foreground text-sm">Add a track from MV Catalog or Spotify</p>
          </div>
        </div>

        <div
          className="relative border-2 border-dashed border-slate--600 rounded-lg p-12 hover:border-slate-500 transition-colors cursor-pointer group"
          onClick={() => handleReleaseTypeSelection('album')}
        >
          <div className="flex flex-col items-center justify-center text-center h-48">
            <div className="mb-6">
              <Plus className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h3 className="text-foreground text-xl font-medium mb-2">Select a Album track</h3>
            <p className="text-muted-foreground text-sm">Add a track from MV Catalog or Spotify</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cover Art Section */}
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
                  <img 
                    src={formData.coverArtPreview} 
                    alt="Cover preview" 
                    className="w-full h-full  object-contain rounded-lg"
                  />
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

        {/* Track Information Section */}
        <Card className="lg:col-span-3 p-4">
          <div className="bg-muted/50 rounded-lg">
            <h3 className="text-foreground text-lg font-medium mb-6">Cover Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="releaseName" className="text-foreground">Release Name</Label>
                <Input 
                  id="releaseName"
                  placeholder="Enter release name"
                  value={formData.releaseName}
                  onChange={(e) => setFormData(prev => ({...prev, releaseName: e.target.value}))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="genre" className="text-foreground">Genre</Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, genre: value}))}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="upc" className="text-foreground">UPC</Label>
                <Input 
                  id="upc"
                  placeholder="Enter UPC code"
                  value={formData.upc}
                  onChange={(e) => setFormData(prev => ({...prev, upc: e.target.value}))}
                  className="mt-1"
                />
              </div>
              <div className="">
                <Label htmlFor="labelName" className="text-foreground">Label name</Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, labelName: value}))}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labelNames.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {formData.tracks.map((track, index) => (
        <div key={track.id} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Audio File Section */}
          <Card className="lg:col-span-1 p-4">
            <div className="bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-foreground text-lg font-medium">Audio File</h3>
                {releaseType === 'album' && formData.tracks.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeTrack(track.id)}
                    className="text-destructive hover:text-destructive"
                  >
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
                  {track.audioFileName ? (
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
                      <p className="text-foreground font-medium mb-4">Upload Audio File</p>
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

          {/* Track Information Section */}
          <Card className="lg:col-span-3 p-4">
            <div className="bg-muted/50 rounded-lg">
              <h3 className="text-foreground text-lg font-medium mb-6">Track Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-foreground">Song Name</Label>
                  <Input 
                    placeholder="Enter song name" 
                    className="mt-1" 
                    value={track.songName}
                    onChange={(e) => handleTrackFieldChange(track.id, 'songName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Genre</Label>
                  <Select onValueChange={(value) => handleTrackFieldChange(track.id, 'genre', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>
                          {genre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-foreground">Singer Name</Label>
                  <Input 
                    placeholder="Enter singer name" 
                    className="mt-1" 
                    value={track.singerName}
                    onChange={(e) => handleTrackFieldChange(track.id, 'singerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Composer Name</Label>
                  <Input 
                    placeholder="Enter composer name" 
                    className="mt-1" 
                    value={track.composerName}
                    onChange={(e) => handleTrackFieldChange(track.id, 'composerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Lyricist Name</Label>
                  <Input 
                    placeholder="Enter lyricist name" 
                    className="mt-1" 
                    value={track.lyricistName}
                    onChange={(e) => handleTrackFieldChange(track.id, 'lyricistName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Producer Name</Label>
                  <Input 
                    placeholder="Enter producer name" 
                    className="mt-1" 
                    value={track.producerName}
                    onChange={(e) => handleTrackFieldChange(track.id, 'producerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">ISRC</Label>
                  <Input 
                    placeholder="Enter ISRC code" 
                    className="mt-1" 
                    value={track.isrc}
                    onChange={(e) => handleTrackFieldChange(track.id, 'isrc', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Preview/Call-tune timing</Label>
                  <Input 
                    placeholder="Enter timing (e.g., 0:30-1:00)" 
                    className="mt-1" 
                    value={track.previewCallTiming}
                    onChange={(e) => handleTrackFieldChange(track.id, 'previewCallTiming', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-foreground">Language</Label>
                  <Select onValueChange={(value) => handleTrackFieldChange(track.id, 'language', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                                            {languageOptions.map((language) => (
                                                <SelectItem key={language.value} value={language.value}>
                                                  {language.label}
                                                </SelectItem>
                                              ))}                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}

      {releaseType === 'album' && (
        <div className="flex justify-center">
          <Button onClick={addTrack} variant="outline" className="w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add More Tracks
          </Button>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className=" mx-auto space-y-8">
      {/* Delivery Details */}
      <Card className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-foreground">For Future Release</Label>
            <div className=" space-x-2 mt-2 relative">
              <Input 
                type="date" 
                placeholder="mm/dd/yyyy" 
                className=" w-full  [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3  [&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:invert" 
                value={formData.forFutureRelease}
                onChange={(e) => setFormData(prev => ({...prev, forFutureRelease: e.target.value}))}
                min={(() => {
                  const today = new Date();
                  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  const year = oneWeekLater.getFullYear();
                  const month = String(oneWeekLater.getMonth() + 1).padStart(2, '0');
                  const day = String(oneWeekLater.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                })()}
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">For Preorder/Pre-save release</Label>
            <div className=" space-x-2 mt-2 relative">
              <Input 
                type="date" 
                placeholder="mm/dd/yyyy" 
                className=" w-full  [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3  [&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:invert" 
                value={formData.forPreorderPreSave}
                onChange={(e) => setFormData(prev => ({...prev, forPreorderPreSave: e.target.value}))}
                 max={(() => {
                  const today = new Date();
                  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                  const year = yesterday.getFullYear();
                  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
                  const day = String(yesterday.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
              })()}
              />
            </div>
          </div>
        </div>

        {/* Territory Rights */}
        <div>
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


        {/* Copyright Options */}
        <div className="space-y-4">
          <h4 className="text-foreground font-medium mb-4">Copyright Options :</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="proceedWithout"
                checked={copyrightOption === 'proceed'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleCopyrightOptionChange('proceed');
                  } else if (copyrightOption === 'proceed') {
                    handleCopyrightOptionChange('');
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
                    handleCopyrightOptionChange('upload');
                  } else if (copyrightOption === 'upload') {
                    handleCopyrightOptionChange('');
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

  const renderStepContent = () => {
    if (!releaseType) return renderReleaseTypeSelection();
    
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    if (!releaseType) return '';
    switch (currentStep) {
      case 0: return 'Cover Art & Cover Information';
      case 1: return 'Audio File & Track Details';
      case 2: return 'Delivery Details';
      default: return '';
    }
  };

  const handleStepSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = showToast.loading('Saving...');

    try {
      if (currentStep === 0) {
        // Step 1: Cover Art & Release Info
        const step1Data = {
          coverArt: { 
            imageUrl: formData.coverArt,
            imageSize: formData.coverArtInfo.size,
            imageFormat: formData.coverArtInfo.format,
          },
          releaseInfo: {
            releaseName: formData.releaseName,
            genre: formData.genre,
            labelName: formData.labelName,
            upc: formData.upc
          }
        };

        await updateStep1Mutation.mutateAsync(step1Data);
      } else if (currentStep === 1) {
        // Step 2: Audio Files & Track Details
        const tracksData = formData.tracks.map(track => ({
          trackName: track.songName,
          genre: track.genre,
          composerName: track.composerName,
          lyricistName: track.lyricistName,
          singerName: track.singerName,
          producerName: track.producerName,
          isrc: track.isrc,
          audioFiles: [
            {
              format: "mp3",
              fileUrl: track.trackLink,
              fileSize: 5242880, // This is a placeholder, ImageKit doesn't return size easily
              duration: 210
            }
          ],
          previewTiming: {
            startTime: 30,
            endTime: 60
          },
          callerTuneTiming: {
            startTime: 45,
            endTime: 75
          },
          ...(track.language && { language: track.language })
        }));

        const step2Data = {
          tracks: tracksData
        };

        await updateStep2Mutation.mutateAsync(step2Data);
      } else if (currentStep === 2) {
        // Step 3: Release Settings

        // Territorial Rights Logic
        let territorialRightsData;
        if (worldWideRelease === 'yes') {
          // World Wide Release - add all territories
          territorialRightsData = {
            hasRights: true,
            territories: territoryOptions.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, ''))
          };
        } else {
          // Specific territories selected
          territorialRightsData = {
            hasRights: selectedTerritories.length > 0,
            territories: selectedTerritories.map(t => t.toLowerCase().replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, ''))
          };
        }

        // Partner Selection Logic
        let partnerSelectionData;
        if (selectAllPartners) {
          // All partners selected - add all partners
          const allPartnerNames = [
            ...partnerOptions.callerTunePartners,
            ...partnerOptions.indianStores,
            ...partnerOptions.internationalStores
          ];
          partnerSelectionData = {
            hasPartners: true,
            partners: allPartnerNames.map(p => p.toLowerCase().replace(/\s+/g, '_'))
          };
        } else {
          // Specific partners selected
          partnerSelectionData = {
            hasPartners: selectedPartners.length > 0,
            partners: selectedPartners.map(p => p.toLowerCase().replace(/\s+/g, '_'))
          };
        }

        const step3Data = {
          releaseDate: formData.forFutureRelease ? new Date(formData.forFutureRelease).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          territorialRights: territorialRightsData,
          partnerSelection: partnerSelectionData,
          copyrights: {
            ownsCopyright: copyrightOption === 'upload',
            copyrightDocuments: copyrightOption === 'upload' && formData.copyrightDocument ? [
              { documentUrl: formData.copyrightDocument }
            ] : []
          }
        };

        await updateStep3Mutation.mutateAsync(step3Data);

        // After step 3 is complete, submit the release
        showToast.dismiss(loadingToast);
        const submitLoadingToast = showToast.loading('Submitting release for review...');

        try {
          await submitReleaseMutation.mutateAsync(releaseId);
          showToast.dismiss(submitLoadingToast);
        } catch (submitError) {
          showToast.dismiss(submitLoadingToast);
          throw submitError;
        }
      }

      showToast.dismiss(loadingToast);
    } catch (error) {
      showToast.dismiss(loadingToast);
      console.error('Error submitting step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    // Navigate back to upload release page
    console.log('Navigate back to /app/upload-release');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/app/upload-release')} 
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-foreground text-3xl font-semibold">Upload Release</h1>
              <p className="text-muted-foreground text-sm">Basic Release Builder</p>
            </div>
          </div>
        </div>

        {/* Step Title */}
        {releaseType && (
          <div className=" mb-8">
            <h2 className="text-foreground text-xl font-medium">{getStepTitle()}</h2>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Step Navigation */}
        {releaseType && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {[0, 1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step < currentStep 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step + 1}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    Step {step + 1}
                  </span>
                  {step < 2 && <div className="w-8 h-px bg-muted mx-4"></div>}
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              {currentStep > 0 && (
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleStepSubmit}
                disabled={isSubmitting || createReleaseMutation.isPending || updateStep1Mutation.isPending || updateStep2Mutation.isPending || updateStep3Mutation.isPending || submitReleaseMutation.isPending}
                className="bg-primary text-primary-foreground"
              >
                {isSubmitting ? 'Saving...' : currentStep === 2 ? 'Submit' : 'Next Step'}
                {currentStep < 2 && !isSubmitting && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicReleaseBuilder;