import React from 'react';

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold">{value || 'N/A'}</p>
    </div>
);

const NormalTicketDetails = ({ details }) => {
    if (!details) return null;

    return (
        <div className="space-y-3 pt-2">
            <DetailItem label="Category" value={details.category} />
            <div>
                <p className="text-muted-foreground mb-1">Description</p>
                <p className="p-3 bg-muted-foreground/10 rounded-md whitespace-pre-wrap">{details.description}</p>
            </div>
            {details.attachments && details.attachments.length > 0 && (
                <div>
                    <p className="text-muted-foreground mb-1">Uploaded Document Link</p>
                    <a 
                        href={details.attachments[0].fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-400 hover:underline"
                    >
                        {details.attachments[0].fileUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

export default NormalTicketDetails;
