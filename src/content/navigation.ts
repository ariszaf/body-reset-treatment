/** Main navigation — derived from pages.ts (single source). Legal pages live in the footer. */
import { pages } from './pages';

export const navigation = pages
  .filter((p) => p.inNav)
  .map((p) => ({ label: p.nameEl, href: p.slug === '' ? '/' : `/${p.slug}/` }));

export const legalLinks = [
  { label: 'Όροι Χρήσης & Πολιτική Απορρήτου', href: '/oroi-xrisis-kai-politiki-aporritou/' },
];
