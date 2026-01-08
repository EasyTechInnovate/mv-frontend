import React, { useEffect, useState } from "react";
import OwnerInformation from "@/components/mv-production/OwnerInformationComponent.jsx";
import { ArrowLeft, Check, X } from "lucide-react";
import ProjectOverview from "./ProjectOverviewComponent";
import BudgetRequestOwnership from "./BudgetRequestComponent.jsx";
import LegalOwnershipDeclaration from "./LegalOwnershipComponent.jsx";
import MarketingDistributionPlan from "./MarketingDistributionComponent.jsx";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

const initialFormData = {
    copyrightOwnerName: "",
    mobileNumber: "",
    emailOfCopyrightHolder: "",
    projectTitle: "",
    artistName: "",
    labelName: "",
    releaseTimeline: "",
    genres: "",
    mood: "",
    isPartOfAlbumOrEP: "no",
    language: "",
    theme: "",
    locationPreference: {
      indoor_studio: false,
      outdoor_and_natural: false,
      urban_and_street: false
    },
    totalBudgetRequested: "",
    proposedOwnershipDilution: "",
    preProduction: "",
    shootDay: "",
    postProduction: "",
    miscellaneousContingency: "",
    willContributePersonalFunds: "no",
    personalFundsAmount: "",
    revenueSharingModelProposed: "",
    willBeReleasedViaMVDistribution: "no",
    anyBrandOrMerchTieIns: "no",
    brandOrMerchTieInsDescription: "",
    planToRunAdsOrInfluencerCampaigns: "no",
    confirmFullCreativeOwnership: "no",
    agreeToCreditMVProduction: "no",
    agreeToShareFinalAssets: "no",
    requireNDAOrCustomAgreement: "no"
};

