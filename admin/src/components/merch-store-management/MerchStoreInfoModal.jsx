"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function MerchStoreInfoModal({ open,
  onClose,
  storeId,
  theme,
  data, }) {
  if (!data) return null;

  const {
    artistInfo = {},
    userId = {},
    productPreferences = {},
    marketingPlan = {},
    legalConsents = {},
    status,
    createdAt,
    updatedAt,
  } = data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl border border-[#24303A] text-white"
        style={{ background: "#111A22" }}
      >
        <DialogHeader>
          <DialogTitle className="text-white tracking-wide text-lg">
            Merch Store Details
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="space-y-6">

            {/* Artist Info */}
            <Section title="Artist Information">
              <Field label="Artist Name" value={artistInfo.artistName} />
              <Field label="Account ID" value={data.accountId} />
              <Field label="First Name" value={userId.firstName} />
              <Field label="Last Name" value={userId.lastName} />
              <Field label="Email" value={userId.emailAddress} />
            </Section>

            {/* Social Links */}
            <Section title="Social Profiles">
              <Field label="Instagram" value={artistInfo.instagramLink} isLink />
              <Field label="Facebook" value={artistInfo.facebookLink} isLink />
              <Field label="Spotify" value={artistInfo.spotifyProfileLink} isLink />
              <Field label="Apple Music" value={artistInfo.appleMusicProfileLink} isLink />
              <Field label="YouTube Music" value={artistInfo.youtubeMusicProfileLink} isLink />
            </Section>

            {/* Product Preferences */}
            <Section title="Product Preferences">
              <Field
                label="Selected Products"
                value={(productPreferences.selectedProducts || []).join(", ")}
              />
              {productPreferences.otherProductDescription ? (
                <Field
                  label="Other Description"
                  value={productPreferences.otherProductDescription}
                />
              ) : null}
            </Section>

            {/* Marketing Plan */}
            <Section title="Marketing & Launch Plan">
              <Field
                label="Will Promote"
                value={marketingPlan.planToPromote ? "Yes" : "No"}
              />
              <Field
                label="Channels"
                value={
                  marketingPlan.promotionChannels?.length
                    ? marketingPlan.promotionChannels.join(", ")
                    : "—"
                }
              />
              <Field
                label="MMC Assistance"
                value={marketingPlan.mmcMarketingAssistance ? "Yes" : "No"}
              />
            </Section>

            {/* Legal */}
            <Section title="Legal Consents">
              <Field
                label="Review Process"
                value={legalConsents.agreeToReviewProcess ? "Agreed" : "No"}
              />
              <Field
                label="Revision Rights"
                value={legalConsents.understandRevisionRights ? "Understood" : "No"}
              />
              <Field
                label="Showcase Consent"
                value={legalConsents.consentToShowcase ? "Granted" : "No"}
              />
            </Section>

            {/* Status */}
            <Section title="Request Status">
              <Field label="Status" value={status} />
              <Field
                label="Submitted"
                value={new Date(createdAt).toLocaleString()}
              />
              <Field
                label="Last Updated"
                value={new Date(updatedAt).toLocaleString()}
              />
            </Section>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onClose(false)} className="bg-[#24303A] text-white hover:bg-[#2F3C48]">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Shared Section Component -------- */
function Section({ title, children }) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: "#151F28", border: "1px solid #24303A" }}
    >
      <h3 className="font-medium text-base text-white/90">{title}</h3>
      <Separator className="bg-[#24303A]" />
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* -------- Shared Field Component -------- */
function Field({ label, value, isLink = false }) {
  return (
    <div className="flex justify-between items-start">
      <p className="text-white/70 text-sm">{label}</p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          className="text-blue-400 underline text-sm max-w-[60%] text-right break-all"
        >
          {value || "—"}
        </a>
      ) : (
        <p className="text-white text-sm max-w-[60%] text-right break-words">
          {value || "—"}
        </p>
      )}
    </div>
  );
}
