
import { Metadata } from 'next';
import RecruitingIncomeExplanation from '@/components/calculator/step-5-builder-pay';

export const metadata: Metadata = {
  title: 'Recruiting Income Explanation | Sales Rep Calculator',
  description: 'Understand the complete recruiting income structure, multi-generation scenarios, and 2029 equity buyout opportunities.',
};

export default function Step5Page() {
  return <RecruitingIncomeExplanation />;
}
