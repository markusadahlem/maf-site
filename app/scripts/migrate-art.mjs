// One-shot migrator: Hugo content/art/** → Astro `art` collection.
// Preserves the path hierarchy (concept/literature/music/visual-arts[/historical
// |/modern]). `_index.md` → `index.md` (Astro ignores underscore-prefixed
// files), so a section landing keeps its dir URL. en → src/content/art/<path>,
// de → src/content/art/de/<path>. Bodies are plain markdown with absolute image
// paths (/art/images, /images/art) — copied verbatim. Only `title` is kept.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'content/art');
const OUT = path.join(ROOT, 'app/src/content/art');

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/^\s*\n/, '');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter: ' + file);
  return { fm: yaml.load(m[1]) || {}, body: m[2] };
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

let en = 0, de = 0;
for (const file of walk(SRC)) {
  const rel = path.relative(SRC, file); // e.g. music/elvis-presley.md, music/_index.md
  const isDe = rel.endsWith('.de.md');
  const { fm, body } = parse(file);
  let outRel = rel
    .replace(/\.de\.md$/, '.md')
    .replace(/(^|\/)_index\.md$/, '$1index.md'); // _index → index (per dir)
  const dir = isDe ? path.join(OUT, 'de', path.dirname(outRel)) : path.join(OUT, path.dirname(outRel));
  fs.mkdirSync(dir, { recursive: true });
  const frontmatter = yaml.dump({ title: fm.title }, { lineWidth: -1, quotingType: '"' });
  fs.writeFileSync(path.join(dir, path.basename(outRel)), `---\n${frontmatter}---\n${body}`);
  isDe ? de++ : en++;
}
console.log(`migrated ${en} en + ${de} de art files`);
