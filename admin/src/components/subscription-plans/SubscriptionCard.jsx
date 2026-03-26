"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const FEATURE_LABELS = {
  unlimitedReleases: "Unlimited Release",
  unlimitedArtists: "Unlimited Artists",
  singleLabel: "Single Label (100% Ownership)",
  revenueShare: "Net Revenue Share",
  youtubeContentId: "YouTube Content ID",
  metaContentId: "Meta Content ID",
  tiktokContentId: "TikTok Content ID",
  youtubeOac: "YouTube OAC",
  analyticsCenter: "Analytics Centre",
  royaltyClaimCentre: "Royalty Claim Centre",
  merchandisePanel: "Merchandise Distribution Panel",
  dolbyAtmos: "Dolby Atmos Distribution",
  spotifyDiscoveryMode: "Spotify Discovery Mode",
  playlistPitching: "Playlist Pitching",
  synchronization: "Synchronization",
  fanLinksBuilder: "Fan Links Builder",
  mahiAi: "Mahi AI",
  youtubeMcnAccess: "YouTube MCN Access",
  available150Stores: "Available to all 150 stores",
  worldwideAvailability: "Worldwide Availability",
  freeUpcCode: "Free UPC Code",
  freeIsrcCode: "Free ISRC Code",
  lifetimeAvailability: "Lifetime Availability",
  supportHours: "Support Time",
  liveSupportTime: "Live Processing Time",
};

const SUPPORT_HOURS_LABELS = {
  "24_business_hours": "24 Business Hours",
  "48_business_hours": "48 Business Hours",
  "72_business_hours": "72 Business Hours",
};

const LIVE_PROCESS_LABELS = {
  "48_to_72_business_hours": "48 to 72 Business Hours",
  "24_to_48_business_hours": "24 to 48 Business Hours",
  "instant": "Instant",
};

export default function SubscriptionCard({
  plan,
  isDark,
  handleEdit,
  handleDelete,
  handleToggle,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleConfirmedDelete = async () => {
    try {
      setIsDeleting(true);
      await handleDelete(plan.planId); 
      toast.success(`Deleted plan "${plan.name}" successfully`);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete plan");
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false);
    }
  };

  const handleToggleStatus = async (value) => {
    try {
      setIsToggling(true);
      await handleToggle(plan.planId, value); 
      toast.success(
        `Plan "${plan.name}" ${value ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to update plan status");
    } finally {
      setIsToggling(false);
    }
  };

  const enabledFeatures = Object.entries(plan.features || {}).filter(
    ([, value]) =>
      (typeof value === "boolean" && value) ||
      (typeof value === "string" && value.length > 0) ||
      (typeof value === "object" && value !== null)
  );

  const [showFull, setShowFull] = useState(false);

  
  const visibleFeatures = showFull ? enabledFeatures : enabledFeatures.slice(0, 7);

  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-lg flex flex-col justify-between transition hover:shadow-xl border",
        isDark
          ? "bg-[#151F28] text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      )}
    >
    
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {plan.name}
            {plan.isBestValue && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                Best Value
              </span>
            )}
            {plan.isPopular && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                Popular
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
        </div>

        
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Edit"
            onClick={() => handleEdit(plan)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          
          <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Delete"
                disabled={isDeleting}
              >
                <Trash
                  className={`h-4 w-4 ${isDeleting ? "text-gray-400" : "text-red-500"}`}
                />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={cn(isDark ? "bg-[#151F28] text-white" : "bg-white text-gray-800")}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the plan{" "}
                  <span className="font-semibold">"{plan.name}"</span>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmedDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

     
      <div className="mb-4">
        <p className="text-4xl font-bold">
          ₹{plan.price?.current ?? 0}
          {plan.price?.original &&
            plan.price.original !== plan.price.current && (
              <span className="line-through text-sm text-gray-400 ml-2">
                ₹{plan.price.original}
              </span>
            )}
        </p>
        <p className="text-xs text-gray-400 mt-1 capitalize">
          Billed {plan.intervalCount > 1 ? `${plan.intervalCount}x ` : ""} per{" "}
          {plan.interval ?? "month"}
        </p>
        {plan.discount?.enabled && (
          <p className="text-sm text-green-400 mt-2">
            {plan.discount.percentage}% off until{" "}
            {new Date(plan.discount.validUntil).toLocaleDateString()}
          </p>
        )}
      </div>

      
      <div className="flex-1 relative">
        
        <ul
          className={cn(
            "text-sm space-y-1 transition-all duration-300",
            
            showFull
              ? "max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 custom-scrollbar"
              : ""
          )}
        >
          {visibleFeatures.length > 0 ? (
            visibleFeatures.map(([key, value]) => {
              let label = FEATURE_LABELS[key] || key;
              if (key === "supportHours")
                label = `${FEATURE_LABELS[key]}: ${SUPPORT_HOURS_LABELS[value] || value}`;
              if (key === "liveSupportTime")
                label = `${FEATURE_LABELS[key]}: ${LIVE_PROCESS_LABELS[value] || value}`;
              if (key === "revenueShare" && value?.percentage)
                label = `${value.percentage}% of the Net Revenue`;
              return (
                <li key={key} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{label}</span>
                </li>
              );
            })
          ) : (
            <li className="text-gray-500 italic">No active features for this plan.</li>
          )}
        </ul>

       
        {enabledFeatures.length > 7 && (
          <div className="mt-2 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFull(!showFull)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              {showFull ? "Show Less" : "Show Full"}
            </Button>
          </div>
        )}
      </div>

      
      <div className="mt-4 border-t border-gray-700/50 pt-3 text-sm text-gray-400 space-y-1">
        {plan.trial?.enabled && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span>Trial: {plan.trial.days} days</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-xs">Subscribers</p>
            <p className="font-medium text-white">{plan.subscribers ?? 0}</p>
          </div>
          <div>
            <p className="text-xs">Monthly Revenue</p>
            <p className="font-medium text-white">₹{plan.revenue ?? 0}</p>
          </div>
        </div>
      </div>

    
      <div className="flex justify-between items-center border-t border-gray-700/40 pt-4 mt-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Active Status:</span>
          <Switch
            checked={plan.isActive}
            disabled={isToggling}
            onCheckedChange={handleToggleStatus}
          />
        </div>

        
        <span
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full",
            plan.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          )}
        >
          {plan.isActive ? "Activated" : "Deactivated"}
        </span>
      </div>
    </div>
  );
}
