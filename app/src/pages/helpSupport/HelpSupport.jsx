import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Eye, MessageCircle, Mail, Phone, Play, FileText, Users, Clock, AlertCircle, Plus, Ticket, CheckCircle, Star } from 'lucide-react';

// App Services & State
import { createSupportTicket, getMyTickets, getMyTicketStats, getTicketById, addTicketResponse, addTicketRating, getFaqs, getContactInfo } from '@/services/api.services';
import { useAuthStore } from '@/store/authStore';
import { ETicketType } from '@/config/constants';

// Form Components
import NormalTicketForm from './components/NormalTicketForm';
import MetaClaimReleaseForm from './components/MetaClaimReleaseForm';
import MetaManualClaimForm from './components/MetaManualClaimForm';
import YoutubeClaimReleaseForm from './components/YoutubeClaimReleaseForm';
import YoutubeManualClaimForm from './components/YoutubeManualClaimForm';
import MetaProfileMappingForm from './components/MetaProfileMappingForm';
import YoutubeOACMappingForm from './components/YoutubeOACMappingForm';

// Details Components
import NormalTicketDetails from './components/NormalTicketDetails';
import MetaClaimReleaseDetails from './components/MetaClaimReleaseDetails';
import MetaManualClaimDetails from './components/MetaManualClaimDetails';
import YoutubeClaimReleaseDetails from './components/YoutubeClaimReleaseDetails';
import YoutubeManualClaimDetails from './components/YoutubeManualClaimDetails';
import MetaProfileMappingDetails from './components/MetaProfileMappingDetails';
import YoutubeOACMappingDetails from './components/YoutubeOACMappingDetails';

