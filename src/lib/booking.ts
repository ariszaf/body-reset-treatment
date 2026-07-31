/**
 * Where the appointment CTA points, and what the sections around it SAY —
 * resolved in ONE place so the bar, the menu, the footer, the About page and
 * every treatment page can never contradict each other.
 *
 * ONE destination now: /epikoinonia/, the page that lays out every way to book —
 * phone, online, message. The site used to decide that for the visitor (dialog
 * or scheduler, depending on whether a booking URL existed) and it was deciding
 * badly: someone who wants to ring should not have to open a form to find the
 * number, and someone who wants a slot at 2am should not be told they will be
 * called back. The choice belongs on a page, made by them.
 *
 * `site.bookingUrl` no longer switches the button — it switches whether the
 * ONLINE option appears on that page. Until a real address is given, the page
 * offers the two channels that work.
 */
import { site } from '../content/site';

export type BookingMode = {
  href: string;
  /** button text — the same three words everywhere */
  label: string;
  /** section heading where a booking block is introduced */
  heading: string;
  /** section lead */
  lead: string;
};

/** The self-service scheduler, if there is one. '#' and other placeholders do
 *  not count: only a real address may be offered as a way to book. */
const url = (site as { bookingUrl?: string }).bookingUrl?.trim() ?? '';
export const onlineBookingUrl = /^https?:\/\//i.test(url) ? url : '';

export const booking: BookingMode = {
  href: '/epikoinonia/',
  label: site.cta.label,
  heading: 'Κλείστε την πρώτη σας συνεδρία',
  lead: 'Τηλέφωνο, online κράτηση ή μήνυμα — διαλέξτε ό,τι σας βολεύει.',
};

/** Spread onto an <a>/<Button>: `{...bookingAttrs}` */
export const bookingAttrs = { href: booking.href };
