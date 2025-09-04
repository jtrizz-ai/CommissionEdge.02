

import { Metadata } from 'next';
import LeadershipOpportunitySummary from '@/components/calculator/step-7-leadership-summary';

export const metadata: Metadata = {
  title: 'Complete Leadership Opportunity | Team Leader Calculator',
  description: 'Review your complete leadership opportunity including personal commission, overrides, recruiting income, and equity potential.',
};

export default function Step7Page() {
  return <LeadershipOpportunitySummary />;
}

