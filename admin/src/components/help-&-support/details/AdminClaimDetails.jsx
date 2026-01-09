import React from 'react';

const DetailItem = ({ label, value, isLink = false }) => (
    <div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
        {isLink ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-400 hover:underline break-all mt-1 block">
                {value || 'N/A'}
            </a>
        ) : (
            <p className="text-sm font-semibold mt-1">{value || 'N/A'}</p>
        )}
    </div>
);

const AdminClaimDetailsCard = ({ claims, type }) => {

    const getLinkFields = () => {
        switch (type) {
            case 'META_MANUAL_CLAIM':
            case 'META_CLAIM_RELEASE':
                return { link1: 'Meta Video Link', link2: 'Meta Audio Link' };
            case 'YOUTUBE_MANUAL_CLAIM':
            case 'YOUTUBE_CLAIM_RELEASE':
                return { link1: 'YouTube Video Link', link2: 'Official Video Link' };
            default:
                return { link1: 'Link 1', link2: 'Link 2' };
        }
    };

    return (
        <div className="mt-8">
            <h4 className="text-md font-semibold mb-4">Claim Details</h4>
            <div className="space-y-4">
                {claims?.map((claim, index) => (
                    <div key={index} className="p-4 rounded-lg" style={{ background: "var(--bg-main)" }}>
                        <h5 className="font-semibold mb-3">Claim #{index + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label={getLinkFields().link1} value={claim.metaVideoLink || claim.youtubeVideoLink} isLink />
                            <DetailItem label={getLinkFields().link2} value={claim.metaAudioLink || claim.officialVideoLink} isLink />
                            <DetailItem label="ISRC" value={claim.isrc} />
                            {(claim.startTime || claim.endTime) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem label="Start Time" value={claim.startTime} />
                                    <DetailItem label="End Time" value={claim.endTime} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDefaultClaimDetails = ({ details, type }) => {
    if (!details) return null;

    return (
        <>
            <div className="grid grid-cols-3 gap-8 mt-10">
                <DetailItem label="Full Name" value={details.fullName} />
                <DetailItem label="Contact Email" value={details.email} />
                <DetailItem label="Mobile Number" value={details.mobile} />
            </div>
            <AdminClaimDetailsCard claims={details.claims} type={type} />
        </>
    );
};

export default AdminDefaultClaimDetails;
