// Shared component prop types.
export interface Option {
  value: string;
  label: string;
  /** ticking this option reveals the free-text "Other" textarea */
  other?: boolean;
  info?: { text: string; href: string; linkLabel: string };
}
