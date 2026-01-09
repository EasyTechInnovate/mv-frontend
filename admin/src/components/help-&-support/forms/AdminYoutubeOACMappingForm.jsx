import React, { useState, useEffect } from 'react';

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

const AdminYoutubeOACMappingForm = ({ initialDetails, onDetailsChange }) => {
    const [details, setDetails] = useState({
        fullName: '',
        email: '',
        mobile: '',
        mapType: 'OAC',
        topicChannelLink: '',
        youtubeOacTopicLink: '',
        artTrackLink: '',
        isrc: '',
        ...initialDetails,
    });

    useEffect(() => {
        onDetailsChange(details);
    }, [details]);

    const handleChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormRow label="Full Name"><InputField value={details.fullName} onChange={(e) => handleChange('fullName', e.target.value)} /></FormRow>
                <FormRow label="Email"><InputField value={details.email} onChange={(e) => handleChange('email', e.target.value)} /></FormRow>
                <FormRow label="Mobile"><InputField value={details.mobile} onChange={(e) => handleChange('mobile', e.target.value)} /></FormRow>
                <FormRow label="Map Type">
                    <SelectField value={details.mapType} onChange={(e) => handleChange('mapType', e.target.value)}>
                        <option value="OAC">OAC</option>
                        <option value="Release">Release</option>
                    </SelectField>
                </FormRow>
            </div>

            {details.mapType === 'OAC' && (
                <div className="grid grid-cols-2 gap-4">
                    <FormRow label="Topic Channel Link"><InputField value={details.topicChannelLink} onChange={(e) => handleChange('topicChannelLink', e.target.value)} /></FormRow>
                    <FormRow label="YouTube OAC/Topic Link"><InputField value={details.youtubeOacTopicLink} onChange={(e) => handleChange('youtubeOacTopicLink', e.target.value)} /></FormRow>
                </div>
            )}

            {details.mapType === 'Release' && (
                <div className="grid grid-cols-2 gap-4">
                    <FormRow label="YouTube OAC/Topic Link"><InputField value={details.youtubeOacTopicLink} onChange={(e) => handleChange('youtubeOacTopicLink', e.target.value)} /></FormRow>
                    <FormRow label="Art Track Link"><InputField value={details.artTrackLink} onChange={(e) => handleChange('artTrackLink', e.target.value)} /></FormRow>
                    <FormRow label="ISRC"><InputField value={details.isrc} onChange={(e) => handleChange('isrc', e.target.value)} /></FormRow>
                </div>
            )}
        </div>
    );
};

export default AdminYoutubeOACMappingForm;
