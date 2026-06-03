// One-shot migrator: Hugo content/symptom-guide/*.md (+ .de.md siblings) →
// Astro `symptoms` collection. en → src/content/symptoms/<slug>.md,
// de → src/content/symptoms/de/<slug>.md. Remaps frontmatter to the collection
// schema, rewrites relative image paths to /symptom-guide/images/, and keeps
// the {#custom-id} heading anchors (handled by remark-heading-id at build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// repo root = two levels up from app/scripts/
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'content/symptom-guide');
const OUT = path.join(ROOT, 'app/src/content/symptoms');

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter: ' + file);
  return { fm: yaml.load(m[1]) || {}, body: m[2] };
}

const files = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_index'));
const enFiles = files.filter((f) => !f.endsWith('.de.md'));
const deFiles = files.filter((f) => f.endsWith('.de.md'));

// Pass 1: title maps for next-link labels.
const titles = { en: {}, de: {} };
for (const f of enFiles) titles.en[parse(path.join(SRC, f)).fm.slug] = parse(path.join(SRC, f)).fm.title;
for (const f of deFiles) {
  const { fm } = parse(path.join(SRC, f));
  titles.de[fm.slug] = fm.title;
}

const slugFromHref = (href) => String(href || '').replace(/\/+$/, '').split('/').pop();

function convert(file, lang) {
  const { fm, body } = parse(path.join(SRC, file));
  const slug = fm.slug;
  const persistence = slug.startsWith('persistent') ? 'Persistent' : 'Transitory';
  const domain = fm.domain_label || fm.domain || '';
  const out = {
    title: fm.title,
    domain,
    persistence,
    tags: [persistence, domain].filter(Boolean),
  };
  if (fm.next) {
    const ns = slugFromHref(fm.next);
    const base = lang === 'de' ? '/de/symptom-guide/' : '/symptom-guide/';
    out.next = { label: titles[lang][ns] || ns, href: base + ns };
  }
  const newBody = body.replace(/\]\(images\//g, '](/symptom-guide/images/');
  const frontmatter = yaml.dump(out, { lineWidth: -1, quotingType: '"' });
  const content = `---\n${frontmatter}---\n${newBody}`;
  const dir = lang === 'de' ? path.join(OUT, 'de') : OUT;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.md`), content);
  return slug;
}

let n = 0;
for (const f of enFiles) { convert(f, 'en'); n++; }
for (const f of deFiles) { convert(f, 'de'); n++; }
console.log(`migrated ${n} files (${enFiles.length} en + ${deFiles.length} de)`);