const HelpSupport = () => {
  const { user } = useAuthStore();
  const [activeMainTab, setActiveMainTab] = useState('tickets');
  const [modalState, setModalState] = useState({ type: null, ticket: null });
  const [claimModal, setClaimModal] = useState({ open: false, type: null, title: '' });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/10';
      case 'in progress':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/10';
      case 'resolved':
        return 'bg-green-500/10 text-green-700 border-green-500/10';
      case 'closed':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/10';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 border-red-500/10';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-500/10';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/10';
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-500/10';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/10';
    }
  };

  // React Query
  const queryClient = useQueryClient();
  const [ticketFilters, setTicketFilters] = useState({ page: 1, limit: 10, status: undefined });

  const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  // API Integrations with React Query
  const { data: ticketsData, isLoading: isLoadingTickets, isError: isTicketsError } = useQuery({
    queryKey: ['myTickets', ticketFilters],
    queryFn: () => getMyTickets(ticketFilters),
    keepPreviousData: true,
  });

  const { data: ticketStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['myTicketStats'],
    queryFn: getMyTicketStats,
  });

  const { data: faqsData, isLoading: isLoadingFaqs, isError: isFaqsError } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
  });

  const { data: contactInfoData, isLoading: isLoadingContactInfo } = useQuery({
    queryKey: ['contactInfo'],
    queryFn: getContactInfo,
  });

  const { data: ticketDetails, isLoading: isLoadingTicketDetails } = useQuery({
    queryKey: ['ticketDetails', modalState.ticket?.ticketId],
    queryFn: () => getTicketById(modalState.ticket.ticketId),
    enabled: !!modalState.ticket && modalState.type === 'details', // Only fetch when a ticket is selected and details modal is open
  });

  const handleMutationSuccess = () => {
    toast.success('Support ticket created successfully!');
    queryClient.invalidateQueries(['myTickets']);
    queryClient.invalidateQueries({ queryKey: ['myTicketStats'] });
    setClaimModal({ open: false, type: null, title: '' });
  };

  const handleMutationError = (error) => {
    let errorMessage = 'Failed to create ticket.';
    if (error.response?.data?.errors) {
      errorMessage = error.response.data.errors.map(e => e.message).join(' \n');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    toast.error(errorMessage);
  };

  const createTicketMutation = useMutation({
    mutationFn: createSupportTicket,
  });

  const addResponseMutation = useMutation({
    mutationFn: addTicketResponse,
    onSuccess: (data, variables) => {
      toast.success('Reply sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['ticketDetails', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
      setModalState({ type: null, ticket: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reply.');
    },
  });

  const addRatingMutation = useMutation({
    mutationFn: addTicketRating,
  });

  const filteredFaqs = React.useMemo(() => {
    if (!faqsData?.data?.faqsByCategory) {
      return {};
    }

    if (!faqSearchQuery) {
      return faqsData.data.faqsByCategory;
    }

    const lowercasedQuery = faqSearchQuery.toLowerCase();
    const filtered = {};

    for (const category in faqsData.data.faqsByCategory) {
      const questions = faqsData.data.faqsByCategory[category];
      const filteredQuestions = questions.filter(faq =>
        faq.question.toLowerCase().includes(lowercasedQuery) ||
        faq.answer.toLowerCase().includes(lowercasedQuery)
      );

      if (filteredQuestions.length > 0) {
        filtered[category] = filteredQuestions;
      }
    }
    return filtered;
  }, [faqsData, faqSearchQuery]);

  const handleClaimSubmit = (details) => {
    const payload = {
        subject: claimModal.title,
        ticketType: claimModal.type,
        details: details,
    };
    createTicketMutation.mutate(payload, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
    });
  };

  const tickets = ticketsData?.data?.tickets || [];
  const pagination = ticketsData?.data?.pagination || {};

  const renderTicketDetails = (ticket) => {
    if (!ticket?.details) return null;

    switch (ticket.ticketType) {
        case ETicketType.NORMAL:
            return <NormalTicketDetails details={ticket.details} />;
        case ETicketType.META_CLAIM_RELEASE:
            return <MetaClaimReleaseDetails details={ticket.details} />;
        case ETicketType.YOUTUBE_CLAIM_RELEASE:
            return <YoutubeClaimReleaseDetails details={ticket.details} />;
        case ETicketType.YOUTUBE_MANUAL_CLAIM:
            return <YoutubeManualClaimDetails details={ticket.details} />;
        case ETicketType.META_PROFILE_MAPPING:
            return <MetaProfileMappingDetails details={ticket.details} />;
        case ETicketType.YOUTUBE_OAC_MAPPING:
            return <YoutubeOACMappingDetails details={ticket.details} />;
        case ETicketType.META_MANUAL_CLAIM:
            return <MetaManualClaimDetails details={ticket.details} />;
        default:
            // Fallback for older tickets or unknown types
            return <p>{ticket.description || 'No additional details available.'}</p>;
    }
  };

  const TicketDetailModal = ({ ticket }) => (
    <Dialog open={modalState.type === 'details'} onOpenChange={() => setModalState({ type: null, ticket: null })}>
      <DialogContent className="max-w-2xl  border-slate-700">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>
        {ticket && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Ticket ID</p>
                <p className="font-semibold">{ticket.ticketId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {isLoadingTicketDetails && <p>Loading details...</p>}
            {ticketDetails?.data && (
              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-muted-foreground mb-1">Subject</p>
                  <p className="font-semibold">{ticketDetails.data.subject}</p>
                </div>
                {renderTicketDetails(ticketDetails.data)}
                {/* TODO: Render responses and attachments */}
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button 
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setModalState({ type: 'reply', ticket })}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Reply
              </Button>
              {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                <Button 
                  variant="outline"
                  onClick={() => setModalState({ type: 'rating', ticket })}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const ReplyModal = ({ ticket }) => {
    const handleReplySubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const message = formData.get('message');
      if (!message?.trim()) {
        toast.error('Reply message cannot be empty.');
        return;
      }
      addResponseMutation.mutate({
        ticketId: ticket.ticketId,
        responseData: { message },
      }, {
        onSuccess: (data, variables) => {
          toast.success('Reply sent successfully!');
          queryClient.invalidateQueries({ queryKey: ['ticketDetails', variables.ticketId] });
          queryClient.invalidateQueries({ queryKey: ['myTickets'] });
          setModalState({ type: null, ticket: null });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to send reply.');
        },
      });
    };

    return (
      <Dialog open={modalState.type === 'reply'} onOpenChange={() => setModalState({ type: null, ticket: null })}>
        <DialogContent className="max-w-lg border-slate-700">
          <DialogHeader>
            <DialogTitle>Reply to Ticket: {ticket?.ticketId}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <FormField label="Your Message" required>
              <Textarea
                name="message"
                placeholder="Type your reply here..."
                className="border-slate-700 min-h-[150px]"
              />
            </FormField>
            {/* TODO: Add attachment functionality if needed */}
            <Button type="submit" disabled={addResponseMutation.isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
              {addResponseMutation.isLoading ? 'Sending...' : 'Send Reply'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const RatingModal = ({ ticket }) => {
    const [rating, setRating] = useState(0);

    const handleRatingSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const feedback = formData.get('feedback');
      if (rating === 0) {
        toast.error('Please select a rating.');
        return;
      }
      addRatingMutation.mutate({
        ticketId: ticket.ticketId,
        ratingData: { rating, feedback },
      }, {
        onSuccess: () => {
            toast.success('Feedback submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['ticketDetails', ticket.ticketId] });
            queryClient.invalidateQueries({ queryKey: ['myTickets'] });
            setModalState({ type: null, ticket: null });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit feedback.');
        }
      });
    };

    return (
      <Dialog open={modalState.type === 'rating'} onOpenChange={() => setModalState({ type: null, ticket: null })}>
        <DialogContent className="max-w-lg border-slate-700">
          <DialogHeader>
            <DialogTitle>Rate Support for Ticket: {ticket?.ticketId}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <FormField label="Rating" required>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} onClick={() => setRating(star)} />
                ))}
              </div>
            </FormField>
            <FormField label="Feedback (Optional)">
              <Textarea name="feedback" placeholder="Tell us about your experience..." className="border-slate-700 min-h-[120px]" />
            </FormField>
            <Button type="submit" disabled={addRatingMutation.isLoading} className="w-full bg-purple-600 text-white hover:bg-purple-700">
              {addRatingMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <p>Get help and submit support tickets</p>
            </div>
            <Button 
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                setActiveMainTab('tickets');
                // Use a short timeout to ensure the tab content is rendered before scrolling
                setTimeout(() => {
                  document.getElementById('newticket')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                }, 100);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.META_CLAIM_RELEASE, title: 'Meta Claim Release' })}
            >
                Meta Claim Release
            </Button>

            <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.YOUTUBE_CLAIM_RELEASE, title: 'Youtube Claim Release' })}
            >
                Youtube Claim Release
            </Button>

            <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.YOUTUBE_MANUAL_CLAIM, title: 'Youtube Manual Claiming Form' })}
            >
                Youtube Manual Claim
            </Button>

            <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.META_PROFILE_MAPPING, title: 'Meta Profile/Page Mapping' })}
            >
                Meta Profile Form
            </Button>
            
            <Button 
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.META_MANUAL_CLAIM, title: 'Meta Manual Claiming Form' })}
            >
                Meta Manual Claim
            </Button>

            <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setClaimModal({ open: true, type: ETicketType.YOUTUBE_OAC_MAPPING, title: 'Youtube Channel OAC / Release Mapping' })}
            >
                Youtube OAC
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="faq" >FAQ</TabsTrigger>
            <TabsTrigger value="tickets" >My Tickets</TabsTrigger>
            <TabsTrigger value="contact" >Contact</TabsTrigger>
            <TabsTrigger value="resources" >Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="mb-6">
              <Input
                placeholder="Search frequently asked questions..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="max-w-md border-slate-700"
              />
            </div>

            {isLoadingFaqs && <p>Loading FAQs...</p>}
            {isFaqsError && <p className="text-red-500">Error fetching FAQs.</p>}
            {!isLoadingFaqs && Object.keys(filteredFaqs).length === 0 && <p>No matching FAQs found.</p>}
            {filteredFaqs &&
              Object.entries(filteredFaqs).map(([category, questions], categoryIndex) => (
                <Card key={category} className=" border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        {/* You can add more sophisticated icon logic if needed */}
                        {categoryIndex === 0 && <Play className="w-4 h-4 text-white" />}
                        {categoryIndex === 1 && <FileText className="w-4 h-4 text-white" />}
                        {categoryIndex === 2 && <AlertCircle className="w-4 h-4 text-white" />}
                        {categoryIndex > 2 && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {questions.map((faq) => (
                      <Collapsible key={faq._id} open={openFAQ === faq._id} onOpenChange={() => setOpenFAQ(openFAQ === faq._id ? null : faq._id)}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-lg transition-colors hover:bg-muted-foreground/10">
                          <span>{faq.question}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openFAQ === faq._id ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 bg-muted-foreground/10 rounded-lg mt-1">
                          {faq.answer}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Ticket Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className=" py-2 border-slate-700">
                <CardContent className="p-4">
                  {isLoadingStats ? <p>Loading...</p> : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm">Total Tickets</p>
                        <p className="text-2xl font-bold">{ticketStats?.data?.overallStats?.totalTickets || 0}</p>
                      </div>
                      <Ticket className="w-8 h-8" />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className=" py-2 border-slate-700">
                <CardContent className="p-4">
                  {isLoadingStats ? <p>Loading...</p> : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm">Open</p>
                        <p className="text-2xl font-bold">{ticketStats?.data?.overallStats?.openTickets || 0}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className=" py-2 border-slate-700">
                <CardContent className="p-4">
                  {isLoadingStats ? <p>Loading...</p> : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm">In Progress</p>
                        <p className="text-2xl font-bold">{ticketStats?.data?.overallStats?.pendingTickets || 0}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className=" py-2 border-slate-700">
                <CardContent className="p-4">
                  {isLoadingStats ? <p>Loading...</p> : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm">Resolved</p>
                        <p className="text-2xl font-bold">{ticketStats?.data?.overallStats?.resolvedTickets || 0}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className=" py-2 border-slate-700">
                <CardContent className="p-4">
                  {isLoadingStats ? <p>Loading...</p> : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm">Closed</p>
                        <p className="text-2xl font-bold">{ticketStats?.data?.overallStats?.closedTickets || 0}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-gray-500" /> {/* Using gray for closed */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ticket Status Filter Tabs */}
            <Tabs
                value={ticketFilters.status || 'all'}
                onValueChange={(value) => setTicketFilters(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value,
                    page: 1 // Reset page when status changes
                }))}
                className="w-full mb-6"
            >
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Ticket List (as cards) */}
            <Card className=" border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Tickets</CardTitle>
                {/* TODO: Add filters for status */}
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingTickets && <p>Loading tickets...</p>}
                {isTicketsError && <p className="text-red-500">Error fetching tickets.</p>}
                {!isLoadingTickets && tickets.length === 0 && <p>No tickets found.</p>}
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="p-4 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{ticket.subject}</span>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setModalState({ type: 'reply', ticket })}
                          className="bg-purple-600 text-white hover:bg-purple-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                        {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setModalState({ type: 'rating', ticket })}
                            className="border-slate-600"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Feedback
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setModalState({ type: 'details', ticket });
                          }}
                          className="border-slate-600"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setModalState({ type: 'rating', ticket })}
                            className="border-slate-600"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span>ID: {ticket.ticketId}</span>
                      <span className="mx-2">•</span>
                      <span>Category: {ticket.category}</span>
                      <span className="mx-2">•</span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Agent: {ticket.agent}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4">
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage || 0} of {pagination.totalPages || 0}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Submit New Support Ticket */}
            <Card id='newticket' className=" border-slate-700">
              <CardHeader>
                <CardTitle>Submit New Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <NormalTicketForm 
                    user={user}
                    isLoading={createTicketMutation.isLoading}
                    onSubmit={(ticketData) => {
                        const payload = {
                            ...ticketData,
                            ticketType: ETicketType.NORMAL,
                        };
                        createTicketMutation.mutate(payload, {
                            onSuccess: handleMutationSuccess,
                            onError: handleMutationError,
                        });
                    }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                  <p className="mb-3">Chat with us on WhatsApp for instant help.</p>
                  {/* <p className="text-sm mb-4">{contactInfoData?.data?.businessHours || 'Mon-Fri: 9 AM - 6 PM IST'}</p> */}
                  <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                        Start Chat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xs border-slate-700">
                      <DialogHeader>
                        <DialogTitle>Scan to Chat on WhatsApp</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center p-4">
                        {contactInfoData?.data?.whatsappQRCode ? (
                          <img src={contactInfoData.data.whatsappQRCode} alt="WhatsApp QR Code" className="w-48 h-48" />
                        ) : <p>QR Code not available.</p>}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                  <p className="mb-3">Send us a detailed message</p>
                  <p className="font-semibold mb-4">{contactInfoData?.data?.supportEmail || 'support@example.com'}</p>
                  <a href={`mailto:${contactInfoData?.data?.supportEmail}`}>
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                      Send Email
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                  <p className="mb-3">Speak directly with our team</p>
                  <p className="font-semibold mb-4">{contactInfoData?.data?.primaryPhone || '+91-xxxxxxxxxx'}</p>
                  <a href={`tel:${contactInfoData?.data?.primaryPhone}`}>
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                      Call Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className=" border-slate-700">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingContactInfo ? <p>Loading contact information...</p> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Email Addresses</h4>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Primary:</span> {contactInfoData?.data?.primaryEmail}</p>
                        <p><span className="font-semibold">Support:</span> {contactInfoData?.data?.supportEmail}</p>
                        <p><span className="font-semibold">Business:</span> {contactInfoData?.data?.businessEmail}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Phone Numbers</h4>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Primary:</span> {contactInfoData?.data?.primaryPhone}</p>
                        <p><span className="font-semibold">Secondary:</span> {contactInfoData?.data?.secondaryPhone}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold mb-4">Physical Address</h4>
                      {contactInfoData?.data?.physicalAddress ? (
                        <p>
                          {contactInfoData.data.physicalAddress.street}, <br />
                          {contactInfoData.data.physicalAddress.city}, {contactInfoData.data.physicalAddress.state} - {contactInfoData.data.physicalAddress.zipCode}, <br />
                          {contactInfoData.data.physicalAddress.country}
                        </p>
                      ) : (
                        <p>Address not available.</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support Hours & Response Times */}
            <Card className=" border-slate-700">
              <CardHeader>
                <CardTitle>Support Hours & Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Support Hours</h4>
                    <p>{contactInfoData?.data?.businessHours || 'Loading...'}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Response Times</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Live Chat:</span>
                        <span>Instant - 5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email Support:</span>
                        <span>Within 24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone Support:</span>
                        <span>Scheduled calls</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className=" border-slate-700 border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
                    <p className="mb-4">
                      For urgent issues affecting your releases or payments, contact our emergency support line.
                    </p>
                    <div className="flex gap-3">
                      <a href={`tel:${contactInfoData?.data?.primaryPhone}`}>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Emergency Line
                        </Button>
                      </a>
                      <a href={`mailto:${contactInfoData?.data?.supportEmail}`}>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Priority Email
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">User Guides</h3>
                  <p className="mb-4">Step-by-step tutorials and documentation</p>
                  <Button className="w-full">
                    View Guides
                  </Button>
                </CardContent>
              </Card>

              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
                  <p className="mb-4">Get started with your first release in minutes</p>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className=" border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="mb-4">Connect with other artists and creators</p>
                  <Button className="w-full">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Popular Resources */}
            <Card className=" border-slate-700">
              <CardHeader>
                <CardTitle>Popular Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "How to optimize your music for streaming platforms",
                  "Understanding royalty payments and splits",
                  "Best practices for music promotion and marketing",
                  "Setting up your artist profile and brand",
                  "Technical requirements for audio uploads",
                  "Getting your music on editorial playlists"
                ].map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted-foreground/10 transition-colors">
                    <span>{resource}</span>
                    <Button size="sm" variant="ghost">
                      <FileText className="w-4 h-4 mr-1" />
                      Read
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className=" border-slate-700">
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: "Uploading Your First Release", duration: "5:32", views: "12.5K views" },
                    { title: "Understanding Analytics Dashboard", duration: "8:15", views: "8.9K views" },
                    { title: "Setting Up Marketing Campaigns", duration: "12:41", views: "15.2K views" },
                    { title: "Maximizing Your Royalty Earnings", duration: "9:28", views: "11.7K views" }
                  ].map((video, index) => (
                    <div key={index} className="border p-4 rounded-lg overflow-hidden hover:transition-colors cursor-pointer">
                      <div className="aspect-[21/6] bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                        <Play className="w-12 h-12 text-purple-400" />
                      </div>
                      <div className="py-2">
                        <h4 className="font-semibold mb-1">{video.title}</h4>
                        <div className="flex items-center justify-between text-sm">
                          <span>{video.duration}</span>
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={claimModal.open} onOpenChange={() => setClaimModal({ open: false, type: null, title: '' })}>
            <DialogContent className="max-lg:min-w-[90vw] lg:min-w-6xl max-h-[90vh] overflow-y-auto  border-slate-700">
                <DialogHeader>
                    <DialogTitle>{claimModal.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {claimModal.type === ETicketType.META_MANUAL_CLAIM && (
                        <MetaManualClaimForm 
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                    {claimModal.type === ETicketType.YOUTUBE_MANUAL_CLAIM && (
                        <YoutubeManualClaimForm 
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                    {claimModal.type === ETicketType.META_CLAIM_RELEASE && (
                        <MetaClaimReleaseForm
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                     {claimModal.type === ETicketType.YOUTUBE_CLAIM_RELEASE && (
                        <YoutubeClaimReleaseForm
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                    {claimModal.type === ETicketType.META_PROFILE_MAPPING && (
                        <MetaProfileMappingForm
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                    {claimModal.type === ETicketType.YOUTUBE_OAC_MAPPING && (
                        <YoutubeOACMappingForm
                            onSubmit={handleClaimSubmit}
                            isLoading={createTicketMutation.isLoading}
                            user={user}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>

        {/* Ticket Detail Modal */}
        <TicketDetailModal ticket={modalState.ticket} />
        <ReplyModal ticket={modalState.ticket} />
        <RatingModal ticket={modalState.ticket} />
      </div>
    </div>
  );
};

export default HelpSupport;