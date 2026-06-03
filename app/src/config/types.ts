// Shared component prop types.
export interface Option {
  value: string;
  label: string;
  /** optional bold lead line shown above the label (e.g. reason-for-visit) */
  title?: string;
  /** ticking this option reveals the free-text "Other" textarea */
  other?: boolean;
  info?: { text: string; href: string; linkLabel: string };
}
