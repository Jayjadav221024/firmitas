/**
 * Firmitas — optional catalog import.
 *
 *   npm run import:catalog
 *
 * The public site renders its catalog from `frontend/src/data/products.js`.
 * That file is this project's own real content, so it is a legitimate source
 * for populating the Products collection the admin panel manages.
 *
 * This is NOT part of `npm run seed` and never runs automatically, because
 * writing business records into a database is the operator's decision.
 *
 * Safety properties:
 *   - additive only: nothing is ever updated or deleted
 *   - idempotent: products whose slug already exists are skipped
 *   - re-runnable: a second run reports "skipped" for everything
 *
 * Pass --dry-run to see what would be inserted without writing.
 */
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { slugify } from '../utils/http.js';

dotenv.config();

// Resolves the same from src/scripts (tsx) and dist/scripts (compiled):
// <root>/backend/{src,dist}/scripts -> <root>/frontend/src/data/products.js
const CATALOG_FILE = path.resolve(__dirname, '../../../frontend/src/data/products.js');

const DRY_RUN = process.argv.includes('--dry-run');

/** Category keys used by the public site, in display order. */
const CATEGORY_LABELS: Record<string, string> = {
  ethical: 'Ethical & Generics',
  surgical: 'Surgical & Hospital Supplies',
  otc: 'OTC Products',
  critical: 'Critical Care'
};

interface CatalogEntry {
  id: string;
  name: string;
  composition?: string;
  category: string;
  form?: string;
  rxType?: string;
  packaging?: string;
  storage?: string;
  use?: string;
}

/**
 * `products.js` is an ES module that imports React icon components, so it
 * cannot simply be `import`ed from the backend. `productsData` itself is plain
 * data, so slice that one array out of the source text and evaluate it.
 */
function readCatalog(): CatalogEntry[] {
  if (!fs.existsSync(CATALOG_FILE)) {
    throw new Error(`Catalog file not found at ${CATALOG_FILE}`);
  }
  const source = fs.readFileSync(CATALOG_FILE, 'utf8');

  const marker = 'export const productsData';
  const declStart = source.indexOf(marker);
  if (declStart === -1) {
    throw new Error(`Could not find "${marker}" in ${CATALOG_FILE}`);
  }

  const arrayStart = source.indexOf('[', declStart);
  if (arrayStart === -1) throw new Error('Malformed productsData declaration');

  // Bracket-depth scan so nested arrays/objects don't terminate us early.
  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
  if (arrayEnd === -1) throw new Error('Unterminated productsData array');

  const literal = source.slice(arrayStart, arrayEnd + 1);
  // eslint-disable-next-line no-new-func
  const parsed = new Function(`"use strict"; return (${literal});`)();

  if (!Array.isArray(parsed)) throw new Error('productsData did not evaluate to an array');
  return parsed as CatalogEntry[];
}

async function run() {
  await connectDB();
  console.log(`[Import] Target database: "${mongoose.connection.name}"`);
  if (DRY_RUN) console.log('[Import] DRY RUN — no writes will be made\n');

  const catalog = readCatalog();
  console.log(`[Import] Read ${catalog.length} products from the public catalog file`);

  // ---- Categories (additive) ---------------------------------------------
  let catsCreated = 0;
  const usedKeys = [...new Set(catalog.map((p) => p.category).filter(Boolean))];
  let order = 0;
  for (const key of Object.keys(CATEGORY_LABELS)) {
    order++;
    if (!usedKeys.includes(key)) continue;
    const exists = await Category.exists({ key });
    if (exists) continue;
    if (!DRY_RUN) {
      await Category.create({ name: CATEGORY_LABELS[key], key, displayOrder: order, isActive: true });
    }
    catsCreated++;
  }

  // ---- Products (additive, skip existing slugs) ---------------------------
  let created = 0;
  let skipped = 0;
  const seenSlugs = new Set<string>();
  let srNo = await Product.countDocuments();

  for (const entry of catalog) {
    if (!entry?.name) continue;

    let slug = slugify(entry.name);
    if (!slug) continue;

    // Guard against two catalog rows slugifying to the same value.
    if (seenSlugs.has(slug)) {
      let n = 2;
      while (seenSlugs.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    seenSlugs.add(slug);

    if (await Product.exists({ slug })) {
      skipped++;
      continue;
    }

    srNo++;
    const doc = {
      srNo,
      name: entry.name,
      brandName: 'Firmitas Healthcare',
      categoryKey: (entry.category || 'ethical').toLowerCase().trim(),
      slug,
      status: 'active' as const,
      composition: entry.composition || '',
      form: entry.form || 'Tablet',
      rxType: entry.rxType || 'Rx',
      packaging: entry.packaging || 'Standard Pack',
      storage: entry.storage || 'Store in cool and dry place',
      therapeuticUse: entry.use || '',
      description: entry.use || entry.composition || '',
      image: '',
      images: [],
      metaTitle: entry.name,
      metaDescription: (entry.use || entry.composition || '').slice(0, 160)
    };

    if (!DRY_RUN) await Product.create(doc);
    created++;
  }

  console.log(`\n[Import] Categories created : ${catsCreated}`);
  console.log(`[Import] Products created   : ${created}`);
  console.log(`[Import] Products skipped   : ${skipped} (slug already present)`);
  console.log(DRY_RUN ? '\n✅ Dry run complete — nothing written.\n' : '\n✅ Catalog import complete.\n');
}

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ [Import] Failed:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
