import { defineCollection, z } from 'astro:content';

// Light schemas — the migration plan keeps frontmatter loose for v1, so most
// fields are optional. Tighten with Zod later if a specific bug warrants it.

const symptoms = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    domain: z.string().optional(), // e.g. "Visual"
    persistence: z.enum(['Transitory', 'Persistent']).optional(),
    lead: z.string().optional(),
    tags: z.array(z.string()).default([]),
    next: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default('Markus A. Dahlem, PhD'),
    tag: z.string().default('Neuroscience'),
    readingTime: z.string().optional(),
    series: z.boolean().default(false),
  }),
});

export const collections = { symptoms, blog };
