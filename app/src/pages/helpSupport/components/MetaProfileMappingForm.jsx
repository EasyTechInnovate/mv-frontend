import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
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

const MetaProfileMappingForm = ({ onSubmit, isLoading, user }) => {
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.emailAddress || '');
    const [mobile, setMobile] = useState(user?.mobileNumber || '');
    const [mapType, setMapType] = useState('Both');
    const [facebookPageUrl, setFacebookPageUrl] = useState('');
    const [instagramProfileUrl, setInstagramProfileUrl] = useState('');
    const [isrcs, setIsrcs] = useState(['']);
    const [confirmation, setConfirmation] = useState(false);

    const handleIsrcChange = (index, value) => {
        const newIsrcs = [...isrcs];
        newIsrcs[index] = value;
        setIsrcs(newIsrcs);
    };

    const addIsrc = () => {
        setIsrcs([...isrcs, '']);
    };

    const removeIsrc = (index) => {
        if (isrcs.length > 1) {
            const newIsrcs = isrcs.filter((_, i) => i !== index);
            setIsrcs(newIsrcs);
        } else {
            toast.error("You must have at least one ISRC.");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!fullName || !email || !mobile || !mapType) {
            toast.error('Please fill out all personal and mapping details.');
            return;
        }

        if ((mapType === 'Facebook Page' || mapType === 'Both') && !facebookPageUrl) {
            toast.error('Please provide a Facebook Page URL.');
            return;
        }
        if ((mapType === 'Instagram Profile' || mapType === 'Both') && !instagramProfileUrl) {
            toast.error('Please provide an Instagram Profile URL.');
            return;
        }
        if (isrcs.some(isrc => !isrc)) {
            toast.error('Please ensure all ISRC fields are filled.');
            return;
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
            facebookPageUrl,
            instagramProfileUrl,
            isrcs,
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
                <FormField label="Which Profile/Page do you want to Map?" required>
                    <Select onValueChange={setMapType} value={mapType}>
                        <SelectTrigger className="border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Facebook Page">Facebook Page</SelectItem>
                            <SelectItem value="Instagram Profile">Instagram Profile</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(mapType === 'Facebook Page' || mapType === 'Both') && (
                    <FormField label="Facebook Page URL" required>
                        <Input placeholder="https://www.facebook.com/yourpage" className="border-slate-700" value={facebookPageUrl} onChange={(e) => setFacebookPageUrl(e.target.value)} />
                    </FormField>
                )}
                {(mapType === 'Instagram Profile' || mapType === 'Both') && (
                    <FormField label="Instagram Profile URL" required>
                        <Input placeholder="https://www.instagram.com/yourprofile" className="border-slate-700" value={instagramProfileUrl} onChange={(e) => setInstagramProfileUrl(e.target.value)} />
                    </FormField>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">ISRCs of the Release(s)</h3>
                {isrcs.map((isrc, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            placeholder="e.g., QZ1234567890"
                            className="border-slate-700"
                            value={isrc}
                            onChange={(e) => handleIsrcChange(index, e.target.value)}
                        />
                        {isrcs.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeIsrc(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addIsrc} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another ISRC
                </Button>
            </div>

            <div className="flex items-start space-x-3">
                <input type="checkbox" id="confirm-meta-mapping" className="rounded mt-1" checked={confirmation} onChange={(e) => setConfirmation(e.target.checked)} />
                <label htmlFor="confirm-meta-mapping" className="text-sm">
                    I agree that I willingly ready to release My YouTube claim from the video links that I have provided in this form.
                </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                {isLoading ? 'Submitting...' : 'Submit Profile Mapping Request'}
            </Button>
        </form>
    );
};

export default MetaProfileMappingForm;
