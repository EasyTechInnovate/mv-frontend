import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from "lucide-react";

const FormRow = ({ label, children }) => (
    <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>
            {label}
        </label>
        <div className="mt-1">{children}</div>
    </div>
);

const InputField = (props) => (
    <input
        {...props}
        className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
        style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
        }}
    />
);

const AdminClaimForm = ({ initialDetails, onDetailsChange, type }) => {
    const [details, setDetails] = useState({
        fullName: '',
        email: '',
        mobile: '',
        claims: [{ metaVideoLink: '', youtubeVideoLink: '', officialVideoLink: '', metaAudioLink: '', isrc: '', startTime: '', endTime: '' }],
        ...initialDetails,
    });

    useEffect(() => {
        onDetailsChange(details);
    }, [details]);

    const handleClaimChange = (index, field, value) => {
        const newClaims = [...details.claims];
        newClaims[index][field] = value;
        setDetails(prev => ({ ...prev, claims: newClaims }));
    };

    const addClaim = () => {
        setDetails(prev => ({ ...prev, claims: [...prev.claims, { metaVideoLink: '', youtubeVideoLink: '', officialVideoLink: '', metaAudioLink: '', isrc: '', startTime: '', endTime: '' }] }));
    };

    const removeClaim = (index) => {
        if (details.claims.length > 1) {
            const newClaims = details.claims.filter((_, i) => i !== index);
            setDetails(prev => ({ ...prev, claims: newClaims }));
        }
    };
    
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
    
    const hasTimestamps = type === 'META_MANUAL_CLAIM' || type === 'YOUTUBE_MANUAL_CLAIM';

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormRow label="Full Name"><InputField value={details.fullName} onChange={(e) => setDetails(prev => ({ ...prev, fullName: e.target.value }))} /></FormRow>
                <FormRow label="Email"><InputField value={details.email} onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))} /></FormRow>
                <FormRow label="Mobile"><InputField value={details.mobile} onChange={(e) => setDetails(prev => ({ ...prev, mobile: e.target.value }))} /></FormRow>
            </div>

            {details.claims.map((claim, index) => (
                <div key={index} className="p-3 rounded-lg border relative" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                     <div className="grid grid-cols-2 gap-4">
                        <FormRow label={getLinkFields().link1}><InputField value={claim.metaVideoLink || claim.youtubeVideoLink} onChange={(e) => handleClaimChange(index, type.includes('META') ? 'metaVideoLink' : 'youtubeVideoLink', e.target.value)} /></FormRow>
                        <FormRow label={getLinkFields().link2}><InputField value={claim.metaAudioLink || claim.officialVideoLink} onChange={(e) => handleClaimChange(index, type.includes('META') ? 'metaAudioLink' : 'officialVideoLink', e.target.value)} /></FormRow>
                        <FormRow label="ISRC"><InputField value={claim.isrc} onChange={(e) => handleClaimChange(index, 'isrc', e.target.value)} /></FormRow>
                        {hasTimestamps && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormRow label="Start Time"><InputField value={claim.startTime} onChange={(e) => handleClaimChange(index, 'startTime', e.target.value)} /></FormRow>
                                <FormRow label="End Time"><InputField value={claim.endTime} onChange={(e) => handleClaimChange(index, 'endTime', e.target.value)} /></FormRow>
                            </div>
                        )}
                     </div>
                     {details.claims.length > 1 && (
                        <button onClick={() => removeClaim(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>
                     )}
                </div>
            ))}
            <button onClick={addClaim} className="w-full text-sm py-2 rounded-lg" style={{ background: "var(--surface)" }}>+ Add Claim</button>
        </div>
    );
};

export default AdminClaimForm;
