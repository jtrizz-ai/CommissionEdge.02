
import { Metadata } from 'next';
import DetailedAnalysis from '@/components/calculator/step-4-analysis';

export const metadata: Metadata = {
  title: 'Detailed Analysis | Sales Rep Calculator',
  description: 'Get personalized benefits analysis and annual earning projections based on your motivators and experience.',
};

export default function Step4Page() {
  return <DetailedAnalysis />;
}
