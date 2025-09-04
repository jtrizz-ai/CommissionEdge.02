
import { Metadata } from 'next';
import ComparisonResults from '@/components/calculator/step-3-comparison';

export const metadata: Metadata = {
  title: 'Commission Comparison | Sales Rep Calculator',
  description: 'See how your current earnings compare to your potential with our commission structure and builder pay preview.',
};

export default function Step3Page() {
  return <ComparisonResults />;
}
