import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Link, Shield, CreditCard, Loader } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getMySubscription, getAllSubscriptionPlans, updateProfile, updateSocialMedia } from '@/services/api.services';
import { showToast } from '@/utils/toast';
import { uploadToImageKit } from '@/utils/imagekitUploader';

const Profile = () => {
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { user } = useAuthStore();

  const fileInputRef = useRef(null);

  // Fetch current subscription
  const { data: currentSubData, isLoading: currentSubLoading } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all subscription plans
  const { data: allPlansData, isLoading: allPlansLoading } = useQuery({
    queryKey: ['allSubscriptionPlans'],
    queryFn: getAllSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });

  // Form data state
  const [formData, setFormData] = useState({
    profileImage: '',
    firstName: '',
    lastName: '',
    artistName: '',
    phoneNumber: '',
    emailAddress: '',
    bio: '',
    primaryGenre: '',
    location: '',
    socialMedia: {
      instagram: '',
      youtube: '',
      spotify: '',
      website: '',
      tiktok: '',
      linkedin: '',
      facebook: '',
      twitter: ''
    },
    kyc: {
      documents: {
        aadhaar: {
          number: '',
        },
        pan: {
          number: '',
        }
      },
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
      },
      upiDetails: {
        upiId: '',
      },
      status: 'unverified',
    },
    subscription: {
      plan: '',
      price: '',
      period: 'per month',
      status: 'Active',
      startDate: '',
      endDate: '',
      paymentMethod: '•••• 1234',
      nextBilling: '',
      autoRenewal: true,
      features: []
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  // Transform feature object to array
  const transformFeatures = (features) => {
    if (!features) return [];
    return Object.entries(features)
      .filter(([key, value]) => value === true || (typeof value === 'object' && value.description))
      .map(([key]) => {
        return key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      });
  };

  // Populate form data when user and subscription data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailAddress: user.emailAddress || '',
        // artistName is nested under artistData
        artistName: user.artistData?.artistName || user.artistName || '',
        phoneNumber: user.phoneNumber?.internationalNumber || '',
        // bio, primaryGenre, location are nested under profile
        bio: user.profile?.bio || '',
        primaryGenre: user.profile?.primaryGenre || '',
        location: user.profile?.location?.address || '',
        // Show existing photo from backend
        profileImage: user.profile?.photo || null,
        socialMedia: {
          instagram: user.socialMedia?.instagram || '',
          youtube: user.socialMedia?.youtube || '',
          spotify: user.socialMedia?.spotify || '',
          website: user.socialMedia?.website || '',
          tiktok: user.socialMedia?.tiktok || '',
          linkedin: user.socialMedia?.linkedin || '',
          facebook: user.socialMedia?.facebook || '',
          twitter: user.socialMedia?.twitter || ''
        },
        kyc: {
          ...prev.kyc,
          documents: {
            aadhaar: { number: user.kyc?.documents?.aadhaar?.number || '' },
            pan: { number: user.kyc?.documents?.pan?.number || '' }
          },
          bankDetails: {
            accountNumber: user.kyc?.bankDetails?.accountNumber || '',
            ifscCode: user.kyc?.bankDetails?.ifscCode || '',
            accountHolderName: user.kyc?.bankDetails?.accountHolderName || '',
            bankName: user.kyc?.bankDetails?.bankName || '',
          },
          upiDetails: {
            upiId: user.kyc?.upiDetails?.upiId || '',
          },
          status: user.kyc?.status || 'unverified'
        },
      }));
    }
  }, [user]);

  // Update subscription data when API response is received
  useEffect(() => {
    if (currentSubData?.data && allPlansData?.data) {
      const currentPlan = currentSubData.data.plan || {};
      const subscription = currentSubData.data.subscription || {};

      setFormData(prev => ({
        ...prev,
        subscription: {
          plan: currentPlan.name || '',
          price: `₹${currentPlan.price?.current || '0'}`,
          period: 'per month',
          status: subscription.status === 'active' ? 'Active' : 'Inactive',
          startDate: formatDate(subscription.validFrom),
          endDate: formatDate(subscription.validUntil),
          paymentMethod: '•••• 1234',
          nextBilling: formatDate(subscription.nextPaymentDate) || formatDate(subscription.validUntil),
          autoRenewal: subscription.autoRenewal || false,
          features: transformFeatures(currentPlan.features),
        }
      }));
    }
  }, [currentSubData, allPlansData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleKycChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      kyc: {
        ...prev.kyc,
        [section]: {
          ...prev.kyc[section],
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeBytes = 5 * 1024 * 1024;

    if (!file) return;

    if (file.size > maxSizeBytes) {
      showToast.error('The selected image is too large. Please select an image less than 5 MB.');
      return;
    }

    // Show a local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setProfileImage(e.target.result);
    reader.readAsDataURL(file);

    try {
      // Upload to ImageKit and get CDN URL
      const uploadResponse = await uploadToImageKit(file, 'profile-photos');
      const imageUrl = uploadResponse.url;
      
      // Save the CDN URL in formData so Save Changes can send it to backend
      setProfileImage(imageUrl);
      handleInputChange('profileImage', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Reset preview if upload failed
      setProfileImage(null);
      handleInputChange('profileImage', '');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profilePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        profile: {
          bio: formData.bio,
          primaryGenre: formData.primaryGenre,
          location: {
            address: formData.location
          },
          // Only include photo if it's an actual URL (not a local base64 blob)
          ...(formData.profileImage && !formData.profileImage.startsWith('data:') && {
            photo: formData.profileImage
          })
        },
        ...(formData.artistName && {
          artistData: {
            artistName: formData.artistName
          }
        })
      };
      
      const response = await updateProfile(profilePayload);
      
      if (response && response.data && response.data.user) {
         useAuthStore.getState().setUser(response.data.user);
      }
      
      showToast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast.error(error?.response?.data?.message || 'Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocialMedia = async () => {
    setSaving(true);
    try {
      const response = await updateSocialMedia(formData.socialMedia);
      showToast.success('Social media links saved successfully!');
    } catch (error) {
      console.error('Error saving social media:', error);
      showToast.error(error?.response?.data?.message || 'Error saving social media links. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKyc = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving KYC data:', formData.kyc);
      alert('KYC details saved successfully!');
    } catch (error) {
      console.error('Error saving KYC:', error);
      alert('Error saving KYC details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <Card className="border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <Button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="text-white bg-purple-600 hover:bg-purple-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage || formData.profileImage} />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </label>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current.click()} className="border-slate-600">
                  Upload New Photo
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-600"
                  onClick={() => {
                    setProfileImage(null);
                    handleInputChange('profileImage', '');
                  }}
                >
                  Remove Photo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Artist"
                className="border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Name"
                className="border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stage/Artist Name</label>
              <Input
                value={formData.artistName}
                onChange={(e) => handleInputChange('artistName', e.target.value)}
                placeholder="Artist Name"
                className="border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+91 98765 43210"
                className="border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                placeholder="your@email.com"
                className="border-slate-700"
                disabled
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Passionate musician creating unique sounds and connecting with fans worldwide."
              className="border-slate-700 min-h-[100px]"
            />
          </div>

          {/* Primary Genre and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Genre</label>
              <Select 
                value={formData.primaryGenre} 
                onValueChange={(value) => handleInputChange('primaryGenre', value)}
              >
                <SelectTrigger className="border-slate-700">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="blues">Blues</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Mumbai, India"
                className="border-slate-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links Section */}
      <Card className="border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            <CardTitle>Social Media Links</CardTitle>
          </div>
          <Button 
            onClick={handleSaveSocialMedia}
            disabled={saving}
            className="text-white bg-purple-600 hover:bg-purple-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram</label>
            <Input
              value={formData.socialMedia.instagram}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube</label>
            <Input
              value={formData.socialMedia.youtube}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              placeholder="https://youtube.com/yourchannel"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Spotify Artist Profile</label>
            <Input
              value={formData.socialMedia.spotify}
              onChange={(e) => handleSocialMediaChange('spotify', e.target.value)}
              placeholder="https://open.spotify.com/artist/..."
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Personal Website</label>
            <Input
              value={formData.socialMedia.website}
              onChange={(e) => handleSocialMediaChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Facebook</label>
            <Input
              value={formData.socialMedia.facebook}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              placeholder="https://facebook.com/yourprofile"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter / X</label>
            <Input
              value={formData.socialMedia.twitter}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              placeholder="https://twitter.com/yourhandle"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">TikTok</label>
            <Input
              value={formData.socialMedia.tiktok}
              onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@yourhandle"
              className="border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn</label>
            <Input
              value={formData.socialMedia.linkedin}
              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* KYC Details Section */}
      <Card className="border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>KYC Details</CardTitle>
            <Badge className="bg-green-600 text-white">
              {formData.kyc.status === 'verified' ? 'Verified' : formData.kyc.status.charAt(0).toUpperCase() + formData.kyc.status.slice(1)}
            </Badge>
          </div>
          <Button 
            onClick={handleSaveKyc}
            disabled={saving || formData.kyc.status === 'approved'}
            className="text-white bg-purple-600 hover:bg-purple-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhaar Number</label>
              <Input
                value={formData.kyc.documents.aadhaar.number}
                onChange={(e) => handleKycChange('documents', 'aadhaar', { ...formData.kyc.documents.aadhaar, number: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PAN Card Number</label>
              <Input
                value={formData.kyc.documents.pan.number}
                onChange={(e) => handleKycChange('documents', 'pan', { ...formData.kyc.documents.pan, number: e.target.value })}
                placeholder="ABCDE1234F"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <Input
                value={formData.kyc.bankDetails.accountHolderName}
                onChange={(e) => handleKycChange('bankDetails', 'accountHolderName', e.target.value)}
                placeholder="John Doe"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Number</label>
              <Input
                value={formData.kyc.bankDetails.accountNumber}
                onChange={(e) => handleKycChange('bankDetails', 'accountNumber', e.target.value)}
                placeholder="1234567890123456"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">IFSC Code</label>
              <Input
                value={formData.kyc.bankDetails.ifscCode}
                onChange={(e) => handleKycChange('bankDetails', 'ifscCode', e.target.value)}
                placeholder="HDFC0000123"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Name</label>
              <Input
                value={formData.kyc.bankDetails.bankName}
                onChange={(e) => handleKycChange('bankDetails', 'bankName', e.target.value)}
                placeholder="HDFC Bank"
                className="border-slate-700"
                disabled={formData.kyc.status === 'verified'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card className="border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Current Subscription</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Manage your subscription plan and billing information</p>
        </CardHeader>
        <CardContent>
          {currentSubLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{formData.subscription.plan}</h3>
                    <p className="text-purple-100">Access to all premium features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{formData.subscription.price}</div>
                    <div className="text-purple-100">{formData.subscription.period}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span>Started: {formData.subscription.startDate}</span>
                  <span>Ends: {formData.subscription.endDate}</span>
                  <Badge className="bg-green-500 text-white">{formData.subscription.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Plan Features</h4>
                  <ul className="space-y-2 text-sm">
                    {formData.subscription.features.slice(0, 8).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                    {formData.subscription.features.length > 8 && (
                      <li className="text-purple-600 font-semibold">
                        +{formData.subscription.features.length - 8} more features
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Billing Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{formData.subscription.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span>{formData.subscription.nextBilling}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-renewal:</span>
                      <span>{formData.subscription.autoRenewal ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <Button className="bg-purple-600 text-white hover:bg-purple-700 flex-1">
                  Upgrade Plan
                </Button>
                <Button variant="outline" className="border-slate-600">
                  Manage Billing
                </Button>
                <Button variant="outline" className="border-slate-600 text-red-400 hover:text-red-300">
                  Cancel Subscription
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Available Plans Section */}
      <Card className="border-slate-700">
        <CardHeader>
          <h2 className="text-2xl font-bold">Available Plans</h2>
          <p className="text-muted-foreground">Choose the plan that best fits your needs</p>
        </CardHeader>
        <CardContent>
          {allPlansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allPlansData?.data?.map((plan) => (
                <Card key={plan.planId} className="border-slate-700 p-6 relative">
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 m-3 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                      Popular
                    </div>
                  )}
                  {plan.isBestValue && (
                    <div className="absolute top-0 left-0 m-3 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      Best Value
                    </div>
                  )}
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                    <p className="text-4xl font-bold text-purple-600">
                      ₹{plan.price.current}
                      <span className="text-base font-normal text-muted-foreground"> per {plan.interval}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="p-0 space-y-2">
                    <ul className="space-y-2">
                      {Object.entries(plan.features)
                        .filter(([key, value]) => value === true)
                        .slice(0, 5)
                        .map(([key], index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim()}
                          </li>
                        ))}
                    </ul>
                    <Button 
                      className={`w-full mt-4 ${
                        currentSubData?.data?.subscription?.planId === plan.planId
                          ? 'bg-slate-800 cursor-not-allowed text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                      disabled={currentSubData?.data?.subscription?.planId === plan.planId}
                    >
                      {currentSubData?.data?.subscription?.planId === plan.planId ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;