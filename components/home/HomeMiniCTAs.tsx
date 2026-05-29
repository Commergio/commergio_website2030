'use client';

import { useI18n } from '@/lib/i18n-context';
import MiniCTA from '@/components/home/MiniCTA';

export default function HomeMiniCTAs() {
  const { t } = useI18n();

  return (
    <>
      <MiniCTA
        heading={t.home.miniCta1Heading}
        sub={t.home.miniCta1Sub}
        primaryLabel={t.home.miniCta1Btn}
        primaryHref="/pricing"
        source="services-cta"
      />
      <MiniCTA
        heading={t.home.miniCta2Heading}
        sub={t.home.miniCta2Sub}
        primaryLabel={t.home.miniCta2Btn}
        source="products-cta"
      />
    </>
  );
}
