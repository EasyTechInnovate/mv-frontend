import React from 'react';

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
        <p className="text-base font-semibold leading-tight mt-1">
            {value || '—'}
        </p>
    </div>
);

const AdminNormalTicketDetails = ({ details }) => {
    if (!details) return null;

    return (
        <>
            <div className="grid grid-cols-3 gap-8 mt-10">
                <div>
                    <DetailItem label="Category" value={details.category} />
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xs" style={{ color: "var(--muted)" }}>Description</p>
                <div className="mt-2 p-4 rounded-lg" style={{ background: "var(--bg-main)" }}>
                    <p className="text-sm whitespace-pre-wrap">{details.description}</p>
                </div>
            </div>
            {details.attachments && details.attachments.length > 0 && (
                 <div className="mt-8">
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Attachment Link</p>
                    <a 
                        href={details.attachments[0].fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-purple-400 hover:underline mt-2 block"
                    >
                        {details.attachments[0].fileUrl}
                    </a>
                </div>
            )}
        </>
    );
};

export default AdminNormalTicketDetails;