export default function MVProductionUserPage({
  theme = "dark",
  onBack,
  defaultData,
  onRefresh,
}) {
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [editMode, setEditMode] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (defaultData) {
      setLoading(true);
      const flatData = {
        ...initialFormData,
        // Owner Info
        copyrightOwnerName: defaultData.ownerInfo?.copyrightOwnerName || "",
        mobileNumber: defaultData.ownerInfo?.mobileNumber || "",
        emailOfCopyrightHolder: defaultData.ownerInfo?.emailOfCopyrightHolder || defaultData.userId?.emailAddress || "",
        // Project Overview
        projectTitle: defaultData.projectOverview?.projectTitle || "",
        artistName: defaultData.projectOverview?.artistName || "",
        labelName: defaultData.projectOverview?.labelName || "",
        releaseTimeline: defaultData.projectOverview?.releaseTimeline || "",
        genres: Array.isArray(defaultData.projectOverview?.genres) ? defaultData.projectOverview.genres[0] : "",
        mood: defaultData.projectOverview?.mood || "",
        isPartOfAlbumOrEP: defaultData.projectOverview?.isPartOfAlbumOrEP ? "yes" : "no",
        language: defaultData.projectOverview?.language || "",
        theme: defaultData.projectOverview?.theme || "",
        locationPreference: {
            indoor_studio: defaultData.projectOverview?.locationPreference?.includes('indoor_studio') || false,
            outdoor_and_natural: defaultData.projectOverview?.locationPreference?.includes('outdoor_and_natural') || false,
            urban_and_street: defaultData.projectOverview?.locationPreference?.includes('urban_and_street') || false,
        },
        // Budget
        totalBudgetRequested: defaultData.budgetRequestAndOwnershipProposal?.totalBudgetRequested || "",
        proposedOwnershipDilution: defaultData.budgetRequestAndOwnershipProposal?.proposedOwnershipDilution || "",
        preProduction: defaultData.budgetRequestAndOwnershipProposal?.breakdown?.preProduction || "",
        shootDay: defaultData.budgetRequestAndOwnershipProposal?.breakdown?.shootDay || "",
        postProduction: defaultData.budgetRequestAndOwnershipProposal?.breakdown?.postProduction || "",
        miscellaneousContingency: defaultData.budgetRequestAndOwnershipProposal?.breakdown?.miscellaneousContingency || "",
        willContributePersonalFunds: defaultData.budgetRequestAndOwnershipProposal?.willContributePersonalFunds ? "yes" : "no",
        personalFundsAmount: defaultData.budgetRequestAndOwnershipProposal?.personalFundsAmount || "",
        revenueSharingModelProposed: defaultData.budgetRequestAndOwnershipProposal?.revenueSharingModelProposed || "",
        // Marketing
        willBeReleasedViaMVDistribution: defaultData.marketingAndDistributionPlan?.willBeReleasedViaMVDistribution ? "yes" : "no",
        anyBrandOrMerchTieIns: defaultData.marketingAndDistributionPlan?.anyBrandOrMerchTieIns ? "yes" : "no",
        brandOrMerchTieInsDescription: defaultData.marketingAndDistributionPlan?.brandOrMerchTieInsDescription || "",
        planToRunAdsOrInfluencerCampaigns: defaultData.marketingAndDistributionPlan?.planToRunAdsOrInfluencerCampaigns ? "yes" : "no",
        // Legal
        confirmFullCreativeOwnership: defaultData.legalAndOwnershipDeclaration?.confirmFullCreativeOwnership ? "yes" : "no",
        agreeToCreditMVProduction: defaultData.legalAndOwnershipDeclaration?.agreeToCreditMVProduction ? "yes" : "no",
        agreeToShareFinalAssets: defaultData.legalAndOwnershipDeclaration?.agreeToShareFinalAssets ? "yes" : "no",
        requireNDAOrCustomAgreement: defaultData.legalAndOwnershipDeclaration?.requireNDAOrCustomAgreement ? "yes" : "no",
      };
      setFormData(flatData);
      setRejectionReason(defaultData.rejectionReason || "");
      setAdminNotes(defaultData.adminNotes || "");
      setLoading(false);
    }
  }, [defaultData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (section, field, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
      }
    }))
  };

  const handleSave = async () => {
    setLoading(true);
    const selectedLocationPreferences = Object.keys(formData.locationPreference)
      .filter(key => formData.locationPreference[key]);

    const payload = {
      ownerInfo: {
        copyrightOwnerName: formData.copyrightOwnerName,
        mobileNumber: formData.mobileNumber,
        emailOfCopyrightHolder: formData.emailOfCopyrightHolder
      },
      projectOverview: {
        projectTitle: formData.projectTitle,
        artistName: formData.artistName,
        labelName: formData.labelName,
        releaseTimeline: formData.releaseTimeline,
        genres: [formData.genres],
        mood: formData.mood,
        isPartOfAlbumOrEP: formData.isPartOfAlbumOrEP === "yes",
        language: formData.language,
        theme: formData.theme,
        locationPreference: selectedLocationPreferences
      },
      budgetRequestAndOwnershipProposal: {
        totalBudgetRequested: parseFloat(formData.totalBudgetRequested) || 0,
        proposedOwnershipDilution: parseFloat(formData.proposedOwnershipDilution) || 0,
        breakdown: {
          preProduction: parseFloat(formData.preProduction) || 0,
          shootDay: parseFloat(formData.shootDay) || 0,
          postProduction: parseFloat(formData.postProduction) || 0,
          miscellaneousContingency: parseFloat(formData.miscellaneousContingency) || 0
        },
        willContributePersonalFunds: formData.willContributePersonalFunds === "yes",
        personalFundsAmount: parseFloat(formData.personalFundsAmount) || 0,
        revenueSharingModelProposed: formData.revenueSharingModelProposed
      },
      marketingAndDistributionPlan: {
        willBeReleasedViaMVDistribution: formData.willBeReleasedViaMVDistribution === "yes",
        anyBrandOrMerchTieIns: formData.anyBrandOrMerchTieIns === "yes",
        brandOrMerchTieInsDescription: formData.brandOrMerchTieInsDescription || null,
        planToRunAdsOrInfluencerCampaigns: formData.planToRunAdsOrInfluencerCampaigns === "yes"
      },
      legalAndOwnershipDeclaration: {
        confirmFullCreativeOwnership: formData.confirmFullCreativeOwnership === "yes",
        agreeToCreditMVProduction: formData.agreeToCreditMVProduction === "yes",
        agreeToShareFinalAssets: formData.agreeToShareFinalAssets === "yes",
        requireNDAOrCustomAgreement: formData.requireNDAOrCustomAgreement === "yes"
      }
    };
    
    try {
      await GlobalApi.updateMVProduction(defaultData._id, payload);
      toast.success("MV Production updated successfully!");
      setEditMode(false);
      onRefresh();
    } catch (err) {
      console.error("❌ Patch failed:", err);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.warning("Please provide a rejection reason.");
      return;
    }

    try {
      const payload = {
        action,
        rejectionReason: action === "reject" ? rejectionReason.trim() : undefined,
        adminNotes: adminNotes.trim() || undefined,
      };
      await GlobalApi.reviewMVProduction(defaultData._id, payload);
      toast.success(
        action === "approve"
          ? "Production request accepted successfully!"
          : "Production request rejected successfully!"
      );
      onRefresh();
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (loading || !formData) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${
          isDark ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"
        }`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full p-6 md:p-10 ${
        isDark ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"
      }`}
    >
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${ isDark ? "bg-[#151F28] hover:bg-[#1d2732] text-gray-200" : "bg-white hover:bg-gray-200 text-black"}`}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-semibold">MV Production</h1>
        </div>
       
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="px-5 py-2 rounded-lg bg-blue-600 text-white">
            Edit
          </button>
        ) : (
          <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-green-600 text-white">
            Save
          </button>
        )}
      </div>

      <p className="text-sm opacity-70 mb-8">
        Apply for music and video production funding to enhance your creative
        projects
      </p>
      
      <OwnerInformation
        theme={theme}
        data={formData}
        editMode={editMode}
        handleInputChange={handleInputChange}
      />
      <ProjectOverview
        theme={theme}
        data={formData}
        editMode={editMode}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        className="mt-5"
      />
      <BudgetRequestOwnership
        theme={theme}
        data={formData}
        editMode={editMode}
        handleInputChange={handleInputChange}
        className="mt-5"
      />
      <MarketingDistributionPlan
        theme={theme}
        data={formData}
        editMode={editMode}
        handleInputChange={handleInputChange}
        className="mt-5"
      />
      <LegalOwnershipDeclaration
        theme={theme}
        data={formData}
        editMode={editMode}
        handleInputChange={handleInputChange}
        className="mt-5"
      />
      {!editMode &&(
        <div>
          <div className="mt-8">
            <label className="block mb-2 text-sm font-medium"> Admin Notes </label>
            <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Enter any admin notes here..." className={`w-full resize-none min-h-[100px] rounded-md border p-3 text-sm ${isDark ? 'bg-[#151F28] border-gray-700' : 'bg-white border-gray-300'}`}/>
          </div>
          <div className="mt-8">
            <label className="block mb-2 text-sm font-medium"> Rejection Reason (required if rejecting) </label>
            <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter reason for rejection..." className={`w-full resize-none min-h-[100px] rounded-md border p-3 text-sm ${isDark ? 'bg-[#151F28] border-gray-700' : 'bg-white border-gray-300'}`} />
          </div>
        </div>
      )}
     
      <div className={`mt-8 p-5 flex justify-center rounded-xl `}>
        {!editMode && (
          <div className="flex gap-4">
            <button onClick={() => handleReview("approve")} className="px-5 py-2 rounded-lg bg-green-600 text-white">
              <Check className="inline-block w-4 h-4 mr-2" />
              Accept
            </button>
            <button onClick={() => handleReview("reject")} className="px-5 py-2 rounded-lg bg-red-600 text-white">
              <X className="inline-block w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
