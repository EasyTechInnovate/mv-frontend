import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import { Country, State } from "country-state-city";
import { Trash2 } from "lucide-react";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCode: "+91",
  phoneNumber: "",
  address: "",
  pincode: "",
  state: "",
  country: "",
  companyName: "",
  youtube: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  website: "",
  popularReleaseLinks: [""],
  popularArtistLinks: [""],
  labels: [""],
  totalReleases: "",
  releaseFrequency: "daily",
  monthlyReleaseCount: "5-20",
  companyInfo: "",
  services: [],
  howKnowUs: "",
  otherClient: "",
  acceptTerms: false,
};

export default function AddNewAggregatorRequestModal({
  isOpen,
  onClose,
  onSuccess,
  theme,
}) {
  const isDark = theme === "dark";
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.country) {
      const newStates = State.getStatesOfCountry(formData.country);
      setStates(newStates);
      setFormData((prev) => ({ ...prev, state: "" }));
    } else {
      setStates([]);
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
        if (name === "services") {
            setFormData((prev) => ({
              ...prev,
              [name]: checked
                ? [...prev[name], value]
                : prev[name].filter((v) => v !== value),
            }));
          }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated.length > 0 ? updated : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceMapping = {
        "Music Marketing/Advertisement": "music_marketing",
        "YouTube Channel CMS": "youtube_cms",
        "Music Video Distribution": "music_video_distribution",
      };

      const howKnowUsMapping = {
        Google: "advertisement",
        Facebook: "social_media",
        Instagram: "social_media",
        "Our Existing Artist/Label": "friend",
        Others: "other",
      };

      const aggregatorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: `${formData.phoneCode}-${formData.phoneNumber}`,
        companyName: formData.companyName,
        websiteLink: formData.website,
        instagramUrl: formData.instagram,
        facebookUrl: formData.facebook,
        youtubeLink: formData.youtube,
        linkedinUrl: formData.linkedin,
        popularReleaseLinks: formData.popularReleaseLinks.filter(
          (link) => link.trim()
        ),
        popularArtistLinks: formData.popularArtistLinks.filter(
          (link) => link.trim()
        ),
        associatedLabels: formData.labels.filter((label) => label.trim()),
        totalReleases: parseInt(formData.totalReleases) || 0,
        releaseFrequency: formData.releaseFrequency,
        monthlyReleasePlans:
          parseInt(formData.monthlyReleaseCount.split("-")[0]) || 0,
        briefInfo: formData.companyInfo,
        additionalServices: formData.services.map(
          (s) => serviceMapping[s] || s
        ),
        howDidYouKnow: howKnowUsMapping[formData.howKnowUs] || "social_media",
        agreeToTerms: formData.acceptTerms,
      };

      await GlobalApi.applyForAggregator(aggregatorData);
      toast.success("Application submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field, label, fieldNameInState) => {
    return (
      <div key={field} className="space-y-2">
        <Label>{label}</Label>
        {formData[fieldNameInState].map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, fieldNameInState, e.target.value)
              }
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            />
            {formData[fieldNameInState].length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeArrayField(fieldNameInState, index)}
              >
                <Trash2 size={20} />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addArrayField(fieldNameInState)}
          variant="outline"
          size="sm"
        >
          + Add More
        </Button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl ${
          isDark ? "bg-[#111A22] text-white" : "bg-white"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Add New Aggregator Request</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
              />
            </div>
            
            <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex gap-2">
                    <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className={`rounded-md px-3 py-2 text-sm w-1/4 ${
                            isDark
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                        >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                    </select>
                    <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`flex-1 ${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Country</Label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                            isDark
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                        >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option
                            key={c.isoCode}
                            value={c.isoCode}
                            >
                            {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>State</Label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                            isDark
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                        >
                        <option value="">Select State</option>
                        {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Company/Firm Name</Label>
                <Input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
            </div>

            {[
              { label: "Youtube Channel Url", name: "youtube" },
              { label: "Instagram Url", name: "instagram" },
              { label: "Facebook Page Url", name: "facebook" },
              { label: "Linkedin Url", name: "linkedin" },
              { label: "Website", name: "website" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
              </div>
            ))}
            
            {renderArrayField("Your Popular Release Links", "Popular Release Links", "popularReleaseLinks")}
            {renderArrayField("Your Popular Artist Links", "Popular Artist Links", "popularArtistLinks")}
            {renderArrayField("Your Labels", "Associated Labels", "labels")}


            <div className="space-y-2">
              <Label>Total No. Of releases in Your current Calalog</Label>
              <Input
                type="number"
                name="totalReleases"
                value={formData.totalReleases}
                onChange={handleChange}
                className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>How often Do You release your music?</Label>
                    <select
                        name="releaseFrequency"
                        value={formData.releaseFrequency}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                            isDark
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                    >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="occasionally">Occasionally</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>How many releases do plan to distribute in a month?</Label>
                    <select
                        name="monthlyReleaseCount"
                        value={formData.monthlyReleaseCount}
                        onChange={handleChange}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                            isDark
                            ? "bg-[#151F28] border border-gray-700 text-gray-200"
                            : "bg-white border border-gray-300"
                        }`}
                    >
                    <option value="1-5">1-5</option>
                    <option value="5-20">5-20</option>
                    <option value="20+">20+</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Provide some brief info. About your Firm/Company</Label>
                <Textarea
                    name="companyInfo"
                    value={formData.companyInfo}
                    onChange={handleChange}
                    className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
            </div>
            
            <div className="space-y-2">
                <Label>Are you interested in any of our additional services?</Label>
                <div className="mt-3 space-y-3">
                    {[
                    "Music Marketing/Advertisement",
                    "YouTube Channel CMS",
                    "Music Video Distribution",
                    ].map((service) => (
                    <div key={service} className="flex items-center gap-3">
                        <Checkbox
                            id={service}
                            name="services"
                            value={service}
                            checked={formData.services.includes(service)}
                            onCheckedChange={(checked) => handleChange({ target: { name: 'services', value: service, type: 'checkbox', checked }})}
                        />
                        <Label htmlFor={service}>{service}</Label>
                    </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>How do You Know about us ?</Label>
                <div className="mt-3 space-y-3">
                    {[
                        "Google",
                        "Facebook",
                        "Instagram",
                        "Our Existing Artist/Label",
                        "Others",
                    ].map((opt) => (
                        <div key={opt} className="flex items-center gap-3">
                            <input
                            type="radio"
                            id={opt}
                            name="howKnowUs"
                            value={opt}
                            checked={formData.howKnowUs === opt}
                            onChange={handleChange}
                            className="h-4 w-4"
                            />
                            <Label htmlFor={opt}>{opt}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>If Choose Other/our existing client</Label>
                <Input
                    type="text"
                    name="otherClient"
                    value={formData.otherClient}
                    onChange={handleChange}
                    className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
                />
            </div>

            <div className="flex items-center gap-3">
                <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, acceptTerms: checked}))}
                />
                <Label htmlFor="acceptTerms">I accept the terms and conditions</Label>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
