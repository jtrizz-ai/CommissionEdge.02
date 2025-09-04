

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Mail,
  ArrowLeft,
  Send
} from 'lucide-react';

interface StateValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: string;
  onStartOver: () => void;
}

export default function StateValidationModal({
  isOpen,
  onClose,
  state,
  onStartOver
}: StateValidationModalProps) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralData, setReferralData] = useState({
    referrerName: '',
    referrerEmail: '',
    partnerCompany: '',
    partnerContact: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReferPartner = () => {
    setShowReferralForm(true);
  };

  const handleStartOver = () => {
    onStartOver();
    onClose();
  };

  const handleSubmitReferral = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/refer-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          referrerName: referralData.referrerName,
          referrerEmail: referralData.referrerEmail,
          partnerInfo: `Company: ${referralData.partnerCompany}\nContact: ${referralData.partnerContact}\nAdditional Info: ${referralData.additionalInfo}`
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Referral submission failed');
      }
    } catch (error) {
      console.error('Referral submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEmailReferral = () => {
    const subject = encodeURIComponent(`Potential Partner Referral - ${state}`);
    const body = encodeURIComponent(`Hello,

I'd like to refer a potential solar company partner in ${state}.

Company Information:
- Company Name: 
- Contact Person:
- Phone Number:
- Email:
- Website:

Additional Information:


Best regards,
${referralData.referrerName || 'Name'}
${referralData.referrerEmail || 'Email'}`);
    
    window.open(`mailto:beaconsolarsolution@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!showReferralForm ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle className="text-center">
                We Don't Currently Serve {state}
              </DialogTitle>
              <DialogDescription className="text-center">
                We apologize, but we don't currently have partner companies in {state}. 
                We're actively seeking partners in your area and would love to hear from you 
                if you know of potential solar companies that might be interested in our network.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-6">
              <Button
                onClick={handleReferPartner}
                className="w-full btn-gradient text-white"
                size="lg"
              >
                <Mail className="h-4 w-4 mr-2" />
                Refer a Potential Partner
              </Button>
              
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start Over - Choose Different State
              </Button>
            </div>
          </>
        ) : isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-success/20 rounded-full">
                <Send className="h-6 w-6 text-success" />
              </div>
              <DialogTitle className="text-center">
                Referral Submitted Successfully!
              </DialogTitle>
              <DialogDescription className="text-center">
                Thank you for your referral. Our team will review and reach out to potential 
                partners in {state} within 5 business days.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-6">
              <Button
                onClick={handleStartOver}
                className="w-full btn-gradient text-white"
                size="lg"
              >
                Continue with Different State
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Refer a Partner in {state}</DialogTitle>
              <DialogDescription>
                Help us expand to {state} by referring potential partner companies
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referrerName">Your Name</Label>
                  <Input
                    id="referrerName"
                    placeholder="John Doe"
                    value={referralData.referrerName}
                    onChange={(e) => setReferralData(prev => ({ ...prev, referrerName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referrerEmail">Your Email</Label>
                  <Input
                    id="referrerEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={referralData.referrerEmail}
                    onChange={(e) => setReferralData(prev => ({ ...prev, referrerEmail: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerCompany">Partner Company</Label>
                  <Input
                    id="partnerCompany"
                    placeholder="Solar Company Name"
                    value={referralData.partnerCompany}
                    onChange={(e) => setReferralData(prev => ({ ...prev, partnerCompany: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerContact">Contact Person</Label>
                  <Input
                    id="partnerContact"
                    placeholder="Contact Name"
                    value={referralData.partnerContact}
                    onChange={(e) => setReferralData(prev => ({ ...prev, partnerContact: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional details about the company..."
                  value={referralData.additionalInfo}
                  onChange={(e) => setReferralData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowReferralForm(false)}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={openEmailReferral}
                className="flex-1 btn-gradient text-white"
                disabled={!referralData.referrerName || !referralData.referrerEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Open Email
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

