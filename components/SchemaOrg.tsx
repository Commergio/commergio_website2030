import { BRAND_LOGO_URL } from '@/lib/brand';

export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://commergio.com/#organization',
        name: 'Commergio',
        alternateName: 'كوميرجيو',
        url: 'https://commergio.com',
        logo: {
          '@type': 'ImageObject',
          url: BRAND_LOGO_URL,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+966562270319',
            contactType: 'customer service',
            availableLanguage: ['English', 'Arabic'],
          },
        ],
        email: 'info@commergio.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Riyadh',
          addressCountry: 'SA',
        },
        foundingDate: '2025',
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://commergio.com/#website',
        url: 'https://commergio.com',
        name: 'Commergio | كوميرجيو',
        description: 'Enterprise-grade digital transformation and technology solutions from Saudi Arabia.',
        publisher: { '@id': 'https://commergio.com/#organization' },
        inLanguage: ['en', 'ar'],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://commergio.com/#service',
        name: 'Commergio Technology Solutions',
        image: BRAND_LOGO_URL,
        url: 'https://commergio.com',
        telephone: '+966562270319',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Riyadh',
          addressCountry: 'SA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '24.7136',
          longitude: '46.6753',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
          opens: '09:00',
          closes: '18:00',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Technology Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Solutions' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce (Salla)' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Optimization' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Consulting' } },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
