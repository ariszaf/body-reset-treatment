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

  /* Branding / integrations — ONE CTA sitewide: the appointment. It does not go
     to a booking system, it goes to the page that offers every way to book. */
  cta: { label: 'Κλείστε ραντεβού', href: '/epikoinonia/' },

  /* The self-service scheduler, when there is one. This no longer switches the
     button — it switches whether ONLINE κράτηση appears among the options on
     /epikoinonia/. Empty (or a placeholder like '#') and the page offers the two
     channels that actually work: phone and message.
     ⚠ TODO: paste the real address the moment the client gives it. */
  bookingUrl: '',
  agencyCredit: 'silent' as 'silent' | 'visible',

  /* Contact form. Empty = the Polarzee hosted endpoint, which is the factory
     default and needs the domain registered at forms.polarzee.com.
     ⚠ TODO: the client is supplying their own endpoint — paste the URL here and
     the form posts there instead, same JSON payload, no other change. */
  formEndpoint: '',
  formSiteKey: 'body-reset-treatment',
} as const;
