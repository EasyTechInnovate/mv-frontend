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

const YoutubeOACMappingDetails = ({ details }) => {
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
            </div>

            {details.mapType === 'OAC' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="Topic Channel Link" value={details.topicChannelLink} isLink />
                    <DetailItem label="YouTube OAC/Topic Link" value={details.youtubeOacTopicLink} isLink />
                </div>
            )}

            {details.mapType === 'Release' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="YouTube OAC/Topic Link" value={details.youtubeOacTopicLink} isLink />
                    <DetailItem label="Art Track Link" value={details.artTrackLink} isLink />
                    <DetailItem label="ISRC" value={details.isrc} />
                </div>
            )}
        </div>
    );
};

export default YoutubeOACMappingDetails;
