import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import SocialLinksEditor from "@/components/company-settings/SocialLinks";
import ContactPage from "@/components/company-settings/ContactDetails";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CompanySettingsPage({ theme = "dark", companySettingsId }) {
  const isDark = theme === "dark";


  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);



  const [companyId, setCompanyId] = useState(companySettingsId || null);
  const [companySettings, setCompanySettings] = useState(null);


  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    website: "",
    x: "",
    youtubeLinks: [],
  });
  const [contactInfo, setContactInfo] = useState({
    primaryPhone: "",
    secondaryPhone: "",
    primaryEmail: "",
    supportEmail: "",
    businessEmail: "",
    pressEmail: "",
    legalEmail: "",
    whatsappQRCode: "",
    physicalAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    businessHours: "",
  });


  const [isEditing, setIsEditing] = useState(false);


  const normalizeAndSet = (data) => {

    if (!data) {
      setCompanySettings(null);
      setCompanyId(null);


      setSocialMedia({
        instagram: "",
        facebook: "",
        linkedin: "",
        youtube: "",
        website: "",
        x: "",
        youtubeLinks: [],
      });


      setContactInfo({
        primaryPhone: "",
        secondaryPhone: "",
        primaryEmail: "",
        supportEmail: "",
        businessEmail: "",
        pressEmail: "",
        legalEmail: "",
        whatsappQRCode: "",
        physicalAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        businessHours: "",
      });

      return;
    }


    const social = data?.socialMedia || {};

    setSocialMedia({
      instagram: social.instagram || "",
      facebook: social.facebook || "",
      linkedin: social.linkedin || "",
      youtube: social.youtube || "",
      website: social.website || "",
      x: social.x || "",
      youtubeLinks: Array.isArray(social.youtubeLinks)
        ? social.youtubeLinks
        : [],
    });


    const contact = data?.contactInfo || {};

    setContactInfo({
      primaryPhone: contact.primaryPhone || "",
      secondaryPhone: contact.secondaryPhone || "",
      primaryEmail: contact.primaryEmail || "",
      supportEmail: contact.supportEmail || "",
      businessEmail: contact.businessEmail || "",
      pressEmail: contact.pressEmail || "",
      legalEmail: contact.legalEmail || "",
      whatsappQRCode: contact.whatsappQRCode || "",

      physicalAddress: {
        street: contact?.physicalAddress?.street || "",
        city: contact?.physicalAddress?.city || "",
        state: contact?.physicalAddress?.state || "",
        zipCode: contact?.physicalAddress?.zipCode || "",
        country: contact?.physicalAddress?.country || "",
      },

      businessHours: contact.businessHours || "",
    });


    setCompanySettings(data);
    setCompanyId(data._id || null);
  };



  const fetchCompanySettings = async () => {
    setLoading(true);
    try {
      if (companySettingsId) {
        const res = await GlobalApi.getCompanySettingsById(companySettingsId);
        const data = res?.data?.data ?? null;

        console.log("✅ API RESPONSE (BY ID):", data);
        normalizeAndSet(data);
      } else {
        const res = await GlobalApi.getAllCompanySettings(1, 10);

        console.log("✅ RAW API RESPONSE (ALL):", res?.data?.data);


        const data = res?.data?.data ?? null;

        normalizeAndSet(data);
      }
    } catch (err) {
      console.error("fetchCompanySettings:", err);
      toast.error("Failed to fetch company settings");
      normalizeAndSet(null);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    fetchCompanySettings();

  }, [companySettingsId]);

  const handleSubmit = async () => {
    const payload = {
      socialMedia: {
        instagram: socialMedia.instagram || null,
        facebook: socialMedia.facebook || null,
        linkedin: socialMedia.linkedin || null,
        youtube: socialMedia.youtube || null,
        website: socialMedia.website || null,
        x: socialMedia.x || null,
        youtubeLinks: socialMedia.youtubeLinks || [],
      },
      contactInfo: {
        primaryPhone: contactInfo.primaryPhone || null,
        secondaryPhone: contactInfo.secondaryPhone || null,
        primaryEmail: contactInfo.primaryEmail || null,
        supportEmail: contactInfo.supportEmail || null,
        businessEmail: contactInfo.businessEmail || null,
        pressEmail: contactInfo.pressEmail || null,
        legalEmail: contactInfo.legalEmail || null,
        whatsappQRCode: contactInfo.whatsappQRCode || null,
        physicalAddress: contactInfo.physicalAddress || {
          street: null,
          city: null,
          state: null,
          zipCode: null,
          country: null,
        },
        businessHours: contactInfo.businessHours || null,
      },
    };

    setSaving(true);
    try {
      if (companyId) {
        await GlobalApi.updateCompanySettings(companyId, payload);
        toast.success("Company settings updated");
      } else {
        const res = await GlobalApi.createCompanySettings(payload);
        const newId = res?.data?.data?._id ?? res?.data?.data?.id ?? null;
        if (newId) {
          setCompanyId(newId);
          toast.success("Company settings created");
        } else {
          toast.success("Company settings created (no id returned)");
        }
      }

      await fetchCompanySettings();
      setIsEditing(false);
    } catch (err) {
      console.error("handleSubmit:", err);
      toast.error("Failed to save company settings");
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async () => {
    if (!companyId) {
      toast.error("No company settings to delete");
      return;
    }

    setDeleting(true);
    try {
      await GlobalApi.deleteCompanySettings(companyId);
      toast.success("Company settings deleted");

      setCompanyId(null);
      normalizeAndSet(null);
    } catch (err) {
      console.error("handleDelete:", err);
      toast.error("Failed to delete company settings");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };



  const handleAddYouTubeLink = async (payload) => {

    if (!companyId) {
      toast.error("Create company settings first before adding YouTube links");
      return;
    }
    try {
      await GlobalApi.addYouTubeLink(companyId, payload);
      toast.success("YouTube link added");
      await fetchCompanySettings();
    } catch (err) {
      console.error("handleAddYouTubeLink:", err);
      toast.error("Failed to add YouTube link");
    }
  };

  const handleUpdateYouTubeLinks = async (payloadArray) => {

    if (!companyId) {
      toast.error("Create company settings first before updating YouTube links");
      return;
    }
    try {

      await GlobalApi.updateYouTubeLinks(companyId, payloadArray);
      toast.success("YouTube links updated");
      await fetchCompanySettings();
    } catch (err) {
      console.error("handleUpdateYouTubeLinks:", err);
      toast.error("Failed to update YouTube links");
    }
  };

  const handleDeleteYouTubeLink = async () => {
    if (!companyId) {
      toast.error("No company settings to delete YouTube link from");
      return;
    }
    try {
      await GlobalApi.deleteYouTubeLink(companyId);
      toast.success("YouTube link deleted");
      await fetchCompanySettings();
    } catch (err) {
      console.error("handleDeleteYouTubeLink:", err);
      toast.error("Failed to delete YouTube link");
    }
  };

  const updateSocialMediaLocally = (partial) => {
    setSocialMedia((prev) => ({ ...prev, ...partial }));
  };

  const updateContactInfoLocally = (partial) => {
    setContactInfo((prev) => {
      const merged = { ...prev, ...partial };
      if (partial.physicalAddress) {
        merged.physicalAddress = { ...prev.physicalAddress, ...partial.physicalAddress };
      }
      return merged;
    });
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#111A22] text-white" : "bg-gray-50 text-[#111A22]"
          }`}
      >
        <p className="text-gray-400">Loading company settings...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-[#111A22] text-white" : "bg-gray-50 text-[#111A22]"
        }`}
    >

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-gray-400 text-sm">
            Manage all your company information, social links & contact details
          </p>
        </div>


        <div className="flex items-center gap-2 text-white">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {

                  normalizeAndSet(companySettings);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}

          <Button
            className={`ml-2 ${isDark
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
              }`}
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
          >
            Delete
          </Button>


        </div>
      </div>

      <section className="mb-12">
        <SocialLinksEditor
          theme={theme}
          socialMedia={socialMedia}
          youtubeLinks={socialMedia.youtubeLinks || []}
          setSocialMedia={updateSocialMediaLocally}
          setYoutubeLinks={(arr) => updateSocialMediaLocally({ youtubeLinks: arr })}
          isEditing={isEditing}
          addYouTubeLink={handleAddYouTubeLink}
          updateYouTubeLinks={handleUpdateYouTubeLinks}
          deleteYouTubeLink={handleDeleteYouTubeLink}
          onRefresh={fetchCompanySettings}
          companySettingsId={companyId}
        />
      </section>

      <section className="mb-12">
        <ContactPage
          theme={theme}
          companySettingsId={companyId}
          contactInfo={contactInfo}
          physicalAddress={contactInfo.physicalAddress || {}}
          websiteLink={socialMedia?.website || ""}
          setContactInfo={updateContactInfoLocally}
          isEditing={isEditing}
          onRefresh={fetchCompanySettings}
        />
      </section>

      {companySettings?.physicalAddress && (
        <section className="mb-12">
          <div />
        </section>
      )}

      {showConfirm && (
        <ConfirmDialog
          theme={theme}
          title="Delete Company Settings"
          message="Are you sure you want to permanently delete all company settings? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

    </div>
  );
}
