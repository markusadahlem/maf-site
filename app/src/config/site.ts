// Central site configuration: brand, navigation, footer.
// Mirrors the link structure of the HTML mockups. Edit here once; every
// component (Nav, Footer) reads from this file.

export const site = {
  name: 'Migraine Aura Foundation',
  tagline: 'Making migraine visible since 1998',
  description:
    "One of the world's most comprehensive sources of knowledge on migraine aura, built from patient voices since 1998.",
};

export interface NavLink {
  label: string;
  href: string;
  /** match key used to highlight the active nav item */
  key: string;
}

export const navLinks: NavLink[] = [
  { label: 'Field Guide', href: '/field-guide', key: 'field-guide' },
  { label: 'Experiences', href: '/experiences', key: 'experiences' },
  { label: 'Migraine Art', href: '/art', key: 'art' },
  { label: 'Blog', href: '/blog', key: 'blog' },
  { label: 'For Clinicians', href: '/next-gen-migraine-care', key: 'clinicians' },
];

export const ctaPrimary = { label: 'Start the aura check', href: '/aura-check' };

export const footerCols = [
  {
    title: 'Explore',
    links: [
      { label: 'Field Guide', href: '/field-guide' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Migraine Art', href: '/art' },
      { label: 'Science Blog', href: '/blog' },
      { label: 'Aura Check', href: '/aura-check' },
      { label: 'Explore Your Brain State', href: '/test-suit' },
    ],
  },
  {
    title: 'Foundation',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'For Professionals', href: '/next-gen-migraine-care' },
      { label: 'Contact', href: '/contact' },
      { label: 'Impressum', href: '/impressum' },
    ],
  },
  {
    title: 'Language',
    links: [
      { label: 'English', href: '/' },
      { label: 'Deutsch', href: '/de/' },
    ],
  },
];
