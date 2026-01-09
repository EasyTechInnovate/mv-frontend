import React, { useState, useEffect } from 'react';

// Enums copied from EditTicketModal for now
export const ENormalTicketCategory = {
    GENERAL_QUESTIONS: 'General Questions',
    WITHDRAWAL_QUESTIONS: 'Withdrawal Questions',
    SUBSCRIPTION_RELATED: 'Subscription Related',
    PAYMENT_AND_REFUNDS: 'Payment and Refunds',
    OWNERSHIP_COPYRIGHT_ISSUES: 'Ownership/Copyright Related Issues',
    ACCOUNT_DELETION_CANCELLATION: 'Account Deletion/Membership Cancellation',
    COPYRIGHT_CLAIMS: 'Copyright Claims - YouTube, Meta, etc',
    OAC_REQUESTS: 'OAC Requests',
    CONNECT_SOCIAL_MEDIA: 'Connect/Correct Social Media Profiles',
    ARTIFICIAL_STREAMING: 'Artificial Streaming/Infringement',
    RELEASE_ISSUES: 'Release - Delivery, Takedown, Edit',
    OTHER: 'Other'
};


const FormRow = ({ label, children }) => (
    <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>
            {label}
        </label>
        <div className="mt-1">{children}</div>
    </div>
);

const AdminNormalTicketForm = ({ initialDetails, onDetailsChange }) => {

    const [details, setDetails] = useState({
        description: '',
        category: '',
        attachments: [],
        ...initialDetails
    });

    useEffect(() => {
        onDetailsChange(details);
    }, [details]);


    const handleChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleAttachmentChange = (e) => {
        const fileUrl = e.target.value;
        const newAttachments = fileUrl ? [{ fileName: 'Attachment', fileUrl, fileSize: 0 }] : [];
        handleChange('attachments', newAttachments);
    };

    return (
        <div className="space-y-4">
             <FormRow label="Category">
                <select
                    value={details.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                    style={{
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    }}
                >
                    <option value="">Select Category</option>
                    {Object.values(ENormalTicketCategory).map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                    ))}
                </select>
            </FormRow>

            <FormRow label="Description">
                <textarea
                    rows={6}
                    value={details.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full mt-1 rounded-lg px-3 py-2 text-sm resize-none"
                    style={{
                        background: "var(--surface)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                    }}
                />
            </FormRow>

             <FormRow label="Attachment Link">
                <input
                    value={details.attachments?.[0]?.fileUrl || ''}
                    onChange={handleAttachmentChange}
                    className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
                    style={{
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    }}
                />
            </FormRow>
        </div>
    );
};

export default AdminNormalTicketForm;
