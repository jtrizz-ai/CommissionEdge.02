

import { Metadata } from 'next';
import { Suspense } from 'react';
import LeadCaptureForm from '@/components/calculator/step-1-lead-capture';

export const metadata: Metadata = {
  title: 'About Yourself | Team Leader Calculator',
  description: 'Start your leadership opportunity analysis by providing your professional background and team-building goals.',
};

export default function Step1Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadCaptureForm calculatorType="team-leader" />
    </Suspense>
  );
}

