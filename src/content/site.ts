/**
 * Business identity — single source for NAP (Name/Address/Phone) everywhere.
 * CMS Schema (Sanity): document "siteSettings" { name, tagline, phone, email, address, hours, social }
 *
 * ⚠ PLACEHOLDERS — see TODO.md. Phone/email/address/domain are assumed so the
 * build renders; they MUST be replaced with the client's real details before
 * anything goes live (NAP consistency is load-bearing for local SEO).
 */
export const site = {
  name: 'Body Reset Treatment',
  tagline: 'Μασάζ κατ’ οίκον',
  url: 'https://bodyresettreatment.gr', // TODO: confirm domain (must match astro.config site)
  description:
    'Αθλητικό και σουηδικό μασάζ, θεραπεία προσώπου και βεντούζες στον δικό σας χώρο, κατόπιν ραντεβού.',

  /* NAP — must stay IDENTICAL here, in the footer, on the contact page and in the schema.
     MOBILE SERVICE: the treatment happens at the client's home, so there is no
     shop front and no street address to publish. `street` stays empty on
     purpose — the UI shows the service area instead. */
  phone: '210 000 0000',                 // TODO: real number
  email: 'info@bodyresettreatment.gr',   // TODO: real address
  address: {
    street: '',
    city: 'Αθήνα',                       // TODO: confirm city
    region: 'Αττική',                    // TODO
    zip: '',
    country: 'GR',
  },
  location: 'Αθήνα',         // the visible location keyword used in meta/copy
  locationArticle: 'ην',     // "στην Αθήνα"
  serviceArea: 'Αθήνα και περίχωρα', // TODO: confirm the real coverage
  mapUrl: '',

  hours: 'Δευτέρα – Κυριακή, αποκλειστικά κατόπιν ραντεβού',
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
  },

  /* Local SEO — feeds the baked LocalBusiness JSON-LD. */
  industryType: 'HealthAndBeautyBusiness',
  geo: { lat: '', lng: '' },
  priceRange: '€€€',
  openingHours: [] as string[],

  /* Branding / integrations — ONE CTA sitewide: the appointment.
     Anchor (not a page) so it works from every page while the contact page is pending. */
  cta: { label: 'Κλείστε Ραντεβού', href: '/#epikoinonia' },

  /* Online scheduler (Cal). THE MOMENT this is filled, every CTA on the site
     switches from "leave your details and we call you" to real self-service
     booking — see src/lib/booking.ts. Empty = the enquiry dialog stays.
     TODO: paste the real Cal link, e.g. https://cal.com/body-reset-treatment */
  bookingUrl: '',
  agencyCredit: 'silent' as 'silent' | 'visible',

  /* Contact form → forms.polarzee.com (register the domain + key before launch). */
  formSiteKey: 'body-reset-treatment',
} as const;
