// One-shot migrator: Hugo content/blog/*.md (+ .de.md) → Astro `blog`
// collection. Remaps frontmatter and converts Hugo-isms in the body:
//   - {{< hextra/hero-subtitle … >}}…{{< /… >}}  → keep the inner text
//   - {{< youtube ID >}}                          → an <iframe> embed
//   - inline <script>…</script>                   → dropped (PostHog tracker;
//                                                    re-add in Phase 5)
// Images already use /images/blog/* (copied to public/). en → blog/<slug>.md,
// de → blog/de/<slug>.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'content/blog');
const OUT = path.join(ROOT, 'app/src/content/blog');

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter: ' + file);
  return { fm: yaml.load(m[1]) || {}, body: m[2] };
}

function transformBody(body) {
  return body
    .replace(/\{\{<\s*\/?hextra\/hero-subtitle[^}]*>\}\}/g, '')
    .replace(/\{\{<\s*youtube\s+(\S+)\s*>\}\}/g, (_, id) =>
      `<iframe width="560" height="315" style="max-width:100%;aspect-ratio:16/9;height:auto" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/\{\{[%<][\s\S]*?[%>]\}\}/g, '') // strip any remaining shortcodes
    .trim();
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md') && !f.startsWith('_index'));

function convert(file, lang) {
  const { fm, body } = parse(path.join(SRC, file));
  const slug = file.replace(/\.de\.md$/, '').replace(/\.md$/, '');
  const author = Array.isArray(fm.authors) && fm.authors[0]?.name ? fm.authors[0].name : 'Markus A. Dahlem, PhD';
  const tag = /culture|sensory-overload/.test(slug) ? 'Culture' : 'Neuroscience';
  const out = {
    title: fm.title,
    description: fm.description || undefined,
    date: typeof fm.date === 'string' ? fm.date : new Date(fm.date).toISOString(),
    author,
    tag,
  };
  const frontmatter = yaml.dump(out, { lineWidth: -1, quotingType: '"', skipInvalid: true });
  const content = `---\n${frontmatter}---\n\n${transformBody(body)}\n`;
  const dir = lang === 'de' ? path.join(OUT, 'de') : OUT;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.md`), content);
}

let en = 0, de = 0;
for (const f of files) {
  if (f.endsWith('.de.md')) { convert(f, 'de'); de++; }
  else { convert(f, 'en'); en++; }
}
console.log(`migrated ${en} en + ${de} de blog posts`);
