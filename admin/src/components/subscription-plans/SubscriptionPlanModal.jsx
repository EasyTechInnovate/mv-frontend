import { useEffect, useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";


const PLAN_IDS = [
  { label: "Artist Standard", value: "artist_standard" },
  { label: "Artist Popular", value: "artist_popular" },
  { label: "Artist Best Value", value: "artist_best_value" },
  { label: "Label Standard", value: "label_standard" },
  { label: "Label Popular", value: "label_popular" },
  { label: "Label Best Value", value: "label_best_value" },
  { label: "Maheshwari Standard", value: "maheshwari_standard" },
  { label: "Maheshwari Best Value", value: "maheshwari_best_value" },
  { label: "Maheshwari Popular", value: "maheshwari_popular" },
  { label: "Maheshwari Premium", value: "maheshwari_premium" },
];


const DEFAULT_FEATURES = {
  unlimitedReleases: false,
  unlimitedArtists: false,
  singleLabel: false,
  ownership100: true,
  revenueShare: { enabled: true, percentage: 95 },
  youtubeContentId: false,
  metaContentId: false,
  tiktokContentId: false,
  youtubeOac: false,
  analyticsCenter: false,
  royaltyClaimCentre: false,
  merchandisePanel: false,
  dolbyAtmos: false,
  spotifyDiscoveryMode: false,
  playlistPitching: false,
  synchronization: false,
  fanLinksBuilder: false,
  mahiAi: false,
  youtubeMcnAccess: false,
  available150Stores: false,
  worldwideAvailability: true,
  freeUpcCode: false,
  freeIsrcCode: false,
  lifetimeAvailability: false,
  supportHours: "72_hours",
  liveSupportTime: "48_to_72_business_hours",
};

const DEFAULT_LIMITS = {
  maxUploads: -1,
  maxCollaborators: 1,
  maxDistributionChannels: 10,
};


const FEATURE_ORDER = [
  "unlimitedReleases",
  "unlimitedArtists",
  "singleLabel",
  "revenueShare",
  "youtubeContentId",
  "metaContentId",
  "tiktokContentId",
  "youtubeOac",
  "analyticsCenter",
  "royaltyClaimCentre",
  "merchandisePanel",
  "dolbyAtmos",
  "spotifyDiscoveryMode",
  "playlistPitching",
  "synchronization",
  "fanLinksBuilder",
  "mahiAi",
  "youtubeMcnAccess",
  "available150Stores",
  "worldwideAvailability",
  "freeUpcCode",
  "freeIsrcCode",
  "lifetimeAvailability",
  "supportHours",
  "liveSupportTime",
];

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

const SUPPORT_OPTIONS = [
  { value: "24_hours", label: "24 Hours" },
  { value: "48_hours", label: "48 Hours" },
  { value: "72_hours", label: "72 Hours" },
];

const LIVE_PROCESS_OPTIONS = [
  { value: "48_to_72_business_hours", label: "48 to 72 Business Hours" },
  { value: "24_to_48_business_hours", label: "24 to 48 Business Hours" },
  { value: "instant", label: "Instant" },
];


function toDateTimeLocalString(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


function fromDateTimeLocalToISO(localString) {
  if (!localString) return undefined;
  const d = new Date(localString);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export default function CreateSubscriptionPlanModal({
  isOpen,
  onClose,
  planData = null,
  theme = "dark",
  categories = [],
}) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    planId: "",
    name: "",
    description: "",
    price: { current: 0, original: 0 },
    currency: "INR",
    interval: "month",
    intervalCount: 1,
    features: { ...DEFAULT_FEATURES },
    isPopular: false,
    isBestValue: false,
    displayOrder: 0,
    limits: { maxUploads: -1, maxCollaborators: 1, maxDistributionChannels: 10 },
    trial: { enabled: false, days: 0 },
    discount: { enabled: false, percentage: 0, validUntil: "" },
  });


  useEffect(() => {
    if (isOpen && planData) {
      setForm({
        planId: planData.planId ?? "",
        name: planData.name ?? "",
        description: planData.description ?? "",
        price: {
          current: planData.price?.current ?? 0,
          original: planData.price?.original ?? 0,
        },
        currency: planData.currency ?? "INR",
        interval: planData.interval ?? "month",
        intervalCount: planData.intervalCount ?? 1,
        features: { ...DEFAULT_FEATURES, ...(planData.features || {}) },
        isPopular: planData.isPopular ?? false,
        isBestValue: planData.isBestValue ?? false,
        displayOrder: planData.displayOrder ?? 0,
        limits: {
          maxUploads: planData.limits?.maxUploads ?? -1,
          maxCollaborators: planData.limits?.maxCollaborators ?? 1,
          maxDistributionChannels:
            planData.limits?.maxDistributionChannels ?? 10,
        },
        trial: {
          enabled: planData.trial?.enabled ?? false,
          days: planData.trial?.days ?? 0,
        },
        discount: {
          enabled: planData.discount?.enabled ?? false,
          percentage: planData.discount?.percentage ?? 0,
          validUntil: planData.discount?.validUntil ?? "",
        },
      });
    }

    if (!isOpen && !planData) {
      setForm({
        planId: "",
        name: "",
        description: "",
        price: { current: 0, original: 0 },
        currency: "INR",
        interval: "month",
        intervalCount: 1,
        features: { ...DEFAULT_FEATURES },
        isPopular: false,
        isBestValue: false,
        displayOrder: 0,
        limits: { ...DEFAULT_LIMITS },
        trial: { enabled: false, days: 0 },
        discount: { enabled: false, percentage: 0, validUntil: "" },
      });
    }
  }, [isOpen, planData]);


  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setNested = (objKey, k, v) =>
    setForm((p) => ({ ...p, [objKey]: { ...p[objKey], [k]: v } }));


  function buildFeaturesPayload(features) {
    const payload = {};
    Object.keys(features).forEach((k) => {
      if (k === "revenueShare") {
        if (features.revenueShare?.enabled) {
          payload.revenueShare = { percentage: Number(features.revenueShare.percentage) || 0 };
        }

      } else if (k === "supportHours" || k === "liveSupportTime") {
        payload[k] = features[k] || (k === "supportHours" ? "24_business_hours" : "48_to_72_business_hours");
      } else {

        payload[k] = !!features[k];
      }
    });
    return payload;
  }

  const handleSubmit = async () => {

    if (!form.planId || !form.name || form.price.current === "") {
      alert("Plan ID, name and current price are required.");
      return;
    }

    const featuresPayload = buildFeaturesPayload(form.features);

    const payload = {
      planId: form.planId,
      name: form.name.trim(),
      description: form.description?.trim() || "No description provided",
      price: {
        current: Number(form.price.current),
        original: Number(form.price.original ?? form.price.current ?? 0),
      },
      currency: (form.currency || "INR").toUpperCase(),
      interval: form.interval,
      intervalCount: Number(form.intervalCount) || 1,
      features: featuresPayload,
      isPopular: !!form.isPopular,
      isBestValue: !!form.isBestValue,
      displayOrder: Number(form.displayOrder) || 0,
      limits: {
        maxUploads: Number(form.limits.maxUploads ?? -1),
        maxCollaborators: Number(form.limits.maxCollaborators ?? 1),
        maxDistributionChannels: Number(form.limits.maxDistributionChannels ?? 10),
      },
      trial: { enabled: !!form.trial.enabled, days: Number(form.trial.days) || 0 },
      discount: form.discount?.enabled
        ? {
          enabled: true,
          percentage: Number(form.discount.percentage) || 0,
          validUntil: fromDateTimeLocalToISO(form.discount.validUntil) || undefined,
        }
        : { enabled: false, percentage: 0 },
    };

    try {
      setLoading(true);
      if (planData) {
        const planIdForApi = planData.planId || planData.id || planData._id;
        await GlobalApi.updatePlan(planIdForApi, payload);
      } else {
        await GlobalApi.createSubscriptionPlan(payload);
      }
      onClose && onClose();
    } catch (err) {
      console.error("Plan save error:", err);
      alert("Failed to save plan — see console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(open) => {
        if (!open) onClose && onClose();
      }}
    >
      <DialogContent
        className={`max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-2xl shadow-lg ${isDark ? "bg-[#0f1720] text-gray-200 border border-gray-800/30" : "bg-white text-[#151F28] border border-gray-200"
          }`}
      >
        <DialogHeader
          className={`p-4 ${isDark ? "border-b border-gray-800/30" : "border-b border-gray-200"}`}
        >
          <DialogTitle>{planData ? "Edit Plan" : "Create Subscription Plan"}</DialogTitle>
        </DialogHeader>


        <div className="flex flex-col">
          <ScrollArea className="px-6 py-4 max-h-[68vh] overflow-auto">

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Plan ID</Label>
                <Select
                  onValueChange={(v) => setField("planId", v)}
                  value={form.planId}
                >
                  <SelectTrigger
                    className={`w-full h-10 rounded-md ${isDark ? "bg-[#111827] text-gray-200" : "bg-white text-[#151F28]"}`}
                  >
                    <SelectValue placeholder="Select Plan ID" />
                  </SelectTrigger>
                  <SelectContent className={`rounded-md shadow-lg ${isDark ? "bg-[#0b1220] text-gray-200" : "bg-white text-[#151F28]"}`}>
                    {PLAN_IDS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.displayOrder ?? ""}
                  onChange={(e) => setField("displayOrder", e.target.value ? Number(e.target.value) : "")}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-3">
              <div>
                <Label>Plan Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  value={form.currency}
                  onChange={(e) => setField("currency", e.target.value.toUpperCase())}
                  className="h-10"
                />
              </div>
            </div>

            <div className="mt-3">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="min-h-[92px] resize-vertical"
              />
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Current Price</Label>
                <Input
                  type="number"
                  value={form.price.current}
                  onChange={(e) =>
                    setField("price", { ...form.price, current: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={form.price.original}
                  onChange={(e) =>
                    setField("price", { ...form.price, original: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-3">
              <div>
                <Label>Interval</Label>
                <Select
                  onValueChange={(v) => setField("interval", v)}
                  value={form.interval}
                >
                  <SelectTrigger className={`w-full h-10 ${isDark ? "bg-[#111827] text-gray-200" : "bg-white text-[#151F28]"}`}>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className={`${isDark ? "bg-[#0b1220] text-gray-200" : "bg-white text-[#151F28]"} rounded-md shadow-lg`}>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interval Count</Label>
                <Input
                  type="number"
                  value={form.intervalCount ?? ""}
                  onChange={(e) =>
                    setField(
                      "intervalCount",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="h-10"
                />

              </div>
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div>
              <Label>Features</Label>
              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                {FEATURE_ORDER.map((key) => {
                  const val = form.features?.[key];

                  if (key === "revenueShare") {
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between px-3 py-2 rounded-md ${isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-100"
                          }`}
                      >
                        <div className="text-sm">{FEATURE_LABELS[key]}</div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!val?.enabled}
                            onCheckedChange={(checked) =>
                              setNested("features", "revenueShare", {
                                ...(val || { percentage: 0 }),
                                enabled: checked,
                              })
                            }
                          />
                          {form.features.revenueShare?.enabled && (
                            <Input
                              type="number"
                              className="w-[80px] h-8"
                              value={form.features.revenueShare.percentage ?? ""}
                              onChange={(e) =>
                                setNested("features", "revenueShare", {
                                  ...form.features.revenueShare,
                                  percentage: e.target.value === "" ? "" : Number(e.target.value),
                                })
                              }
                            />
                          )}

                        </div>
                      </div>
                    );
                  }

                    if (key === "supportHours" || key === "liveSupportTime") {
                      const options = key === "supportHours" ? SUPPORT_OPTIONS : LIVE_PROCESS_OPTIONS;
                      return (
                        <div
                          key={key}
                          className={`flex items-center justify-between px-3 py-2 rounded-md ${isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-100"
                            }`}
                        >
                          <div className="text-sm">{FEATURE_LABELS[key]}</div>
                          <Select
                            onValueChange={(v) => setNested("features", key, v)}
                            value={form.features[key]}
                          >
                            <SelectTrigger className="w-[180px] h-9">
                              <SelectValue placeholder="Select Option" />
                            </SelectTrigger>
                            <SelectContent className={`${isDark ? "bg-[#0b1220] text-gray-200" : "bg-white text-[#151F28]"} rounded-md shadow-lg`}>
                              {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }


                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-3 py-2 rounded-md ${isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-100"
                        }`}
                    >
                      <div className="text-sm">{FEATURE_LABELS[key] ?? key}</div>
                      <Switch
                        checked={!!val}
                        onCheckedChange={(checked) => setNested("features", key, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div>
              <Label>Limits</Label>
              <div className="grid sm:grid-cols-3 gap-2 mt-2">
                <div>
                  <Label className="capitalize text-xs">max uploads</Label>
                  <Input
                    type="number"
                    value={form.limits.maxUploads ?? ""}
                    onChange={(e) =>
                      setNested(
                        "limits",
                        "maxUploads",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="capitalize text-xs">max collaborators</Label>
                  <Input
                    type="number"
                    value={form.limits.maxCollaborators ?? ""}
                    onChange={(e) =>
                      setNested(
                        "limits",
                        "maxCollaborators",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="capitalize text-xs">max distribution channels</Label>
                  <Input
                    type="number"
                    value={form.limits.maxDistributionChannels ?? ""}
                    onChange={(e) =>
                      setNested(
                        "limits",
                        "maxDistributionChannels",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div>
              <Label>Trial</Label>
              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={form.trial.enabled}
                  onCheckedChange={(checked) => setNested("trial", "enabled", checked)}
                />
                <Label>Enabled</Label>
                {form.trial.enabled && (
                  <Input
                    type="number"
                    value={form.trial.days ?? ""}
                    onChange={(e) =>
                      setNested(
                        "trial",
                        "days",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-[100px] h-10"
                  />
                )}
              </div>
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div>
              <Label>Discount</Label>
              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={form.discount.enabled}
                  onCheckedChange={(checked) => setNested("discount", "enabled", checked)}
                />
                <Label>Enabled</Label>
              </div>

              {form.discount.enabled && (
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label>Percentage</Label>
                    <Input
                      type="number"
                      value={form.discount.percentage ?? ""}
                      onChange={(e) =>
                        setNested(
                          "discount",
                          "percentage",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label>Valid Until</Label>
                    <Input
                      type="datetime-local"
                      value={form.discount.validUntil}
                      onChange={(e) => setNested("discount", "validUntil", e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              )}
            </div>


            <Separator className={`${isDark ? "border-gray-800/30" : "border-gray-200"}`} />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isPopular}
                  onCheckedChange={(c) => setField("isPopular", c)}
                />
                <Label>Is Popular</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isBestValue}
                  onCheckedChange={(c) => setField("isBestValue", c)}
                />
                <Label>Is Best Value</Label>
              </div>
            </div>
          </ScrollArea>


          <div className={`p-4 flex justify-end gap-3 ${isDark ? "border-t border-gray-800/30" : "border-t border-gray-200"}`}>
            <Button
              variant="outline"
              onClick={() => {
                onClose && onClose();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (planData ? "Updating..." : "Saving...") : planData ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
