import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function MVProductionView({ request, onBack }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">MV Production Request Details</h1>
          <p className="text-muted-foreground">
            View complete details of your MV production request
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Owner Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Copyright Owner Name</p>
                <p className="font-medium">{request.ownerInfo.copyrightOwnerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mobile Number</p>
                <p className="font-medium">{request.ownerInfo.mobileNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-medium">{request.ownerInfo.emailOfCopyrightHolder}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Project Title</p>
                <p className="font-medium">{request.projectOverview.projectTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Artist Name</p>
                <p className="font-medium">{request.projectOverview.artistName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Label Name</p>
                <p className="font-medium">{request.projectOverview.labelName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Release Timeline</p>
                <p className="font-medium">{request.projectOverview.releaseTimeline}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Genres</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {request.projectOverview.genres.map(genre => (
                    <span key={genre} className="px-2 py-1 bg-muted rounded text-sm capitalize">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mood</p>
                <p className="font-medium capitalize">{request.projectOverview.mood}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Language</p>
                <p className="font-medium capitalize">{request.projectOverview.language}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Theme</p>
                <p className="font-medium">{request.projectOverview.theme}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Part of Album/EP</p>
                <p className="font-medium">{request.projectOverview.isPartOfAlbumOrEP ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location Preference</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {request.projectOverview.locationPreference?.map(location => (
                    <span key={location} className="px-2 py-1 bg-muted rounded text-sm capitalize">
                      {location.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Request & Ownership */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Request & Ownership Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Budget Requested</p>
                <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.totalBudgetRequested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Proposed Ownership Dilution</p>
                <p className="font-medium">{request.budgetRequestAndOwnershipProposal.proposedOwnershipDilution}%</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-3">Budget Breakdown</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Pre-Production</p>
                    <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.breakdown.preProduction.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Shoot Day</p>
                    <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.breakdown.shootDay.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Post-Production</p>
                    <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.breakdown.postProduction.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Misc/Contingency</p>
                    <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.breakdown.miscellaneousContingency.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Personal Funds Contribution</p>
                <p className="font-medium">{request.budgetRequestAndOwnershipProposal.willContributePersonalFunds ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Personal Funds Amount</p>
                <p className="font-medium">₹{request.budgetRequestAndOwnershipProposal.personalFundsAmount.toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Revenue Sharing Model</p>
                <p className="font-medium capitalize">
                  {request.budgetRequestAndOwnershipProposal.revenueSharingModelProposed === 'hybrid_buyout_royalties' 
                    ? 'Hybrid (Buyout + Royalties)' 
                    : request.budgetRequestAndOwnershipProposal.revenueSharingModelProposed.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketing & Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Marketing & Distribution Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Release via MV Distribution</p>
                <p className="font-medium">{request.marketingAndDistributionPlan.willBeReleasedViaMVDistribution ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Run Ads/Influencer Campaigns</p>
                <p className="font-medium">{request.marketingAndDistributionPlan.planToRunAdsOrInfluencerCampaigns ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Brand or Merch Tie-ins</p>
                <p className="font-medium">{request.marketingAndDistributionPlan.anyBrandOrMerchTieIns ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tie-ins Description</p>
                <p className="font-medium">{request.marketingAndDistributionPlan.brandOrMerchTieInsDescription || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Ownership */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legal & Ownership Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Creative Ownership</p>
                <p className="font-medium">{request.legalAndOwnershipDeclaration.confirmFullCreativeOwnership ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credit MV Production</p>
                <p className="font-medium">{request.legalAndOwnershipDeclaration.agreeToCreditMVProduction ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Share Final Assets</p>
                <p className="font-medium">{request.legalAndOwnershipDeclaration.agreeToShareFinalAssets ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">NDA or Custom Agreement</p>
                <p className="font-medium">{request.legalAndOwnershipDeclaration.requireNDAOrCustomAgreement ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className="px-3 py-1 rounded text-sm bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 capitalize inline-block">
                  {request.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                <p className="font-medium">{new Date(request.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}