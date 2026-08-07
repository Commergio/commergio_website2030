import type { Partner } from '@/lib/types';

/**
 * Homepage partner order: featured first for prominence, then the rest.
 * Featuring must never hide unfeatured partners from the public section.
 */
export function orderPartnersForHomepage(partners: Partner[]): Partner[] {
  const featured: Partner[] = [];
  const rest: Partner[] = [];
  for (const partner of partners) {
    if (partner.is_featured) featured.push(partner);
    else rest.push(partner);
  }
  return [...featured, ...rest];
}
