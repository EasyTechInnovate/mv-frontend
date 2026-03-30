import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Link, Shield, CreditCard, Loader, IndianRupee, Wallet, ArrowUp, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { getMySubscription, getAllSubscriptionPlans, updateProfile, updateSocialMedia, verifyKYC, createPaymentIntent, verifyPayment } from '@/services/api.services';
import { showToast } from '@/utils/toast';
import { uploadToImageKit } from '@/utils/imagekitUploader';
import { useNavigate } from 'react-router-dom';

const GENRE_LIST = [
  "alternative", "alternative_rock", "alternative_and_rock_latino", "anime", "baladas_y_boleros", 
  "big_band", "blues", "brazilian", "c_pop", "cantopop_hk_pop", "childrens", "chinese", 
  "christian", "classical", "comedy", "contemporary_latin", "country", "dance", 
  "easy_listening", "educational", "electronic", "enka", "experimental", 
  "fitness_and_workout", "folk", "french_pop", "german_pop", "german_folk", 
  "hip_hop_rap", "holiday", "instrumental", "indo_pop", "inspirational", 
  "indian", "indian_pop", "indian_rap", "indian_folk", "indian_bollywood", 
  "indian_devotional_and_spiritual", "indian_fusion", "indian_gazal", 
  "indian_classical_vocal", "indian_dance", "indian_electronic", "jazz", 
  "j_pop", "k_pop", "karaoke", "latin_jazz", "metal", "new_age", "opera", 
  "pop", "punk", "r_and_b", "reggae", "reggaeton_y_hip_hop", "regional_mexicano", 
  "rock", "salas_y_topical", "soul", "soundtrack", "spoken_word", "thai_pop", 
  "trot", "vocal_nostalgia", "world"
];

