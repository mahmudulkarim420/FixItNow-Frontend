import type { RepairService } from "@/lib/mock-services-data";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({ baseUrl }: { baseUrl: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FixItNow",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with clear upfront pricing.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-0140",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [],
  };

  return <JsonLd data={schema} />;
}

export function WebSiteJsonLd({ baseUrl }: { baseUrl: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FixItNow",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/services?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} />;
}

export function ServiceJsonLd({
  service,
  baseUrl,
}: {
  service: RepairService;
  baseUrl: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description || service.longDescription,
    provider: {
      "@type": "Organization",
      name: "FixItNow",
      url: baseUrl,
    },
    serviceType: service.category,
    offers: service.price
      ? {
          "@type": "Offer",
          price: service.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
    aggregateRating:
      service.rating && service.reviews
        ? {
            "@type": "AggregateRating",
            ratingValue: service.rating,
            reviewCount: service.reviews,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
  };

  return <JsonLd data={schema} />;
}

export function BreadcrumbsJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
}
