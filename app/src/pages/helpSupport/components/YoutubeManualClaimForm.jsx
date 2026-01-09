import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const YoutubeManualClaimForm = ({ onSubmit, isLoading, user }) => {
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.emailAddress || '');
    const [mobile, setMobile] = useState(user?.mobileNumber || '');
    const [confirmation, setConfirmation] = useState(false);
    const [claims, setClaims] = useState([
        { youtubeVideoLink: '', officialVideoLink: '', isrc: '', startTime: '', endTime: '' }
    ]);

    const handleClaimChange = (index, field, value) => {
        const newClaims = [...claims];
        newClaims[index][field] = value;
        setClaims(newClaims);
    };

    const addClaim = () => {
        setClaims([...claims, { youtubeVideoLink: '', officialVideoLink: '', isrc: '', startTime: '', endTime: '' }]);
    };

    const removeClaim = (index) => {
        if (claims.length > 1) {
            const newClaims = claims.filter((_, i) => i !== index);
            setClaims(newClaims);
        } else {
            toast.error("You must have at least one claim.");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!fullName || !email || !mobile) {
            toast.error('Please fill out your personal details.');
            return;
        }

        for (const claim of claims) {
            if (!claim.youtubeVideoLink || !claim.isrc || !claim.startTime || !claim.endTime) {
                toast.error('Please fill all required fields for each claim.');
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
            claims,
            confirmation,
        };
        onSubmit(details);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" required>
                    <Input
                        placeholder="Enter your full name"
                        className="border-slate-700"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </FormField>
                <FormField label="Account ID">
                    <Input
                        placeholder="Your account ID"
                        className="border-slate-700"
                        value={user?.accountId || 'N/A'}
                        disabled
                    />
                </FormField>
                <FormField label="Email Associated with Account" required>
                     <Input
                        placeholder="your@email.com"
                        className="border-slate-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormField>
                <FormField label="Mobile Number" required>
                     <Input
                        placeholder="Enter your mobile number"
                        className="border-slate-700"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </FormField>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Claim Details</h3>
                {claims.map((claim, index) => (
                    <div key={index} className="p-4 border border-slate-700 rounded-lg space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                             <FormField label="YouTube Video Link" required>
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="border-slate-700"
                                    value={claim.youtubeVideoLink}
                                    onChange={(e) => handleClaimChange(index, 'youtubeVideoLink', e.target.value)}
                                />
                            </FormField>
                            <FormField label="Official Video Link (Optional)">
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="border-slate-700"
                                    value={claim.officialVideoLink}
                                    onChange={(e) => handleClaimChange(index, 'officialVideoLink', e.target.value)}
                                />
                            </FormField>
                            <FormField label="ISRC of the Release" required>
                                <Input
                                    placeholder="e.g., QZ1234567890"
                                    className="border-slate-700"
                                    value={claim.isrc}
                                    onChange={(e) => handleClaimChange(index, 'isrc', e.target.value)}
                                />
                            </FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Start Time (hh:mm)" required>
                                    <Input
                                        placeholder="01:23"
                                        className="border-slate-700"
                                        value={claim.startTime}
                                        onChange={(e) => handleClaimChange(index, 'startTime', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="End Time (hh:mm)" required>
                                    <Input
                                        placeholder="02:45"
                                        className="border-slate-700"
                                        value={claim.endTime}
                                        onChange={(e) => handleClaimChange(index, 'endTime', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </div>
                        {claims.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-3 -right-3"
                                onClick={() => removeClaim(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={addClaim} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Claim
                </Button>
            </div>

            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="confirm-youtube-manual"
                    className="rounded mt-1"
                    checked={confirmation}
                    onChange={(e) => setConfirmation(e.target.checked)}
                />
                <label htmlFor="confirm-youtube-manual" className="text-sm">
                    I agree that I willingly ready to claim the video links that I have provided in this form. My Claim is valid and further ready to provide any necessary documentation process if there is so.
                </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                {isLoading ? 'Submitting...' : 'Submit YouTube Manual Claim'}
            </Button>
        </form>
    );
};

export default YoutubeManualClaimForm;
