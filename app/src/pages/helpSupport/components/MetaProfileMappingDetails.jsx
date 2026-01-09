import React from 'react';

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

const MetaProfileMappingDetails = ({ details }) => {
    if (!details) return null;

    return (
        <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailItem label="Full Name" value={details.fullName} />
                <DetailItem label="Contact Email" value={details.email} />
                <DetailItem label="Mobile Number" value={details.mobile} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <DetailItem label="Map Type" value={details.mapType} />
                {(details.mapType === 'Facebook Page' || details.mapType === 'Both') && (
                    <DetailItem label="Facebook Page URL" value={details.facebookPageUrl} isLink />
                )}
                {(details.mapType === 'Instagram Profile' || details.mapType === 'Both') && (
                    <DetailItem label="Instagram Profile URL" value={details.instagramProfileUrl} isLink />
                )}
            </div>

            <div>
                <p className="text-sm text-muted-foreground mt-4">ISRCs</p>
                <ul className="list-disc list-inside font-semibold">
                    {details.isrcs?.map((isrc, index) => (
                        <li key={index}>{isrc}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MetaProfileMappingDetails;
