"use client";
import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import toast, { Toaster } from "react-hot-toast";
import { MainHeadingText } from "@/components/FixedUiComponents";
import { Button } from "@/components/ui/button";
import { submitAggregatorApplication } from "@/services/api.services";
import { Trash2 } from "lucide-react";
import { PHONE_CODES } from "@/lib/constants";

const FormPage = () => {
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);

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
      if (name === "acceptTerms") {
        setFormData((prev) => ({ ...prev, acceptTerms: checked }));
        return;
      }

      // For services checkboxes
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
      // Map services to correct API format
      const serviceMapping = {
        "Music Marketing/Advertisement": "music_marketing",
        "YouTube Channel CMS": "youtube_cms",
        "Music Video Distribution": "music_video_distribution",
      };

      // Map howKnowUs to correct API format
      const howKnowUsMapping = {
        "Google": "advertisement",
        "Facebook": "social_media",
        "Instagram": "social_media",
        "Our Existing Artist/Label": "friend",
        "Others": "other",
      };

      const aggregatorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: `${formData.phoneCode}-${formData.phoneNumber}`,
        address: formData.address,
        pincode: formData.pincode,
        state: formData.state,
        country: formData.country,
        companyName: formData.companyName,
        websiteLink: formData.website,
        instagramUrl: formData.instagram,
        facebookUrl: formData.facebook,
        youtubeLink: formData.youtube,
        linkedinUrl: formData.linkedin,
        popularReleaseLinks: formData.popularReleaseLinks.filter(link => link.trim()),
        popularArtistLinks: formData.popularArtistLinks.filter(link => link.trim()),
        associatedLabels: formData.labels.filter(label => label.trim()),
        totalReleases: parseInt(formData.totalReleases) || 0,
        releaseFrequency: formData.releaseFrequency,
        monthlyReleasePlans: parseInt(formData.monthlyReleaseCount.split('-')[0]) || 0,
        briefInfo: formData.companyInfo,
        additionalServices: formData.services.map(s => serviceMapping[s] || s),
        howDidYouKnow: howKnowUsMapping[formData.howKnowUs] || "social_media",
        howDidYouKnowOther: formData.howKnowUs === "Others" ? formData.otherClient : undefined,
        agreeToTerms: formData.acceptTerms,
      };

      const response = await submitAggregatorApplication(aggregatorData);
      
      toast.success("Application submitted successfully! 🎉", {
        duration: 4000,
        position: "top-center",
        
      });

      console.log("Application submitted successfully:", response);
      
      // Reset form
      setFormData({
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
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      
      let errorMessage = error.response?.data?.message || error.message || "Failed to submit application";

      // Check for detailed validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const detailMessages = error.response.data.errors.map(err => err.message);
        if (detailMessages.length > 0) {
          errorMessage = detailMessages.join(" | ");
        }
      }

      toast.error(`Error: ${errorMessage}`, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field, label, fieldNameInState) => {
    return (
      <div key={field}>
        <label>{label} <span className="text-[#652CD6]">*</span> </label>
        {formData[fieldNameInState].map((item, index) => (
          <div key={index} className="flex gap-2 mt-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, fieldNameInState, e.target.value)
              }
              className="flex-1 bg-transparent border border-gray-500 rounded px-3 py-2"
            />
            {formData[fieldNameInState].length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField(fieldNameInState, index)}
                className="text-red-500 hover:text-red-700 transition"
                title="Remove"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField(fieldNameInState)}
          className="text-purple-500 mt-2 hover:text-purple-600 transition"
        >
          + Add More
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[150px] ">
      <Toaster />
      <MainHeadingText text="Apply form now for" text2="Aggregators" className="max-sm:text-[60px]" />

      <form
        onSubmit={handleSubmit}
        className="bg-[#191E2A] border border-gray-400 rounded-xl  p-20 max-sm:p-6 mt-20 max-sm:mt-10 max-sm:mx-4 sm:w-full max-w-6xl text-white space-y-6"
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>First Name <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Last Name <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
            />
          </div>
        </div>

        
        <div>
          <label>Email ID <span className="text-[#652CD6]">*</span> </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
          />
        </div>

        
        <label>Phone Number <span className="text-[#652CD6]">*</span> </label>
        <div className="flex gap-2">
          <select
            name="phoneCode"
            value={formData.phoneCode}
            onChange={handleChange}
            className="bg-[#151A27] border border-gray-500 rounded px-3 py-2"
          >
            {PHONE_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="flex-1 bg-transparent border border-gray-500 rounded px-3 py-2"
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Address <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
            />
          </div>
          <div>
            <label>Pincode <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Country <span className="text-[#652CD6]">*</span> </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 custom-scroll"
            >
              <option className="bg-[#151A27] text-white" value="">
                Select Country
              </option>
              {countries.map((c) => (
                <option
                  className="bg-[#151A27] text-white"
                  key={c.isoCode}
                  value={c.isoCode}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>State <span className="text-[#652CD6] ">*</span> </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 custom-scroll"
            >
              <option className="bg-[#151A27] text-white" value="">Select State</option>
              {states.map((s) => (
                <option className="bg-[#151A27] text-white" key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        
        <div>
          <label>Company/Firm Name <span className="text-[#652CD6]">*</span> </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
          />
        </div>

        
        {[
          { label: "Youtube Channel Url", name: "youtube" },
          { label: "Instagram Url", name: "instagram" },
          { label: "Facebook Page Url", name: "facebook" },
          { label: "Linkedin Url", name: "linkedin" },
          { label: "Website", name: "website" },
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label} <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
            />
          </div>
        ))}

        {renderArrayField("Your Popular Release Links", "Your Popular Release Links", "popularReleaseLinks")}

        {renderArrayField("Your Popular Artist Links", "Your Popular Artist Links", "popularArtistLinks")}

        {renderArrayField("Your Labels", "Your Labels", "labels")}

        
        <div>
          <label>Total No. Of releases in Your current Calalog <span className="text-[#652CD6]">*</span> </label>
          <input
            type="text"
            name="totalReleases"
            value={formData.totalReleases}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-500 rounded px-3 py-2"
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>How often Do You release your music? <span className="text-[#652CD6]">*</span> </label>
            <select
              name="releaseFrequency"
              value={formData.releaseFrequency}
              onChange={handleChange}
              className="w-full bg-[#191E2A] border border-gray-500 rounded px-3 py-2 custom-scroll"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="occasionally">Occasionally</option>
            </select>
          </div>

          <div>
            <label>How many releases do plan to distribute in a month? <span className="text-[#652CD6]">*</span> </label>
            <select
              name="monthlyReleaseCount"
              value={formData.monthlyReleaseCount}
              onChange={handleChange}
              className="w-full bg-[#191E2A] border border-gray-500 rounded px-3 py-2 custom-scroll"
            >
              <option value="1-5">1-5</option>
              <option value="5-20">5-20</option>
              <option value="20+">20+</option>
            </select>
          </div>
        </div>

        
        <div>
          <label>Provide some brief info. About your Firm/Company <span className="text-[#652CD6]">*</span> </label>
          <textarea
            name="companyInfo"
            value={formData.companyInfo}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-500 rounded px-3 py-3 h-28"
          />
        </div>

        
        <div>
          <label>Are you interested in any of our additional services? <span className="text-[#652CD6]">*</span> </label>
          <div className="mt-3 space-y-3">
            {[
              "Music Marketing/Advertisement",
              "YouTube Channel CMS",
              "Music Video Distribution",
            ].map((service) => (
              <label key={service} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={formData.services.includes(service)}
                  onChange={handleChange}
                  className="h-5 w-5 accent-purple-500"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>

        
        <div>
          <label>How do You Know about us ? <span className="text-[#652CD6]">*</span> </label>
          <div className="mt-3 space-y-3">
            {[
              "Google",
              "Facebook",
              "Instagram",
              "Our Existing Artist/Label",
              "Others",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="howKnowUs"
                  value={opt}
                  checked={formData.howKnowUs === opt}
                  onChange={handleChange}
                  className="h-5 w-5 accent-purple-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        
        {formData.howKnowUs === "Others" && (
          <div>
            <label>If Choose Other <span className="text-[#652CD6]">*</span> </label>
            <input
              type="text"
              name="otherClient"
              value={formData.otherClient}
              onChange={handleChange}
              placeholder="Please specify how you know about us..."
              className="w-full bg-transparent border border-gray-500 rounded px-3 py-2 mt-2"
            />
          </div>
        )}

        
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="h-5 w-5 accent-purple-500 cursor-pointer"
            id="acceptTerms"
          />
          <label htmlFor="acceptTerms" className="cursor-pointer">
            I accept the{" "}
            <a 
              href="/legal/terms-conditions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-400 font-medium hover:underline transition-colors"
            >
              terms and conditions
            </a>
          </label>
        </div>

        
        <div className="w-full flex justify-center items-center">
            <Button variant="blue" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
