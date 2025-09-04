
import { Metadata } from 'next';
import FinalResults from '@/components/calculator/step-6-final-results';

export const metadata: Metadata = {
  title: 'Final Results & Next Steps | Sales Rep Calculator',
  description: 'Review your complete commission analysis, access the open calculator, and take the next steps in your solar career.',
};

export default function Step6Page() {
  return <FinalResults />;
}
