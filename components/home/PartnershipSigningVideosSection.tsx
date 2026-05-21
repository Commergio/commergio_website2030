'use client';

import dynamic from 'next/dynamic';

const PartnershipSigningVideos = dynamic(
  () => import('@/components/partners/PartnershipSigningVideos'),
  { ssr: false }
);

export default function PartnershipSigningVideosSection() {
  return <PartnershipSigningVideos prominent limit={2} showAllLink />;
}
