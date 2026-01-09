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

const SelectField = (props) => (
    <select
        {...props}
        className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
        style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
        }}
    />
);


const AdminMetaProfileMappingForm = ({ initialDetails, onDetailsChange }) => {
    const [details, setDetails] = useState({
        fullName: '',
        email: '',
        mobile: '',
        mapType: 'Both',
        facebookPageUrl: '',
        instagramProfileUrl: '',
        isrcs: [''],
        ...initialDetails,
    });

    useEffect(() => {
        onDetailsChange(details);
    }, [details]);

    const handleIsrcChange = (index, value) => {
        const newIsrcs = [...details.isrcs];
        newIsrcs[index] = value;
        setDetails(prev => ({...prev, isrcs: newIsrcs}));
    };

    const addIsrc = () => {
        setDetails(prev => ({...prev, isrcs: [...prev.isrcs, '']}));
    };

    const removeIsrc = (index) => {
        if (details.isrcs.length > 1) {
            const newIsrcs = details.isrcs.filter((_, i) => i !== index);
            setDetails(prev => ({...prev, isrcs: newIsrcs}));
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormRow label="Full Name"><InputField value={details.fullName} onChange={(e) => setDetails(prev => ({...prev, fullName: e.target.value}))} /></FormRow>
                <FormRow label="Email"><InputField value={details.email} onChange={(e) => setDetails(prev => ({...prev, email: e.target.value}))} /></FormRow>
                <FormRow label="Mobile"><InputField value={details.mobile} onChange={(e) => setDetails(prev => ({...prev, mobile: e.target.value}))} /></FormRow>
                <FormRow label="Map Type">
                    <SelectField value={details.mapType} onChange={(e) => setDetails(prev => ({...prev, mapType: e.target.value}))}>
                        <option value="Facebook Page">Facebook Page</option>
                        <option value="Instagram Profile">Instagram Profile</option>
                        <option value="Both">Both</option>
                    </SelectField>
                </FormRow>
            </div>
            
            {(details.mapType === 'Facebook Page' || details.mapType === 'Both') && (
                <FormRow label="Facebook Page URL"><InputField value={details.facebookPageUrl} onChange={(e) => setDetails(prev => ({...prev, facebookPageUrl: e.target.value}))} /></FormRow>
            )}
            {(details.mapType === 'Instagram Profile' || details.mapType === 'Both') && (
                <FormRow label="Instagram Profile URL"><InputField value={details.instagramProfileUrl} onChange={(e) => setDetails(prev => ({...prev, instagramProfileUrl: e.target.value}))} /></FormRow>
            )}

            <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>ISRCs</label>
                {details.isrcs.map((isrc, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                        <InputField value={isrc} onChange={(e) => handleIsrcChange(index, e.target.value)} />
                        {details.isrcs.length > 1 && (
                            <button onClick={() => removeIsrc(index)} className="text-red-500"><Trash2 size={16} /></button>
                        )}
                    </div>
                ))}
                <button onClick={addIsrc} className="w-full text-sm py-2 mt-2 rounded-lg" style={{ background: "var(--surface)" }}>+ Add ISRC</button>
            </div>
        </div>
    );
};

export default AdminMetaProfileMappingForm;
