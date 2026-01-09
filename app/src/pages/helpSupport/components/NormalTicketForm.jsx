import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

// This is a stand-in. In a real app, you'd import this from your constants file.
const ENormalTicketCategory = {
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

const ETicketPriority = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};


// Reusable FormField component
const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const NormalTicketForm = ({ onSubmit, isLoading, user }) => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState(ETicketPriority.MEDIUM);
    const [description, setDescription] = useState('');
    const [documentLink, setDocumentLink] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!subject || !category || !description) {
            toast.error('Please fill out Subject, Category, and Description.');
            return;
        }

        const details = {
            description,
            category,
            contactEmail: user?.emailAddress,
            attachments: documentLink ? [{ fileName: 'Uploaded Document', fileUrl: documentLink, fileSize: 0 }] : [],
        };

        const ticketData = {
            subject,
            priority,
            details,
        };
        
        onSubmit(ticketData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Account ID">
                    <Input value={user?.accountId || 'N/A'} disabled className="border-slate-700" />
                </FormField>
                <FormField label="Contact Email">
                    <Input value={user?.emailAddress || 'N/A'} disabled className="border-slate-700" />
                </FormField>
                <FormField label="Subject" required>
                    <Input name="subject" placeholder="Brief description of your issue" className="border-slate-700" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </FormField>
                <FormField label="Category" required>
                    <Select name="category" onValueChange={setCategory} value={category}>
                        <SelectTrigger className="border-slate-700">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ENormalTicketCategory).map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
                <FormField label="Priority">
                    <Select name="priority" onValueChange={setPriority} defaultValue={priority}>
                        <SelectTrigger className="border-slate-700">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ETicketPriority.LOW}>Low</SelectItem>
                            <SelectItem value={ETicketPriority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={ETicketPriority.HIGH}>High</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
                <FormField label="Uploaded Document Link (Optional)">
                    <Input name="documentLink" placeholder="https://..." className="border-slate-700" value={documentLink} onChange={(e) => setDocumentLink(e.target.value)} />
                </FormField>
            </div>
            <FormField label="Description" required>
                <Textarea 
                    name="description"
                    placeholder="Please provide detailed information about your issue..." 
                    className="border-slate-700 min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormField>
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                {isLoading ? 'Submitting...' : 'Submit Ticket'}
            </Button>
        </form>
    );
};

export default NormalTicketForm;
