import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

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

export default function EditProfileModal({ isOpen, onClose, user, theme, onSuccess }) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: {
      isoCode: "",
      countryCode: "",
      internationalNumber: ""
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: ""
    },
    profile: {
      bio: "",
      primaryGenre: ""
    },
    artistData: {
      artistName: "",
      youtubeLink: "",
      instagramLink: "",
      facebookLink: ""
    },
    labelData: {
      labelName: "",
      youtubeLink: "",
      websiteLink: "",
      popularReleaseLink: "",
      popularArtistLinks: [""],
      briefInfo: "",
      totalReleases: 0,
      releaseFrequency: "",
      monthlyReleasePlans: 0
    },
    aggregatorData: {
      companyName: "",
      youtubeLink: "",
      websiteLink: "",
      instagramUrl: "",
      facebookUrl: "",
      linkedinUrl: "",
      popularReleaseLinks: [""],
      popularArtistLinks: [""],
      associatedLabels: [""],
      totalReleases: 0,
      releaseFrequency: "",
      monthlyReleasePlans: 0,
      additionalServices: [],
      howDidYouKnow: "",
      howDidYouKnowOther: ""
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailAddress: user.emailAddress || "",
        phoneNumber: {
          isoCode: user.phoneNumber?.isoCode || "",
          countryCode: user.phoneNumber?.countryCode || "",
          internationalNumber: user.phoneNumber?.internationalNumber || ""
        },
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
          pinCode: user.address?.pinCode || ""
        },
        profile: {
          bio: user.profile?.bio || "",
          primaryGenre: user.profile?.primaryGenre || ""
        },
        artistData: {
          artistName: user.artistData?.artistName || "",
          youtubeLink: user.artistData?.youtubeLink || "",
          instagramLink: user.artistData?.instagramLink || "",
          facebookLink: user.artistData?.facebookLink || ""
        },
        labelData: {
          labelName: user.labelData?.labelName || "",
          youtubeLink: user.labelData?.youtubeLink || "",
          websiteLink: user.labelData?.websiteLink || "",
          popularReleaseLink: user.labelData?.popularReleaseLink || "",
          popularArtistLinks: user.labelData?.popularArtistLinks?.length > 0 ? user.labelData.popularArtistLinks : [""],
          briefInfo: user.labelData?.briefInfo || "",
          totalReleases: user.labelData?.totalReleases || 0,
          releaseFrequency: user.labelData?.releaseFrequency || "",
          monthlyReleasePlans: user.labelData?.monthlyReleasePlans || 0
        },
        aggregatorData: {
          companyName: user.aggregatorData?.companyName || "",
          youtubeLink: user.aggregatorData?.youtubeLink || "",
          websiteLink: user.aggregatorData?.websiteLink || "",
          instagramUrl: user.aggregatorData?.instagramUrl || "",
          facebookUrl: user.aggregatorData?.facebookUrl || "",
          linkedinUrl: user.aggregatorData?.linkedinUrl || "",
          popularReleaseLinks: user.aggregatorData?.popularReleaseLinks?.length > 0 ? user.aggregatorData.popularReleaseLinks : [""],
          popularArtistLinks: user.aggregatorData?.popularArtistLinks?.length > 0 ? user.aggregatorData.popularArtistLinks : [""],
          associatedLabels: user.aggregatorData?.associatedLabels?.length > 0 ? user.aggregatorData.associatedLabels : [""],
          briefInfo: user.aggregatorData?.briefInfo || "",
          totalReleases: user.aggregatorData?.totalReleases || 0,
          releaseFrequency: user.aggregatorData?.releaseFrequency || "",
          monthlyReleasePlans: user.aggregatorData?.monthlyReleasePlans || 0,
          additionalServices: user.aggregatorData?.additionalServices || [],
          howDidYouKnow: user.aggregatorData?.howDidYouKnow || "",
          howDidYouKnowOther: user.aggregatorData?.howDidYouKnowOther || ""
        }
      });
    }
  }, [user, isOpen]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      // Clean up empty fields and format payload based on user type
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profile: formData.profile
      };

      if (user?.userType === 'label') {
        payload.labelData = {
          ...formData.labelData,
          popularArtistLinks: formData.labelData.popularArtistLinks.filter(l => l.trim() !== ""),
          totalReleases: Number(formData.labelData.totalReleases),
          monthlyReleasePlans: Number(formData.labelData.monthlyReleasePlans)
        };
      } else if (user?.userType === 'aggregator') {
        payload.aggregatorData = {
          ...formData.aggregatorData,
          popularReleaseLinks: formData.aggregatorData.popularReleaseLinks.filter(l => l.trim() !== ""),
          popularArtistLinks: formData.aggregatorData.popularArtistLinks.filter(l => l.trim() !== ""),
          associatedLabels: formData.aggregatorData.associatedLabels.filter(l => l.trim() !== ""),
          totalReleases: Number(formData.aggregatorData.totalReleases),
          monthlyReleasePlans: Number(formData.aggregatorData.monthlyReleasePlans)
        };
      } else if (user?.userType === 'artist') {
        payload.artistData = {
          ...formData.artistData
        };
      }

      await GlobalApi.updateUserProfile(user._id, payload);
      toast.success("Profile updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (section, subSection, field, value) => {
    if (!section) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (subSection) {
       // Just in case we need deeper nesting
       setFormData(prev => ({
          ...prev,
          [section]: {
             ...prev[section],
             [subSection]: {
               ...prev[section][subSection],
               [field]: value
             }
          }
       }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-3xl rounded-xl focus:ring-0 focus-visible:ring-0 outline-none ${
          isDark
            ? "bg-[#151F28] text-gray-200 border border-gray-700"
            : "bg-white text-gray-800"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Profile - {user?.firstName} {user?.lastName} ({user?.userType?.toUpperCase()})
          </DialogTitle>
          <DialogDescription
            className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Update detailed profile information for this user.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-2">
          <TabsList className={`grid w-full grid-cols-4 ${isDark ? 'bg-[#111A22]' : 'bg-gray-100'}`}>
            <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Basic</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Contact & Loc</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Socials</TabsTrigger>
            <TabsTrigger value="specific" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">{user?.userType === 'artist' ? 'Artist' : user?.userType === 'label' ? 'Label' : 'Aggregator'} Data</TabsTrigger>
            {user?.userType === 'aggregator' && <TabsTrigger value="marketing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Marketing</TabsTrigger>}
          </TabsList>
          
          <ScrollArea className="h-[50vh] mt-4 pr-4">
            
            {/* 1. Basic Information */}
            <TabsContent value="basic" className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange(null, null, "firstName", e.target.value)}
                    className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange(null, null, "lastName", e.target.value)}
                    className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleFieldChange(null, null, "emailAddress", e.target.value)}
                    className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                    placeholder="Careful: changing email may affect user login!"
                  />
                </div>
                <div className="space-y-1 col-span-2 mt-4">
                  <label className="text-sm font-medium">Bio</label>
                  <Input
                    value={formData.profile.bio}
                    onChange={(e) => handleFieldChange("profile", null, "bio", e.target.value)}
                    className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Primary Genre</label>
                  <select
                    value={formData.profile.primaryGenre}
                    onChange={(e) => handleFieldChange("profile", null, "primaryGenre", e.target.value)}
                    className={`w-full rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#111A22] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
                  >
                    <option value="">Select Genre</option>
                    {GENRE_LIST.map(genre => (
                      <option key={genre} value={genre}>
                        {formatGenreLabel(genre)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>

            {/* 2. Contact & Location */}
            <TabsContent value="contact" className="space-y-4 py-2">
              <div className="border-b border-gray-800 pb-4">
                 <h4 className="text-sm font-bold mb-3 text-purple-400 tracking-wider">Phone Details</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs">Country Code</label>
                      <Input
                        value={formData.phoneNumber.countryCode}
                        onChange={(e) => handleFieldChange("phoneNumber", null, "countryCode", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        placeholder="IN"
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs">International Number</label>
                      <Input
                        value={formData.phoneNumber.internationalNumber}
                        onChange={(e) => handleFieldChange("phoneNumber", null, "internationalNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        placeholder="+91..."
                      />
                    </div>
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-bold mb-3 text-purple-400 tracking-wider">Address</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1 col-span-2">
                      <label className="text-xs">Street</label>
                      <Input
                        value={formData.address.street}
                        onChange={(e) => handleFieldChange("address", null, "street", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">City</label>
                      <Input
                        value={formData.address.city}
                        onChange={(e) => handleFieldChange("address", null, "city", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">State</label>
                      <Input
                        value={formData.address.state}
                        onChange={(e) => handleFieldChange("address", null, "state", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">Country</label>
                      <Input
                        value={formData.address.country}
                        onChange={(e) => handleFieldChange("address", null, "country", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">Pin Code</label>
                      <Input
                        value={formData.address.pinCode}
                        onChange={(e) => handleFieldChange("address", null, "pinCode", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                 </div>
              </div>
            </TabsContent>

            {/* 3. Socials */}
            <TabsContent value="social" className="space-y-4 py-2">
            <h4 className="text-sm font-bold mb-3 text-purple-400 xl">Social Media Links</h4>
               <div className="flex flex-col gap-4">
                  {user?.userType === 'artist' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs">YouTube Link</label>
                        <Input value={formData.artistData.youtubeLink} onChange={(e) => handleFieldChange("artistData", null, "youtubeLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Instagram Link</label>
                        <Input value={formData.artistData.instagramLink} onChange={(e) => handleFieldChange("artistData", null, "instagramLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Facebook Link</label>
                        <Input value={formData.artistData.facebookLink} onChange={(e) => handleFieldChange("artistData", null, "facebookLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                    </>
                  )}
                  {user?.userType === 'label' && (
                     <>
                      <div className="space-y-1">
                        <label className="text-xs">YouTube Link</label>
                        <Input value={formData.labelData.youtubeLink} onChange={(e) => handleFieldChange("labelData", null, "youtubeLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Website Link</label>
                        <Input value={formData.labelData.websiteLink} onChange={(e) => handleFieldChange("labelData", null, "websiteLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                       <div className="space-y-1">
                        <label className="text-xs">Popular Release Link</label>
                        <Input value={formData.labelData.popularReleaseLink} onChange={(e) => handleFieldChange("labelData", null, "popularReleaseLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                       </div>
                       
                       <div className="mt-2">
                         <ArrayInputList 
                           label="Popular Artist Links" 
                           items={formData.labelData.popularArtistLinks} 
                           onChange={(items) => handleFieldChange("labelData", null, "popularArtistLinks", items)}
                           isDark={isDark}
                         />
                       </div>
                      </>
                   )}
                  {user?.userType === 'aggregator' && (
                     <>
                      <div className="space-y-1">
                        <label className="text-xs">YouTube Link</label>
                        <Input value={formData.aggregatorData.youtubeLink} onChange={(e) => handleFieldChange("aggregatorData", null, "youtubeLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Website Link</label>
                        <Input value={formData.aggregatorData.websiteLink} onChange={(e) => handleFieldChange("aggregatorData", null, "websiteLink", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Instagram Link</label>
                        <Input value={formData.aggregatorData.instagramUrl} onChange={(e) => handleFieldChange("aggregatorData", null, "instagramUrl", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Facebook Link</label>
                        <Input value={formData.aggregatorData.facebookUrl} onChange={(e) => handleFieldChange("aggregatorData", null, "facebookUrl", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">LinkedIn Link</label>
                        <Input value={formData.aggregatorData.linkedinUrl} onChange={(e) => handleFieldChange("aggregatorData", null, "linkedinUrl", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                     </>
                  )}
               </div>
            </TabsContent>

            {/* 4. Specific Data */}
            <TabsContent value="specific" className="space-y-4 py-2">
              <h4 className="text-sm font-bold mb-3 text-purple-400 capitalize">{user?.userType} Data</h4>
              
              <div className="grid grid-cols-2 gap-4">
                 {user?.userType === 'artist' && (
                    <div className="space-y-1 col-span-2">
                       <label className="text-xs">Artist/Stage Name</label>
                       <Input value={formData.artistData.artistName} onChange={(e) => handleFieldChange("artistData", null, "artistName", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                    </div>
                 )}
                 {user?.userType === 'label' && (
                    <>
                      <div className="space-y-1 col-span-2">
                       <label className="text-xs">Label Name</label>
                       <Input value={formData.labelData.labelName} onChange={(e) => handleFieldChange("labelData", null, "labelName", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1 col-span-2">
                       <label className="text-xs">Brief Info</label>
                       <Input value={formData.labelData.briefInfo} onChange={(e) => handleFieldChange("labelData", null, "briefInfo", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                       <label className="text-xs">Total Releases</label>
                       <Input type="number" value={formData.labelData.totalReleases} onChange={(e) => handleFieldChange("labelData", null, "totalReleases", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Release Frequency</label>
                        <select
                          value={formData.labelData.releaseFrequency}
                          onChange={(e) => handleFieldChange("labelData", null, "releaseFrequency", e.target.value)}
                          className={`w-full rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#111A22] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Occasionally">Occasionally</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs">Monthly Release Plans</label>
                        <select
                          value={formData.labelData.monthlyReleasePlans}
                          onChange={(e) => handleFieldChange("labelData", null, "monthlyReleasePlans", e.target.value)}
                          className={`w-full rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#111A22] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
                        >
                          <option value="1-5">1-5</option>
                          <option value="5-20">5-20</option>
                          <option value="20+">20+</option>
                        </select>
                      </div>
                    </>
                 )}
                 {user?.userType === 'aggregator' && (
                    <>
                      <div className="space-y-1 col-span-2">
                       <label className="text-xs">Company Name</label>
                       <Input value={formData.aggregatorData.companyName} onChange={(e) => handleFieldChange("aggregatorData", null, "companyName", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1 col-span-2">
                       <label className="text-xs">Brief Info</label>
                       <Input value={formData.aggregatorData.briefInfo} onChange={(e) => handleFieldChange("aggregatorData", null, "briefInfo", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                       <label className="text-xs">Total Releases</label>
                       <Input type="number" value={formData.aggregatorData.totalReleases} onChange={(e) => handleFieldChange("aggregatorData", null, "totalReleases", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1">
                       <label className="text-xs">Release Frequency</label>
                       <Input value={formData.aggregatorData.releaseFrequency} onChange={(e) => handleFieldChange("aggregatorData", null, "releaseFrequency", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      <div className="space-y-1 col-span-2">
                       <label className="text-xs">Monthly Release Plans</label>
                       <Input type="number" value={formData.aggregatorData.monthlyReleasePlans} onChange={(e) => handleFieldChange("aggregatorData", null, "monthlyReleasePlans", e.target.value)} className={isDark ? "bg-[#111A22] border-gray-700" : ""} />
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-400">Additional Services</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: "music_marketing", label: "Music Marketing" },
                            { id: "youtube_cms", label: "YouTube CMS" },
                            { id: "music_video_distribution", label: "Music Video Distribution" }
                          ].map(service => (
                            <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={formData.aggregatorData.additionalServices.includes(service.id)}
                                onChange={(e) => {
                                  const current = formData.aggregatorData.additionalServices;
                                  const updated = e.target.checked 
                                    ? [...current, service.id]
                                    : current.filter(id => id !== service.id);
                                  handleFieldChange("aggregatorData", null, "additionalServices", updated);
                                }}
                                className="w-4 h-4 rounded border-gray-700 bg-[#111A22] text-purple-600 focus:ring-purple-600"
                              />
                              <span className="text-sm">{service.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Catalog Arrays */}
                      <div className="col-span-2 space-y-4 pt-4 border-t border-gray-800">
                         <ArrayInputList 
                           label="Popular Release Links" 
                           items={formData.aggregatorData.popularReleaseLinks} 
                           onChange={(items) => handleFieldChange("aggregatorData", null, "popularReleaseLinks", items)}
                           isDark={isDark}
                         />
                         <ArrayInputList 
                           label="Popular Artist Links" 
                           items={formData.aggregatorData.popularArtistLinks} 
                           onChange={(items) => handleFieldChange("aggregatorData", null, "popularArtistLinks", items)}
                           isDark={isDark}
                         />
                         <ArrayInputList 
                           label="Associated Labels" 
                           items={formData.aggregatorData.associatedLabels} 
                           onChange={(items) => handleFieldChange("aggregatorData", null, "associatedLabels", items)}
                           isDark={isDark}
                         />
                      </div>
                    </>
                 )}
              </div>
            </TabsContent>

            <TabsContent value="marketing" className="space-y-4 py-2">
               <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">How Did You Know About Us?</label>
                    <select
                      value={formData.aggregatorData.howDidYouKnow}
                      onChange={(e) => handleFieldChange("aggregatorData", null, "howDidYouKnow", e.target.value)}
                      className={`w-full rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#111A22] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
                    >
                      <option value="">Select Option</option>
                      <option value="social_media">Social Media</option>
                      <option value="friend">Friend/Referral</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {formData.aggregatorData.howDidYouKnow === 'other' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Please specify (Other)</label>
                      <Input
                        value={formData.aggregatorData.howDidYouKnowOther}
                        onChange={(e) => handleFieldChange("aggregatorData", null, "howDidYouKnowOther", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        placeholder="e.g. Cold email, Referral"
                      />
                    </div>
                  )}
               </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
          <Button variant={isDark ? "outline" : "secondary"} onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Internal Helper for Array Inputs
function ArrayInputList({ label, items, onChange, isDark }) {
  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => onChange([...items, ""]);
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.length === 0 ? [""] : newItems);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-purple-400 capitalize">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input 
            value={item} 
            onChange={(e) => handleItemChange(index, e.target.value)}
            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
            placeholder={`${label} ${index + 1}`}
          />
          {items.length > 1 && (
            <Button variant="destructive" size="icon" onClick={() => removeItem(index)} className="h-9 w-9">
               -
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="mt-1 text-xs text-purple-400 border-purple-400/30 hover:bg-purple-400/10">
        + Add More
      </Button>
    </div>
  );
}
