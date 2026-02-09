import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import GlobalApi from "@/lib/GlobalApi";

const ACTION_CONFIG = {
    approve: {
        title: "Approve Releases",
        description: "Are you sure you want to approve the selected releases for review?",
        confirmLabel: "Approve",
        processingLabel: "Approving...",
        successMessage: "Releases approved successfully",
        apiBasic: GlobalApi.approveRelease,
        apiAdvanced: GlobalApi.approveAdvancedRelease,
        variant: "default" 
    },
    reject: {
        title: "Reject Releases",
        description: "Are you sure you want to reject the selected releases? This action cannot be undone.",
        confirmLabel: "Reject",
        processingLabel: "Rejecting...",
        successMessage: "Releases rejected",
        apiBasic: GlobalApi.rejectRelease,
        apiAdvanced: GlobalApi.rejectAdvancedRelease,
        requiresReason: true,
        variant: "destructive"
    },
    start_processing: {
        title: "Start Processing",
        description: "Start processing for the selected releases?",
        confirmLabel: "Start Processing",
        processingLabel: "Processing...",
        successMessage: "Processing started",
        apiBasic: GlobalApi.startProcessingRelease,
        apiAdvanced: GlobalApi.startProcessingAdvancedRelease,
        variant: "default"
    },
    publish: {
        title: "Publish Releases",
        description: "Publish the selected releases?",
        confirmLabel: "Publish",
        processingLabel: "Publishing...",
        successMessage: "Releases published",
        apiBasic: GlobalApi.publishRelease,
        apiAdvanced: GlobalApi.publishAdvancedRelease,
        variant: "default"
    },
    go_live: {
        title: "Go Live",
        description: "Mark selected releases as Live?",
        confirmLabel: "Go Live",
        processingLabel: "Going Live...",
        successMessage: "Releases are now live",
        apiBasic: GlobalApi.goLiveRelease,
        apiAdvanced: GlobalApi.goLiveAdvancedRelease,
        variant: "default"
    },
    process_takedown: {
        title: "Process Takedown",
        description: "Process takedown for selected releases?",
        confirmLabel: "Process Takedown",
        processingLabel: "Processing Takedown...",
        successMessage: "Takedowns processed",
        apiBasic: GlobalApi.processTakedownRequest,
        apiAdvanced: GlobalApi.processTakedownAdvancedRelease,
        variant: "destructive"
    },
    bulk_takedown: {
        title: "Bulk Takedown (Live)",
        description: "Initiate takedown for these live releases? This will remove them from stores.",
        confirmLabel: "Takedown",
        processingLabel: "Taking Down...",
        successMessage: "Takedowns initiated",
        // For Live releases, we use the same process takedown API 
        // assuming the backend handles the transition from Live -> Takedown
        apiBasic: GlobalApi.processTakedownRequest, 
        apiAdvanced: GlobalApi.processTakedownAdvancedRelease,
        requiresReason: true,
        variant: "destructive"
    },
    approve_edit_request: {
        title: "Approve Edit Requests",
        description: "Approve edit requests for selected releases? This will move them to Draft status.",
        confirmLabel: "Approve Requests",
        processingLabel: "Approving...",
        successMessage: "Requests approved",
        apiBasic: GlobalApi.approveEditRequest,
        apiAdvanced: GlobalApi.approveAdvancedEditRequest,
        variant: "default"
    },
    reject_edit_request: {
        title: "Reject Edit Requests",
        description: "Reject edit requests for selected releases?",
        confirmLabel: "Reject Requests",
        processingLabel: "Rejecting...",
        successMessage: "Requests rejected",
        apiBasic: GlobalApi.rejectEditRequest,
        apiAdvanced: GlobalApi.rejectAdvancedEditRequest,
        requiresReason: true,
        variant: "destructive"
    }
};

