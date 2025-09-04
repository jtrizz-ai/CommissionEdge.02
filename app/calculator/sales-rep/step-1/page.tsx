
import { Metadata } from 'next';
import { Suspense } from 'react';
import LeadCaptureForm from '@/components/calculator/step-1-lead-capture';

export const metadata: Metadata = {
  title: 'About Yourself | Sales Rep Calculator',
  description: 'Start your commission calculation journey by providing your professional background and career goals.',
};

export default function Step1Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadCaptureForm />
    </Suspense>
  );
}
