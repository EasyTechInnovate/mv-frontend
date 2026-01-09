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

const AdminYoutubeOACMappingDetails = ({ details }) => {
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
            </div>

            <div className="mt-8 p-4 rounded-lg" style={{ background: "var(--bg-main)" }}>
                <h5 className="font-semibold mb-3">Mapping Details</h5>
                {details.mapType === 'OAC' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Topic Channel Link" value={details.topicChannelLink} isLink />
                        <DetailItem label="YouTube OAC/Topic Link" value={details.youtubeOacTopicLink} isLink />
                    </div>
                )}

                {details.mapType === 'Release' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="YouTube OAC/Topic Link" value={details.youtubeOacTopicLink} isLink />
                        <DetailItem label="Art Track Link" value={details.artTrackLink} isLink />
                        <DetailItem label="ISRC" value={details.isrc} />
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminYoutubeOACMappingDetails;
