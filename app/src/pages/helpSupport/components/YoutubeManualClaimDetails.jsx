import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DetailItem = ({ label, value, isLink = false }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {isLink ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-400 hover:underline break-all">
                {value || 'N/A'}
            </a>
        ) : (
            <p className="font-semibold">{value || 'N/A'}</p>
        )}
    </div>
);

const YoutubeManualClaimDetails = ({ details }) => {
    if (!details) return null;

    return (
        <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailItem label="Full Name" value={details.fullName} />
                <DetailItem label="Contact Email" value={details.email} />
                <DetailItem label="Mobile Number" value={details.mobile} />
            </div>

            <div className="space-y-3">
                <h4 className="text-md font-semibold mt-4">Claim Details</h4>
                {details.claims?.map((claim, index) => (
                    <Card key={index} className="border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-base">Claim #{index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label="YouTube Video Link" value={claim.youtubeVideoLink} isLink />
                                <DetailItem label="Official Video Link" value={claim.officialVideoLink} isLink />
                                <DetailItem label="ISRC" value={claim.isrc} />
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Start Time" value={claim.startTime} />
                                    <DetailItem label="End Time" value={claim.endTime} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default YoutubeManualClaimDetails;
