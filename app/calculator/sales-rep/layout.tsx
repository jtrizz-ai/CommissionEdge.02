
import { Metadata } from 'next';
import CalculatorLayout from '@/components/calculator/calculator-layout';

export const metadata: Metadata = {
  title: 'Sales Rep Commission Calculator | CommissionEdge',
  description: 'Calculate and compare your solar sales commission potential with our comprehensive 6-step calculator.',
};

export default function SalesRepCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalculatorLayout 
      title="Sales Rep Commission Calculator"
      totalSteps={6}
    >
      {children}
    </CalculatorLayout>
  );
}
