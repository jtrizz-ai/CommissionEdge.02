

import { Metadata } from 'next';
import OverrideIncomeCalculator from '@/components/calculator/step-4-override-income';

export const metadata: Metadata = {
  title: 'Override Income Calculator | Team Leader Calculator',  
  description: 'Calculate your potential override income based on team size and performance metrics.',
};

export default function Step4Page() {
  return <OverrideIncomeCalculator />;
}

