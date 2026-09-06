/**
 * Craft Studio — static site build.
 * Assembles src/pages/*.html into dist/ with clean URLs. Zero dependencies.
 *   node build.mjs
 */
import { readFile, writeFile, mkdir, readdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');

const SITE = 'https://craftstudio.example'; // set to the live domain before deploy

const NAV = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'Process', href: '/process/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' }
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Craft Studio',
  slogan: 'Ideas deserve good design.',
  description:
    'Craft Studio is a newly established design and technology studio working across AI, automation, Python, web development, website design, digital marketing, custom software and career support.',
  url: SITE + '/',
  logo: SITE + '/assets/img/logo-wordmark.png',
  image: SITE + '/assets/img/og.png',
  email: 'craftstudio2k26@gmail.com',
  telephone: '+91-6383283116',
  foundingDate: '2026',
  sameAs: ['https://www.instagram.com/craftstudio__'],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Artificial intelligence',
    'AI automation',
    'Python programming',
    'Web development',
    'Website design',
    'Digital marketing',
    'Custom software development',
    'Resume, LinkedIn and portfolio building',
    'Placement and career support'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+91-6383283116',
    email: 'craftstudio2k26@gmail.com',
    availableLanguage: ['English']
  }
};

/* ------------------------------------------------------------------ */

const minifyHtml = (html) =>
  html
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/>\s+</g, '><')
    .trim();

const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();

// Plain-string .replace() treats "$" sequences in the replacement as special
// patterns ($&, $1, $', …). Templating with a function side-steps that so a
// future title/description containing "$" can never silently corrupt output.
const sub = (html, token, value) => html.replace(token, () => value);

// A string value landing inside <script type="application/ld+json"> could in
// principle contain "</script" and prematurely close the tag; escape it so
// the JSON always stays inert data regardless of what it contains.
const escapeForInlineScript = (json) => json.replace(/<\/(script)/gi, '<\\/$1');

const navHtml = (current, cls) =>
  NAV.map(
    (n, i) =>
      `<a class="${cls}" href="${n.href}"${current === n.href ? ' aria-current="page"' : ''}` +
      (cls === 'drawer__link' ? ` style="--i:${i}"><span>0${i + 1}</span>${n.label}</a>` : `>${n.label}</a>`)
  ).join('\n');

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

async function build() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const base = await readFile(path.join(SRC, 'partials/base.html'), 'utf8');
  const pageFiles = (await readdir(path.join(SRC, 'pages'))).filter((f) => f.endsWith('.html'));

  const pages = [];

  for (const file of pageFiles) {
    const raw = await readFile(path.join(SRC, 'pages', file), 'utf8');
    const m = raw.match(/^<!--meta([\s\S]*?)meta-->/);
    if (!m) throw new Error(`Missing meta block in ${file}`);
    const meta = JSON.parse(m[1]);
    let body = raw.slice(m[0].length).trim();

    // {{> partial-name }} includes, resolved recursively (depth-capped)
    for (let pass = 0; pass < 5 && /\{\{>\s*[\w-]+\s*\}\}/.test(body); pass++) {
      const names = [...body.matchAll(/\{\{>\s*([\w-]+)\s*\}\}/g)].map((x) => x[1]);
      for (const name of new Set(names)) {
        const frag = await readFile(path.join(SRC, 'partials', `${name}.html`), 'utf8');
        body = body.replaceAll(new RegExp(`\\{\\{>\\s*${name}\\s*\\}\\}`, 'g'), frag.trim());
      }
    }

    const ld = escapeForInlineScript(
      meta.jsonld ? JSON.stringify([JSONLD, meta.jsonld]) : JSON.stringify(JSONLD)
    );

    let html = base;
    html = sub(html, '{{TITLE}}', meta.title);
    html = html.replace(/\{\{OGTITLE\}\}/g, () => meta.ogTitle || meta.title);
    html = html.replace(/\{\{DESC\}\}/g, () => meta.description);
    html = html.replace(/\{\{PATH\}\}/g, () => meta.path);
    html = html.replace(/\{\{SITE\}\}/g, () => SITE);
    html = sub(html, '{{JSONLD}}', ld);
    html = sub(html, '{{NAV}}', navHtml(meta.path, 'nav__link'));
    html = sub(html, '{{DRAWER}}', navHtml(meta.path, 'drawer__link'));
    html = sub(html, '{{BODY}}', body);

    const dir = meta.path === '/' ? OUT : path.join(OUT, meta.path);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), minifyHtml(html));

    if (meta.path !== '/' && meta.sitemap !== false) {
      pages.push({ path: meta.path, priority: meta.priority || '0.8' });
    }
    console.log(`  ✓ ${meta.path.padEnd(12)} ${meta.title}`);
  }

  // 404 also written at dist root for host fallbacks
  const notFound = path.join(OUT, '404/index.html');
  try {
    await copyFile(notFound, path.join(OUT, '404.html'));
  } catch { /* 404 page optional */ }

  // assets
  await copyDir(path.join(SRC, 'assets/img'), path.join(OUT, 'assets/img'));
  await copyDir(path.join(SRC, 'assets/fonts'), path.join(OUT, 'assets/fonts'));
  await mkdir(path.join(OUT, 'assets/css'), { recursive: true });
  await mkdir(path.join(OUT, 'assets/js'), { recursive: true });
  await writeFile(
    path.join(OUT, 'assets/css/craft.css'),
    minifyCss(await readFile(path.join(SRC, 'styles/craft.css'), 'utf8'))
  );
  await copyFile(path.join(SRC, 'scripts/craft.js'), path.join(OUT, 'assets/js/craft.js'));

  // static root files
  for (const f of await readdir(path.join(SRC, 'static'))) {
    await copyFile(path.join(SRC, 'static', f), path.join(OUT, f));
  }

  // sitemap
  const today = new Date().toISOString().slice(0, 10);
  const urls = [{ path: '/', priority: '1.0' }, ...pages]
    .map(
      (p) =>
        `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`
    )
    .join('\n');
  await writeFile(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );

  await writeFile(
    path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
  );

  console.log('\nBuilt to dist/');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