export default function BulkProcessingModal({
    isOpen,
    onClose,
    selectedReleases = [],
    actionType,
    onComplete,
    theme,
    releaseCategory
}) {
    const isDark = theme === 'dark';
    const [status, setStatus] = useState('idle'); // idle, processing, complete
    const [progress, setProgress] = useState(0);
    const [reason, setReason] = useState('');
    const [results, setResults] = useState({ success: [], failed: [] });
    const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setProgress(0);
            setReason('');
            setResults({ success: [], failed: [] });
            setCurrentProcessingIndex(0);
        }
    }, [isOpen]);

    const config = ACTION_CONFIG[actionType];

    if (!config) return null;

    const handleConfirm = async () => {
        if (config.requiresReason && !reason.trim()) {
            return; // Validate reason
        }

        setStatus('processing');
        const successList = [];
        const failedList = [];

        for (let i = 0; i < selectedReleases.length; i++) {
            setCurrentProcessingIndex(i + 1);
            setProgress(((i + 1) / selectedReleases.length) * 100);
            
            const release = selectedReleases[i];
            // Determine based on prop or release data
            const isAdvanced = releaseCategory === 'advanced' || release.releaseType === 'advanced' || release.releaseCategory === 'advanced' || (release.step1?.releaseInfo?.releaseType === 'advanced'); 
            
            try {
                const apiFn = isAdvanced ? config.apiAdvanced : config.apiBasic;
                const payload = {};
                
                if (config.requiresReason) {
                    payload.reason = reason;
                }

                await apiFn(release.releaseId, payload);
                successList.push({ id: release.releaseId, name: release.releaseName });
            } catch (error) {
                console.error(`Failed to process release ${release.releaseId}`, error);
                failedList.push({ 
                    id: release.releaseId, 
                    name: release.releaseName, 
                    error: error.response?.data?.message || error.message || "Unknown error" 
                });
            }
        }

        setResults({ success: successList, failed: failedList });
        setStatus('complete');
    };

    const handleClose = () => {
        if (status === 'processing') return; // Prevent closing while processing
        onClose();
        if (status === 'complete' && onComplete) {
            onComplete();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={`max-w-md ${isDark ? 'bg-[#151F28] text-gray-200 border-gray-700' : 'bg-white text-gray-900'}`}>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>
                        {status === 'idle' && config.description}
                        {status === 'processing' && `Processing ${currentProcessingIndex} of ${selectedReleases.length}...`}
                        {status === 'complete' && "Bulk action completed."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {status === 'idle' && (
                        <div className="space-y-4">
                            <p className="text-sm">
                                You are about to action <strong>{selectedReleases.length}</strong> releases.
                            </p>
                            
                            {config.requiresReason && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Reason <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea 
                                        value={reason} 
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter reason for this action..."
                                        className={isDark ? 'bg-[#0f1724] border-gray-700' : ''}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="space-y-4">
                            <Progress value={progress} className="h-2" />
                            <p className="text-center text-sm text-gray-500">
                                Please wait, do not close this window.
                            </p>
                        </div>
                    )}

                    {status === 'complete' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                                    <p className="text-xl font-bold text-green-600">{results.success.length}</p>
                                    <p className="text-xs text-green-600/80">Successful</p>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                                    <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                                    <p className="text-xl font-bold text-red-600">{results.failed.length}</p>
                                    <p className="text-xs text-red-600/80">Failed</p>
                                </div>
                            </div>

                            {results.failed.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Failed Items:</p>
                                    <div className={`max-h-32 overflow-y-auto rounded p-2 text-sm ${isDark ? 'bg-black/20' : 'bg-gray-100'}`}>
                                        {results.failed.map((item, idx) => (
                                            <div key={idx} className="mb-1 text-red-500 text-xs">
                                                <span className="font-semibold">[{item.id}] {item.name}:</span> {item.error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {status === 'idle' && (
                        <>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button 
                                variant={config.variant === 'destructive' ? 'destructive' : 'default'}
                                onClick={handleConfirm}
                                disabled={config.requiresReason && !reason.trim()}
                                className={config.variant === 'default' && config.title.includes('Approve') ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                            >
                                {config.confirmLabel} ({selectedReleases.length})
                            </Button>
                        </>
                    )}
                    
                    {status === 'processing' && (
                        <Button disabled>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {config.processingLabel}
                        </Button>
                    )}

                    {status === 'complete' && (
                        <Button onClick={handleClose}>
                            Close & Refresh
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