function formatGenreLabel(genre) {
  return genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const Profile = () => {
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const openRazorpay = async (checkoutData, planId) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      showToast.error('Failed to load payment SDK. Please try again.');
      setIsUpgrading(false);
      return;
    }
    const options = {
      key: checkoutData.razorpayKeyId,
      amount: checkoutData.chargeAmount * 100,
      currency: checkoutData.currency,
      name: 'Maheshwari Visuals',
      description: checkoutData.isUpgrade
        ? `Upgrade to ${checkoutData.planName} (₹${checkoutData.prorationCredit} credit applied)`
        : `Subscription to ${checkoutData.planName}`,
      order_id: checkoutData.razorpayOrderId,
      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.emailAddress || '',
      },
      theme: { color: '#652CD6' },
      handler: async (razorpayResponse) => {
        try {
          await verifyPayment({
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            planId,
          });
          showToast.success('Payment successful! Subscription activated.');
          queryClient.invalidateQueries({ queryKey: ['mySubscription'] });
          queryClient.invalidateQueries({ queryKey: ['allSubscriptionPlans'] });
        } catch {
          showToast.error('Payment verification failed. Please contact support.');
        }
      },
      modal: { ondismiss: () => setIsUpgrading(false) },
    };
    new window.Razorpay(options).open();
  };

  const handleUpgrade = async (planId) => {
    try {
      setIsUpgrading(true);
      const response = await createPaymentIntent({ planId });
      if (!response.success) {
        showToast.error(response.message || 'Failed to initiate payment');
        setIsUpgrading(false);
        return;
      }
      const checkoutData = response.data;

      if (checkoutData.isUpgrade && checkoutData.prorationCredit > 0) {
        setUpgradeDialog({ checkoutData, planId });
        setIsUpgrading(false);
        return;
      }

      await openRazorpay(checkoutData, planId);
    } catch (err) {
      showToast.error(err.response?.data?.message || err.message || 'Failed to initiate payment.');
      setIsUpgrading(false);
    }
  };

  const handleUpgradeConfirm = async () => {
    const { checkoutData, planId } = upgradeDialog;
    setUpgradeDialog(null);
    setIsUpgrading(true);
    await openRazorpay(checkoutData, planId);
  };

  const fileInputRef = useRef(null);

  // Fetch current subscription
  const { data: currentSubData, isLoading: currentSubLoading } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000,
  });

  const userTargetType = user?.userType === 'label' ? 'label' : user?.userType === 'artist' ? 'artist' : 'everyone';

  // Fetch all subscription plans filtered by user type
  const { data: allPlansData, isLoading: allPlansLoading } = useQuery({
    queryKey: ['allSubscriptionPlans', userTargetType],
    queryFn: () => getAllSubscriptionPlans(userTargetType),
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
    accountId: '',
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
      residencyType: 'indian',
      details: {
        aadhaarNumber: '',
        panNumber: '',
        gstUdhyamNumber: '',
        passportNumber: '',
        vatNumber: '',
      },
      status: 'unverified',
    },
    payoutMethods: {
      bank: { accountNumber: '', ifscSwiftCode: '', accountHolderName: '', bankName: '', verified: false },
      upi: { upiId: '', accountHolderName: '', verified: false },
      paypal: { paypalEmail: '', accountName: '', verified: false },
      primaryMethod: 'bank'
    },
    subscription: {
      plan: '',
      price: '',
      period: 'per month',
      status: 'Active',
      startDate: '',
      endDate: '',
      autoRenewal: false,
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
        accountId: user.accountId || '',
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
          residencyType: user.kyc?.residencyType || 'indian',
          details: {
            aadhaarNumber: user.kyc?.details?.aadhaarNumber || '',
            panNumber: user.kyc?.details?.panNumber || '',
            gstUdhyamNumber: user.kyc?.details?.gstUdhyamNumber || '',
            passportNumber: user.kyc?.details?.passportNumber || '',
            vatNumber: user.kyc?.details?.vatNumber || '',
          },
          status: user.kyc?.status || 'unverified'
        },
        payoutMethods: {
          bank: {
            accountNumber: user.payoutMethods?.bank?.accountNumber || '',
            ifscSwiftCode: user.payoutMethods?.bank?.ifscSwiftCode || '',
            accountHolderName: user.payoutMethods?.bank?.accountHolderName || '',
            bankName: user.payoutMethods?.bank?.bankName || '',
            verified: user.payoutMethods?.bank?.verified || false
          },
          upi: {
            upiId: user.payoutMethods?.upi?.upiId || '',
            accountHolderName: user.payoutMethods?.upi?.accountHolderName || '',
            verified: user.payoutMethods?.upi?.verified || false
          },
          paypal: {
            paypalEmail: user.payoutMethods?.paypal?.paypalEmail || '',
            accountName: user.payoutMethods?.paypal?.accountName || '',
            verified: user.payoutMethods?.paypal?.verified || false
          },
          primaryMethod: user.payoutMethods?.primaryMethod || 'bank'
        }
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
          autoRenewal: subscription.autoRenewal || false,
          features: currentPlan.showcaseFeatures?.length > 0
            ? currentPlan.showcaseFeatures.filter(f => f.included !== false).map(f => f.text)
            : transformFeatures(currentPlan.features),
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
    setFormData(prev => {
      const updatedKyc = { ...prev.kyc };
      if (section === 'root') {
        updatedKyc[field] = value;
      } else {
        updatedKyc[section] = {
          ...prev.kyc[section],
          [field]: value
        };
      }
      return {
        ...prev,
        kyc: updatedKyc
      };
    });
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

  const handlePayoutChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      payoutMethods: {
        ...prev.payoutMethods,
        [section]: {
          ...prev.payoutMethods[section],
          [field]: value
        }
      }
    }));
  };

  const handleSaveKyc = async () => {
    const { residencyType, details } = formData.kyc;

    // Validation
    if (residencyType === 'indian') {
      if (!details.aadhaarNumber || !/^\d{12}$/.test(details.aadhaarNumber)) {
        showToast.error('Please enter a valid 12-digit Aadhaar Number');
        return;
      }
      if (details.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(details.panNumber.toUpperCase())) {
        showToast.error('Please enter a valid PAN Number (e.g., ABCDE1234F)');
        return;
      }
    } else {
      if (!details.passportNumber || details.passportNumber.length < 6) {
        showToast.error('Please enter a valid Passport Number (min 6 characters)');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        residencyType: formData.kyc.residencyType,
        details: formData.kyc.details,
      };
      
      const response = await verifyKYC(payload);
      
      if (response && response.data && response.data.kyc) {
        setFormData(prev => ({
          ...prev,
          kyc: {
            ...prev.kyc,
            ...response.data.kyc
          }
        }));
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            kyc: response.data.kyc
          });
        }
      }
      
      showToast.success('KYC details submitted for review!');
    } catch (error) {
      console.error('Error saving KYC:', error);
      showToast.error(error?.response?.data?.message || 'Error saving KYC details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayouts = async (method) => {
    // Validation
    if (method === 'bank') {
      const { accountNumber, ifscSwiftCode } = formData.payoutMethods.bank;
      if (accountNumber && !/^\d{9,18}$/.test(accountNumber)) {
        showToast.error('Please enter a valid Bank Account Number (9-18 digits)');
        return;
      }
      if (ifscSwiftCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscSwiftCode.toUpperCase())) {
        showToast.error('Please enter a valid 11-character IFSC/SWIFT Code');
        return;
      }
    } else if (method === 'upi') {
      const { upiId } = formData.payoutMethods.upi;
      if (upiId && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        showToast.error('Please enter a valid UPI ID');
        return;
      }
    } else if (method === 'paypal') {
        const { paypalEmail } = formData.payoutMethods.paypal;
        if (paypalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
            showToast.error('Please enter a valid PayPal Email');
            return;
        }
    }

    setSaving(true);
    try {
      const payload = { [method]: formData.payoutMethods[method] };
      const response = await updatePayoutMethods(payload);
      
      if (response.success) {
        showToast.success(`${method.toUpperCase()} details updated!`);
        // Refresh local user state if needed
      } else {
        showToast.error(response.message || 'Error updating payout details.');
      }
    } catch (error) {
      showToast.error('Error saving payout details.');
    } finally {
      setSaving(false);
    }
  };

  const isKycLocked = formData.kyc.status !== 'unverified';

  return (
    <div className="space-y-8">
      {/* Upgrade Confirmation Dialog */}
      <Dialog open={!!upgradeDialog} onOpenChange={(open) => { if (!open) setUpgradeDialog(null); }}>
        <DialogContent className="sm:max-w-md border-slate-700 bg-[#0f1117]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ArrowUp className="w-5 h-5 text-purple-500" />
              Confirm Plan Upgrade
            </DialogTitle>
          </DialogHeader>
          {upgradeDialog && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>New plan price</span>
                  <span className="text-white font-medium">₹{upgradeDialog.checkoutData.originalAmount}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Credit from current plan
                  </span>
                  <span className="font-medium">−₹{upgradeDialog.checkoutData.prorationCredit}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-semibold text-base">
                  <span>You pay today</span>
                  <span className="text-purple-400">₹{upgradeDialog.checkoutData.chargeAmount}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your new plan activates immediately and runs for a fresh billing period.
                Unused days from your current plan are credited above.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-slate-600" onClick={() => setUpgradeDialog(null)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleUpgradeConfirm}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account ID</label>
              <Input
                value={formData.accountId}
                placeholder="MV-XXXXXX"
                className="border-slate-700 font-mono"
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
                   {GENRE_LIST.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {formatGenreLabel(genre)}
                    </SelectItem>
                  ))}
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
            <Badge className={`text-white ${
              formData.kyc.status === 'verified' ? 'bg-green-600' : 
              formData.kyc.status === 'pending' ? 'bg-yellow-600' :
              formData.kyc.status === 'rejected' ? 'bg-red-600' :
              'bg-slate-600'
            }`}>
              {formData.kyc.status.charAt(0).toUpperCase() + formData.kyc.status.slice(1)}
            </Badge>
          </div>
          {isKycLocked ? (
            <div className="text-sm font-medium text-purple-400">
              To update KYC, please contact support.
            </div>
          ) : (
            <Button 
              onClick={handleSaveKyc}
              disabled={saving}
              className="text-white bg-purple-600 hover:bg-purple-700"
            >
              {saving ? 'Submitting...' : 'Submit KYC'}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Residency Type</label>
              <Select 
                value={formData.kyc.residencyType} 
                onValueChange={(value) => handleKycChange('root', 'residencyType', value)}
                disabled={isKycLocked}
              >
                <SelectTrigger className="border-slate-700 focus:ring-purple-600 focus:ring-offset-0">
                  <SelectValue placeholder="Select residency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indian">Indian Resident</SelectItem>
                  <SelectItem value="foreign">Foreign Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {formData.kyc.residencyType === 'indian' ? (
                <div className="contents animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aadhaar Number (Mandatory)</label>
                    <Input
                      value={formData.kyc.details.aadhaarNumber}
                      onChange={(e) => handleKycChange('details', 'aadhaarNumber', e.target.value)}
                      placeholder="1234 5678 9012"
                      className="border-slate-700"
                      disabled={isKycLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PAN Number</label>
                    <Input
                      value={formData.kyc.details.panNumber}
                      onChange={(e) => handleKycChange('details', 'panNumber', e.target.value)}
                      placeholder="ABCDE1234F"
                      className="border-slate-700"
                      disabled={isKycLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GST / Udhyam Registration Number</label>
                    <Input
                      value={formData.kyc.details.gstUdhyamNumber}
                      onChange={(e) => handleKycChange('details', 'gstUdhyamNumber', e.target.value)}
                      placeholder="27ABCDE1234F1Z5"
                      className="border-slate-700"
                      disabled={isKycLocked}
                    />
                  </div>
                </div>
              ) : (
                <div className="contents animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passport Number (Mandatory)</label>
                    <Input
                      value={formData.kyc.details.passportNumber}
                      onChange={(e) => handleKycChange('details', 'passportNumber', e.target.value)}
                      placeholder="E1234567"
                      className="border-slate-700"
                      disabled={isKycLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">VAT Registration Number</label>
                    <Input
                      value={formData.kyc.details.vatNumber}
                      onChange={(e) => handleKycChange('details', 'vatNumber', e.target.value)}
                      placeholder="VAT123456789"
                      className="border-slate-700"
                      disabled={isKycLocked}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Methods Section */}
      <Card className="border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Payout Methods</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mr-auto ml-2">Manage your payout destinations</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Bank Account */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-500" /> Bank Transfer
                </h3>
                {formData.payoutMethods.bank.verified && <Badge className="bg-green-600 text-white">Verified</Badge>}
                <Button onClick={() => handleSavePayouts('bank')} disabled={saving} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Save Bank Details
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Account Holder Name</label>
                    <Input
                        value={formData.payoutMethods.bank.accountHolderName}
                        onChange={(e) => handlePayoutChange('bank', 'accountHolderName', e.target.value)}
                        placeholder="John Doe"
                        className="border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Bank Name</label>
                    <Input
                        value={formData.payoutMethods.bank.bankName}
                        onChange={(e) => handlePayoutChange('bank', 'bankName', e.target.value)}
                        placeholder="HDFC Bank"
                        className="border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Account Number</label>
                    <Input
                        value={formData.payoutMethods.bank.accountNumber}
                        onChange={(e) => handlePayoutChange('bank', 'accountNumber', e.target.value)}
                        placeholder="1234567890"
                        className="border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">IFSC / SWIFT Code</label>
                    <Input
                        value={formData.payoutMethods.bank.ifscSwiftCode}
                        onChange={(e) => handlePayoutChange('bank', 'ifscSwiftCode', e.target.value)}
                        placeholder="HDFC0001234"
                        className="border-slate-700"
                    />
                </div>
            </div>
          </div>

          {/* UPI */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-purple-500" /> UPI ID
                </h3>
                {formData.payoutMethods.upi.verified && <Badge className="bg-green-600 text-white">Verified</Badge>}
                <Button onClick={() => handleSavePayouts('upi')} disabled={saving} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Save UPI
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">UPI ID</label>
                    <Input
                        value={formData.payoutMethods.upi.upiId}
                        onChange={(e) => handlePayoutChange('upi', 'upiId', e.target.value)}
                        placeholder="artist@upi"
                        className="border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Account Holder Name</label>
                    <Input
                        value={formData.payoutMethods.upi.accountHolderName}
                        onChange={(e) => handlePayoutChange('upi', 'accountHolderName', e.target.value)}
                        placeholder="John Doe"
                        className="border-slate-700"
                    />
                </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" /> PayPal
                </h3>
                {formData.payoutMethods.paypal.verified && <Badge className="bg-green-600 text-white">Verified</Badge>}
                <Button onClick={() => handleSavePayouts('paypal')} disabled={saving} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Save PayPal
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">PayPal Email</label>
                    <Input
                        type="email"
                        value={formData.payoutMethods.paypal.paypalEmail}
                        onChange={(e) => handlePayoutChange('paypal', 'paypalEmail', e.target.value)}
                        placeholder="artist@email.com"
                        className="border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Account Name</label>
                    <Input
                        value={formData.payoutMethods.paypal.accountName}
                        onChange={(e) => handlePayoutChange('paypal', 'accountName', e.target.value)}
                        placeholder="John Doe"
                        className="border-slate-700"
                    />
                </div>
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
                      <span>Auto-renewal:</span>
                      <span>{formData.subscription.autoRenewal ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700 flex-1"
                  disabled={isUpgrading}
                  onClick={() => navigate('/app/plan')}
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600"
                  onClick={() => navigate('/app/settings?tab=billing')}
                >
                  Manage Billing
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
                    {(() => {
                      const currentSub = currentSubData?.data?.subscription;
                      const currentPlan = currentSubData?.data?.plan;
                      if (
                        currentSub?.planId &&
                        currentSub.planId !== plan.planId &&
                        currentSub.status === 'active' &&
                        currentPlan?.price?.current &&
                        plan.price.current > currentPlan.price.current
                      ) {
                        const daysRemaining = Math.max(0, Math.ceil((new Date(currentSub.validUntil) - new Date()) / (1000 * 60 * 60 * 24)));
                        const totalDays = 90;
                        const credit = Math.round((currentPlan.price.current / totalDays) * daysRemaining);
                        const youPay = Math.max(1, plan.price.current - credit);
                        return (
                          <p className="text-sm text-green-500 mt-1">
                            Today you pay ₹{youPay} <span className="text-muted-foreground">(₹{credit} credit applied)</span>
                          </p>
                        );
                      }
                      return null;
                    })()}
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
                    {(() => {
                      const currentPlanId = currentSubData?.data?.subscription?.planId;
                      const currentPrice = currentSubData?.data?.plan?.price?.current ?? 0;
                      const isCurrent = currentPlanId === plan.planId;
                      const isDowngrade = !isCurrent && plan.price.current <= currentPrice && !!currentPlanId;

                      if (isCurrent) {
                        return (
                          <Button className="w-full mt-4 bg-slate-800 cursor-not-allowed text-white" disabled>
                            Current Plan
                          </Button>
                        );
                      }
                      if (isDowngrade) {
                        return null;
                      }
                      return (
                        <Button
                          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={isUpgrading}
                          onClick={() => handleUpgrade(plan.planId)}
                        >
                          {isUpgrading ? 'Processing...' : 'Upgrade'}
                        </Button>
                      );
                    })()}
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