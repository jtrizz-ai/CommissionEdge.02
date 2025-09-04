

import { Metadata } from 'next';
import EquityBuyoutCalculator from '@/components/calculator/step-6-equity-buyout';

export const metadata: Metadata = {
  title: '2029 Equity Buyout Calculator | Team Leader Calculator',
  description: 'Calculate your potential 2029 equity buyout value based on team performance and leadership achievements.',
};

export default function Step6Page() {
  return <EquityBuyoutCalculator />;
}

