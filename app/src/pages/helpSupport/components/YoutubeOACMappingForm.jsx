import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

// Reusable FormField component
const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const YoutubeOACMappingForm = ({ onSubmit, isLoading, user }) => {
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.emailAddress || '');
    const [mobile, setMobile] = useState(user?.mobileNumber || '');
    const [mapType, setMapType] = useState('OAC');
    const [topicChannelLink, setTopicChannelLink] = useState('');
    const [youtubeOacTopicLink, setYoutubeOacTopicLink] = useState('');
    const [artTrackLink, setArtTrackLink] = useState('');
    const [isrc, setIsrc] = useState('');
    const [confirmation, setConfirmation] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!fullName || !email || !mobile || !mapType) {
            toast.error('Please fill out all personal and mapping details.');
            return;
        }

        if (mapType === 'OAC') {
            if (!topicChannelLink || !youtubeOacTopicLink) {
                toast.error('Please provide both Topic Channel Link and YouTube OAC/Topic Link for OAC mapping.');
                return;
            }
        } else if (mapType === 'Release') {
            if (!youtubeOacTopicLink || !artTrackLink || !isrc) {
                toast.error('Please provide YouTube OAC/Topic Link, Art Track Link, and ISRC for Release mapping.');
                return;
            }
        }

        if (!confirmation) {
            toast.error('You must agree to the terms to submit.');
            return;
        }

        const details = {
            fullName,
            email,
            mobile,
            mapType,
            topicChannelLink,
            youtubeOacTopicLink,
            artTrackLink,
            isrc,
            confirmation,
        };
        onSubmit(details);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" required>
                    <Input placeholder="Enter your full name" className="border-slate-700" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FormField>
                <FormField label="Account ID">
                    <Input placeholder="Your account ID" className="border-slate-700" value={user?.accountId || 'N/A'} disabled />
                </FormField>
                <FormField label="Email Associated with Account" required>
                    <Input placeholder="your@email.com" className="border-slate-700" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormField>
                <FormField label="Mobile Number" required>
                    <Input placeholder="Enter your mobile number" className="border-slate-700" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </FormField>
                <FormField label="Which OAC/Release do you want to Map?" required>
                    <Select onValueChange={setMapType} value={mapType}>
                        <SelectTrigger className="border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OAC">OAC</SelectItem>
                            <SelectItem value="Release">Release</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            {mapType === 'OAC' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Topic Channel Link" required>
                        <Input placeholder="https://www.youtube.com/channel/..." className="border-slate-700" value={topicChannelLink} onChange={(e) => setTopicChannelLink(e.target.value)} />
                    </FormField>
                    <FormField label="YouTube OAC/Topic Link" required>
                        <Input placeholder="https://www.youtube.com/channel/..." className="border-slate-700" value={youtubeOacTopicLink} onChange={(e) => setYoutubeOacTopicLink(e.target.value)} />
                    </FormField>
                </div>
            )}

            {mapType === 'Release' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="YouTube OAC/Topic Link" required>
                        <Input placeholder="https://www.youtube.com/channel/..." className="border-slate-700" value={youtubeOacTopicLink} onChange={(e) => setYoutubeOacTopicLink(e.target.value)} />
                    </FormField>
                    <FormField label="Art Track Link" required>
                        <Input placeholder="https://www.youtube.com/watch?v=..." className="border-slate-700" value={artTrackLink} onChange={(e) => setArtTrackLink(e.target.value)} />
                    </FormField>
                    <FormField label="ISRC Of the release" required>
                        <Input placeholder="e.g., QZ1234567890" className="border-slate-700" value={isrc} onChange={(e) => setIsrc(e.target.value)} />
                    </FormField>
                </div>
            )}

            <div className="flex items-start space-x-3">
                <input type="checkbox" id="confirm-oac-mapping" className="rounded mt-1" checked={confirmation} onChange={(e) => setConfirmation(e.target.checked)} />
                <label htmlFor="confirm-oac-mapping" className="text-sm">
                    I agree that I willingly ready to release My YouTube claim from the video links that I have provided in this form.
                </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                {isLoading ? 'Submitting...' : 'Submit OAC/Release Mapping Request'}
            </Button>
        </form>
    );
};

export default YoutubeOACMappingForm;
