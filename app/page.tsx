
import { Metadata } from 'next';
import HomePage from '@/components/homepage/homepage';

export const metadata: Metadata = {
  title: 'CommissionEdge | Know Your Value. Shine Brighter.',
  description: 'Professional solar commission calculator platform. Compare your current earnings, explore builder pay opportunities, and discover your true potential in solar sales.',
  openGraph: {
    title: 'CommissionEdge | Solar Commission Calculator',
    description: 'Know Your Value. Shine Brighter. Professional solar commission calculations.',
    type: 'website',
  },
};

export default function Home() {
  return <HomePage />;
}
