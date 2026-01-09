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

const AdminMetaProfileMappingDetails = ({ details }) => {
    if (!details) return null;

    return (
        <>
            <div className="grid grid-cols-3 gap-8 mt-10">
                <DetailItem label="Full Name" value={details.fullName} />
                <DetailItem label="Contact Email" value={details.email} />
                <DetailItem label="Mobile Number" value={details.mobile} />
            </div>
            <div className="grid grid-cols-3 gap-8 mt-10">
                <DetailItem label="Map Type" value={details.mapType} />
                {(details.mapType === 'Facebook Page' || details.mapType === 'Both') && (
                    <DetailItem label="Facebook Page URL" value={details.facebookPageUrl} isLink />
                )}
                {(details.mapType === 'Instagram Profile' || details.mapType === 'Both') && (
                    <DetailItem label="Instagram Profile URL" value={details.instagramProfileUrl} isLink />
                )}
            </div>
             <div className="mt-8">
                <p className="text-xs" style={{ color: "var(--muted)" }}>ISRCs</p>
                <div className="mt-2 p-4 rounded-lg" style={{ background: "var(--bg-main)" }}>
                    <ul className="list-disc list-inside font-semibold text-sm space-y-1">
                        {details.isrcs?.map((isrc, index) => (
                            <li key={index}>{isrc}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminMetaProfileMappingDetails;
