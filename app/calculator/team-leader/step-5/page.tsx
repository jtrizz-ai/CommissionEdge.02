

import { Metadata } from 'next';
import RecruitingIncomeCalculator from '@/components/calculator/step-5-recruiting-income';

export const metadata: Metadata = {
  title: 'Multi-Generation Recruiting Income | Team Leader Calculator',
  description: 'Explore recruiting income potential across multiple generations of team growth through partner companies.',
};

export default function Step5Page() {
  return <RecruitingIncomeCalculator />;
}

