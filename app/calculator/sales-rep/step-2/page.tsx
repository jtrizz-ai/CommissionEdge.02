
import { Metadata } from 'next';
import CurrentCompanyCalculator from '@/components/calculator/step-2-current-company';

export const metadata: Metadata = {
  title: 'Current Company Details | Sales Rep Calculator',
  description: 'Enter your current company pricing, commission structure, and deal details for accurate comparison.',
};

export default function Step2Page() {
  return <CurrentCompanyCalculator />;
}
