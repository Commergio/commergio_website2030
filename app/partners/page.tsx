import type { Metadata } from 'next';
import PartnersPageContent from '@/components/partners/PartnersPageContent';

export const metadata: Metadata = {
  title: 'Partners',
  description: "Commergio's strategic partners and business allies.",
};

export default function PartnersPage() {
  return <PartnersPageContent />;
}
