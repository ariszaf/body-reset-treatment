/**
 * Where the appointment CTA points, and what the whole booking section SAYS —
 * resolved in ONE place so the header link, the homepage section and the About
 * button can never contradict each other.
 *
 * Two modes, switched by `site.bookingUrl`:
 *
 *   filled  → real self-service booking (Cal). The visitor picks a slot and
 *             confirms on the spot, so the CTA has to look and read like an
 *             online scheduler: calendar mark, "online" in the label, an
 *             external-link cue, and a heading that no longer promises a callback.
 *   empty   → the enquiry dialog: leave your details, we call you back.
 *
 * The wording is part of the switch, not decoration. A button that says
 * "Κλείστε Ραντεβού" under a heading that says "Αφήστε μας τα στοιχεία σας" tells
 * the visitor two different things about what is about to happen.
 */
import { site } from '../content/site';
import type { IconName } from './icons';

export type BookingMode = {
  href: string;
  /** attach [data-booking] so the dialog intercepts the click */
  useDialog: boolean;
  external: boolean;
  /** button text */
  label: string;
  /** mark shown inside the button — none in dialog mode, where there is nothing to signal */
  icon?: IconName;
  /** section heading */
  heading: string;
  /** section lead */
  lead: string;
  /** one quiet line under the button, setting the expectation */
  hint: string;
};

const url = (site as { bookingUrl?: string }).bookingUrl?.trim() ?? '';

export const booking: BookingMode = url
  ? {
      href: url,
      useDialog: false,
      external: true,
      label: 'Κλείστε ραντεβού online',
      icon: 'calendar',
      heading: 'Δείτε τις διαθέσιμες ώρες',
      lead: 'Επιλέξτε ημέρα και ώρα από το ημερολόγιο και το ραντεβού σας θα επιβεβαιωθεί αμέσως.',
      hint: 'Ηλεκτρονική κράτηση — ανοίγει σε νέα καρτέλα',
    }
  : {
      href: site.cta.href,
      useDialog: true,
      external: false,
      label: site.cta.label,
      heading: 'Αφήστε μας τα στοιχεία σας',
      lead: 'Θα σας καλέσουμε άμεσα για να βρούμε μαζί την πρώτη διαθέσιμη ώρα.',
      hint: 'Σας καλούμε εμείς — δεν χρειάζεται να τηλεφωνήσετε',
    };

/** Spread onto an <a>/<Button>: `{...bookingAttrs}` */
export const bookingAttrs = {
  href: booking.href,
  ...(booking.useDialog ? { 'data-booking': '' } : {}),
  ...(booking.external ? { target: '_blank', rel: 'noopener' } : {}),
};
