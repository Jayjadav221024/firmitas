/**
 * Firmitas 1 — Database Seeder & Bootstrap
 * Seeds all 54 Pharmaceutical Products, 4 Divisions/Categories,
 * 10 Website CMS Pages & Sections, FAQs, Testimonials, Blogs, and Super Admin.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import { Page, Section, SectionContent } from '../models/WebsiteEditor.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { Faq, Testimonial, Blog } from '../models/Entities.js';

dotenv.config();

const ALL_MODULES = [
  'dashboard', 'users', 'roles', 'email_setup', 'email_for', 'email_template',
  'website_editor', 'products', 'categories', 'testimonials', 'faqs', 'blogs',
  'inquiries', 'job_openings', 'job_applications', 'audit_logs'
];

const CATEGORIES = [
  {
    name: 'Ethical & Generics',
    key: 'ethical',
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'Surgical & Hospital Supplies',
    key: 'surgical',
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'OTC Products',
    key: 'otc',
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'Critical Care',
    key: 'critical',
    displayOrder: 4,
    isActive: true
  }
];

const BRANDS = [
  { name: 'Firmitas Healthcare', slug: 'firmitas-healthcare', isActive: true, displayOrder: 1 },
  { name: 'Cipla', slug: 'cipla', isActive: true, displayOrder: 2 },
  { name: 'Sun Pharma', slug: 'sun-pharma', isActive: true, displayOrder: 3 },
  { name: 'Dr. Reddy’s', slug: 'dr-reddys', isActive: true, displayOrder: 4 },
  { name: 'Lupin', slug: 'lupin', isActive: true, displayOrder: 5 },
  { name: 'Mankind Pharma', slug: 'mankind-pharma', isActive: true, displayOrder: 6 },
  { name: 'Abbott', slug: 'abbott', isActive: true, displayOrder: 7 },
  { name: 'Zydus', slug: 'zydus', isActive: true, displayOrder: 8 },
  { name: 'Glenmark', slug: 'glenmark', isActive: true, displayOrder: 9 }
];

const PRODUCTS = [
  // ETHICAL / GENERIC (15 products)
  {
    name: 'Paracetamol Tablets IP',
    composition: 'Paracetamol 500 mg / 650 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Analgesic and antipyretic — fever and mild to moderate pain.',
    brandName: 'Firmitas Healthcare',
    slug: 'paracetamol-tablets-ip'
  },
  {
    name: 'Amoxicillin Capsules IP',
    composition: 'Amoxicillin Trihydrate 250 mg / 500 mg',
    categoryKey: 'ethical',
    form: 'Capsule',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 25°C in a dry place',
    therapeuticUse: 'Broad-spectrum penicillin antibiotic for bacterial infections.',
    brandName: 'Firmitas Healthcare',
    slug: 'amoxicillin-capsules-ip'
  },
  {
    name: 'Amoxicillin + Clavulanic Acid Tablets',
    composition: 'Amoxicillin 500 mg + Clavulanic Acid 125 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 6 Blister (Box of 60)',
    storage: 'Store below 25°C, protect from moisture',
    therapeuticUse: 'Beta-lactamase resistant antibiotic combination.',
    brandName: 'Firmitas Healthcare',
    slug: 'amoxicillin-clavulanic-acid-tablets'
  },
  {
    name: 'Azithromycin Tablets IP',
    composition: 'Azithromycin 250 mg / 500 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 3 / 10 x 5 Blister',
    storage: 'Store below 30°C',
    therapeuticUse: 'Macrolide antibiotic for respiratory and soft tissue infections.',
    brandName: 'Firmitas Healthcare',
    slug: 'azithromycin-tablets-ip'
  },
  {
    name: 'Cefixime Tablets IP',
    composition: 'Cefixime 200 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Third-generation oral cephalosporin antibiotic.',
    brandName: 'Firmitas Healthcare',
    slug: 'cefixime-tablets-ip'
  },
  {
    name: 'Metformin Hydrochloride Tablets IP',
    composition: 'Metformin HCl 500 mg / 850 mg / 1000 mg (SR available)',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 15 Blister (Box of 150)',
    storage: 'Store below 30°C in a dry place',
    therapeuticUse: 'First-line oral anti-diabetic for type 2 diabetes mellitus.',
    brandName: 'Firmitas Healthcare',
    slug: 'metformin-hydrochloride-tablets-ip'
  },
  {
    name: 'Glimepiride + Metformin Tablets',
    composition: 'Glimepiride 1 mg / 2 mg + Metformin 500 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C in a dry place',
    therapeuticUse: 'Combination oral anti-diabetic therapy.',
    brandName: 'Firmitas Healthcare',
    slug: 'glimepiride-metformin-tablets'
  },
  {
    name: 'Amlodipine Tablets IP',
    composition: 'Amlodipine Besylate 2.5 mg / 5 mg / 10 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Calcium channel blocker for hypertension and angina.',
    brandName: 'Firmitas Healthcare',
    slug: 'amlodipine-tablets-ip'
  },
  {
    name: 'Telmisartan Tablets IP',
    composition: 'Telmisartan 20 mg / 40 mg / 80 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from moisture',
    therapeuticUse: 'Angiotensin receptor blocker for hypertension.',
    brandName: 'Firmitas Healthcare',
    slug: 'telmisartan-tablets-ip'
  },
  {
    name: 'Atorvastatin Tablets IP',
    composition: 'Atorvastatin Calcium 10 mg / 20 mg / 40 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Statin for hyperlipidaemia and cardiovascular risk reduction.',
    brandName: 'Firmitas Healthcare',
    slug: 'atorvastatin-tablets-ip'
  },
  {
    name: 'Pantoprazole Tablets IP',
    composition: 'Pantoprazole Sodium 40 mg (enteric coated)',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from moisture',
    therapeuticUse: 'Proton pump inhibitor for acid peptic disorders.',
    brandName: 'Firmitas Healthcare',
    slug: 'pantoprazole-tablets-ip'
  },
  {
    name: 'Montelukast + Levocetirizine Tablets',
    composition: 'Montelukast 10 mg + Levocetirizine 5 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Allergic rhinitis and bronchial asthma management.',
    brandName: 'Firmitas Healthcare',
    slug: 'montelukast-levocetirizine-tablets'
  },
  {
    name: 'Diclofenac Sodium Tablets IP',
    composition: 'Diclofenac Sodium 50 mg (SR 100 mg available)',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'NSAID for inflammatory pain and musculoskeletal conditions.',
    brandName: 'Firmitas Healthcare',
    slug: 'diclofenac-sodium-tablets-ip'
  },
  {
    name: 'Levofloxacin Tablets IP',
    composition: 'Levofloxacin 250 mg / 500 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Fluoroquinolone antibiotic for respiratory and urinary infections.',
    brandName: 'Firmitas Healthcare',
    slug: 'levofloxacin-tablets-ip'
  },
  {
    name: 'Metronidazole Tablets IP',
    composition: 'Metronidazole 200 mg / 400 mg',
    categoryKey: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Nitroimidazole anti-infective for amoebiasis and anaerobic infections.',
    brandName: 'Firmitas Healthcare',
    slug: 'metronidazole-tablets-ip'
  },

  // SURGICAL & SUPPLIES (14 products)
  {
    name: 'Disposable Syringes with Needle',
    composition: 'Medical-grade polypropylene, sterile, non-toxic, non-pyrogenic (2 ml / 5 ml / 10 ml / 20 ml / 50 ml)',
    categoryKey: 'surgical',
    form: 'Disposable',
    rxType: 'Consumable',
    packaging: 'Box of 100 / Bulk shipper of 1000',
    storage: 'Store in a clean, dry area away from heat',
    therapeuticUse: 'Routine intramuscular, subcutaneous and intravenous injections.',
    brandName: 'Firmitas Healthcare',
    slug: 'disposable-syringes-with-needle'
  },
  {
    name: 'IV Cannula / Catheter',
    composition: 'PTFE / FEP catheter with stainless steel needle, radio-opaque lines (18G / 20G / 22G / 24G)',
    categoryKey: 'surgical',
    form: 'Disposable',
    rxType: 'Consumable',
    packaging: 'Box of 50 / Shipper of 500',
    storage: 'Store in original blister pack until use',
    therapeuticUse: 'Peripheral intravenous access for fluid, blood and medication infusion.',
    brandName: 'Firmitas Healthcare',
    slug: 'iv-cannula-catheter'
  },
  {
    name: 'IV Infusion Set (Gravity)',
    composition: 'Vented drip chamber, 15-micron fluid filter, roller clamp, luer lock connector',
    categoryKey: 'surgical',
    form: 'Disposable',
    rxType: 'Consumable',
    packaging: 'Pack of 25 / Master carton of 400',
    storage: 'Store in dry conditions',
    therapeuticUse: 'Gravity-driven intravenous administration of fluids and drugs.',
    brandName: 'Firmitas Healthcare',
    slug: 'iv-infusion-set-gravity'
  },
  {
    name: 'Latex Examination Gloves',
    composition: 'Natural rubber latex, powdered and powder-free variants (Sizes: S / M / L / XL)',
    categoryKey: 'surgical',
    form: 'PPE',
    rxType: 'Consumable',
    packaging: 'Dispenser box of 100 pcs (50 pairs)',
    storage: 'Store in cool, dry place away from direct sunlight',
    therapeuticUse: 'General clinical examination, diagnostic procedures and infection barrier.',
    brandName: 'Firmitas Healthcare',
    slug: 'latex-examination-gloves'
  },
  {
    name: 'Nitrile Examination Gloves',
    composition: '100% synthetic nitrile, powder-free, latex-free, chemo-tested (Sizes: S / M / L / XL)',
    categoryKey: 'surgical',
    form: 'PPE',
    rxType: 'Consumable',
    packaging: 'Dispenser box of 100 pcs',
    storage: 'Store below 30°C in dry conditions',
    therapeuticUse: 'Barrier protection for latex-sensitive staff and handling hazardous chemicals.',
    brandName: 'Firmitas Healthcare',
    slug: 'nitrile-examination-gloves'
  },
  {
    name: 'Absorbent Gauze Swabs / Sponges',
    composition: '100% bleached cotton gauze, 8-ply and 12-ply (7.5 cm x 7.5 cm / 10 cm x 10 cm, sterile & non-sterile)',
    categoryKey: 'surgical',
    form: 'Dressing',
    rxType: 'Consumable',
    packaging: 'Packs of 100 (non-sterile) / Blister of 2–5 pcs (sterile)',
    storage: 'Store in clean, dry storeroom',
    therapeuticUse: 'Wound cleaning, absorption of exudate and intraoperative hemostasis.',
    brandName: 'Firmitas Healthcare',
    slug: 'absorbent-gauze-swabs-sponges'
  },
  {
    name: 'Cotton Crepe Bandage B.P.',
    composition: 'High-twist cotton and rayon, fast edges, stretch ratio > 150% (5 cm / 7.5 cm / 10 cm / 15 cm x 4 m stretched)',
    categoryKey: 'surgical',
    form: 'Dressing',
    rxType: 'Consumable',
    packaging: 'Individually wrapped / Box of 10–20 rolls',
    storage: 'Store in cool, dry conditions',
    therapeuticUse: 'Compression support for sprains, strains, varicose veins and limb edema.',
    brandName: 'Firmitas Healthcare',
    slug: 'cotton-crepe-bandage-bp'
  },
  {
    name: 'Surgical Adhesive Plaster / Micropore Tape',
    composition: 'Non-woven paper tape / hypoallergenic adhesive (1.25 cm / 2.5 cm / 5 cm / 7.5 cm x 9 m)',
    categoryKey: 'surgical',
    form: 'Dressing',
    rxType: 'Consumable',
    packaging: 'Box of 12 / 24 rolls',
    storage: 'Store in dry place at ambient temperature',
    therapeuticUse: 'Fixation of dressings, tubing, cannulas and catheter lines on skin.',
    brandName: 'Firmitas Healthcare',
    slug: 'surgical-adhesive-plaster-micropore-tape'
  },
  {
    name: 'Foley Balloon Catheter (2-Way / 3-Way)',
    composition: 'Silicone elastomer / siliconised latex with balloon, drainage funnel and inflation valve (Fr 12–24)',
    categoryKey: 'surgical',
    form: 'Disposable',
    rxType: 'Consumable',
    packaging: 'Individually sterile peel-pack / Box of 10',
    storage: 'Store away from heat and light',
    therapeuticUse: 'Short- and long-term urinary catheterisation and bladder drainage.',
    brandName: 'Firmitas Healthcare',
    slug: 'foley-balloon-catheter'
  },
  {
    name: 'Urine Drainage Bag with Anti-Reflux Valve',
    composition: 'Medical-grade PVC, 2000 ml capacity, flexible kink-resistant tube, bottom outlet',
    categoryKey: 'surgical',
    form: 'Disposable',
    rxType: 'Consumable',
    packaging: 'Pack of 10 / Master carton of 100',
    storage: 'Store in dry conditions',
    therapeuticUse: 'Closed urinary collection connected to Foley catheters.',
    brandName: 'Firmitas Healthcare',
    slug: 'urine-drainage-bag-with-anti-reflux-valve'
  },
  {
    name: 'Surgical Suture (PGA / Chromic Catgut / Silk)',
    composition: 'Braided polyglycolic acid (absorbable) / Virgin silk (non-absorbable) with swaged stainless needle',
    categoryKey: 'surgical',
    form: 'Dressing',
    rxType: 'Consumable',
    packaging: 'Box of 12 / 36 foils',
    storage: 'Store in original sealed foil below 25°C',
    therapeuticUse: 'Soft-tissue approximation and ligation in general, OB/GYN and orthopaedic surgery.',
    brandName: 'Firmitas Healthcare',
    slug: 'surgical-suture-pga-chromic-catgut-silk'
  },
  {
    name: 'Surgical Face Masks (3-Ply / N95)',
    composition: 'Spunbond non-woven + meltblown filtration layer + nose wire, bacterial filtration efficiency > 98%',
    categoryKey: 'surgical',
    form: 'PPE',
    rxType: 'Consumable',
    packaging: 'Dispenser box of 50 pcs (3-Ply) / Box of 20 (N95)',
    storage: 'Store in clean, moisture-free conditions',
    therapeuticUse: 'Respiratory barrier for healthcare personnel and surgical suites.',
    brandName: 'Firmitas Healthcare',
    slug: 'surgical-face-masks-3-ply-n95'
  },
  {
    name: 'Disposable Surgical Gowns',
    composition: 'SMMS fluid-resistant non-woven fabric, reinforced front and sleeves (Sizes: L / XL / XXL, sterile & non-sterile)',
    categoryKey: 'surgical',
    form: 'PPE',
    rxType: 'Consumable',
    packaging: 'Individual sterile pouch / Pack of 10',
    storage: 'Store in dry conditions away from moisture',
    therapeuticUse: 'Operating theatre protective gown for sterile field procedures.',
    brandName: 'Firmitas Healthcare',
    slug: 'disposable-surgical-gowns'
  },
  {
    name: 'Povidone-Iodine Surgical Solution 10%',
    composition: 'Povidone-Iodine IP 10% w/v (available iodine 1% w/v)',
    categoryKey: 'surgical',
    form: 'Topical',
    rxType: 'Consumable',
    packaging: '100 ml / 500 ml / 2 Litre / 5 Litre bulk jerrycan',
    storage: 'Store below 25°C, protect from direct light',
    therapeuticUse: 'Pre-operative skin antisepsis and wound disinfection.',
    brandName: 'Firmitas Healthcare',
    slug: 'povidone-iodine-surgical-solution-10'
  },

  // OTC & HEALTH SUPPLEMENTS (12 products)
  {
    name: 'B-Complex with Vitamin C & Zinc Capsules',
    composition: 'Vitamin B1, B2, B6, B12, Niacinamide, Calcium Pantothenate, Folic Acid, Vitamin C + Zinc Sulphate',
    categoryKey: 'otc',
    form: 'Capsule',
    rxType: 'OTC',
    packaging: '10 x 15 / 10 x 20 Blister strip',
    storage: 'Store below 25°C, protect from moisture',
    therapeuticUse: 'Nutritional supplement for fatigue, convalescence, neuropathy and immunity.',
    brandName: 'Firmitas Healthcare',
    slug: 'b-complex-vitamin-c-zinc-capsules'
  },
  {
    name: 'Calcium + Vitamin D3 Tablets',
    composition: 'Elemental Calcium 500 mg (from Calcium Carbonate) + Cholecalciferol (Vit D3) 250 IU / 500 IU',
    categoryKey: 'otc',
    form: 'Tablet',
    rxType: 'OTC',
    packaging: 'Bottle of 60 / 10 x 15 Blister',
    storage: 'Store in a dry place below 25°C',
    therapeuticUse: 'Bone mineral density, osteoporosis prevention and calcium deficiency supplementation.',
    brandName: 'Firmitas Healthcare',
    slug: 'calcium-vitamin-d3-tablets'
  },
  {
    name: 'Oral Rehydration Salts (ORS) IP — WHO Formula',
    composition: 'Sodium Chloride 2.6 g, Potassium Chloride 1.5 g, Sodium Citrate 2.9 g, Anhydrous Glucose 13.5 g per sachet',
    categoryKey: 'otc',
    form: 'Powder',
    rxType: 'OTC',
    packaging: 'Box of 20 / 50 sachets (21.8 g each for 1 Litre solution)',
    storage: 'Store in dry conditions',
    therapeuticUse: 'Correction and prevention of dehydration caused by diarrhoea, vomiting and heat exhaustion.',
    brandName: 'Firmitas Healthcare',
    slug: 'oral-rehydration-salts-ors-ip'
  },
  {
    name: 'Antacid Suspension (Magaldrate + Simethicone)',
    composition: 'Magaldrate 400 mg + Simethicone 20 mg per 5 ml (Mint / Strawberry flavour)',
    categoryKey: 'otc',
    form: 'Suspension',
    rxType: 'OTC',
    packaging: '170 ml / 200 ml PET bottle with measuring cup',
    storage: 'Store below 30°C, shake well before use',
    therapeuticUse: 'Symptomatic relief of acidity, heartburn, gastritis and flatulence.',
    brandName: 'Firmitas Healthcare',
    slug: 'antacid-suspension-magaldrate-simethicone'
  },
  {
    name: 'Cough Syrup (Dextromethorphan + CPM + Phenylephrine)',
    composition: 'Dextromethorphan HBr 10 mg + Chlorpheniramine 2 mg + Phenylephrine HCl 5 mg per 5 ml',
    categoryKey: 'otc',
    form: 'Suspension',
    rxType: 'OTC',
    packaging: '100 ml bottle in carton',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Dry, irritating cough, allergic rhinitis and upper respiratory congestion.',
    brandName: 'Firmitas Healthcare',
    slug: 'cough-syrup-dextromethorphan-cpm'
  },
  {
    name: 'Diclofenac + Linseed Oil + Methyl Salicylate Gel',
    composition: 'Diclofenac Diethylamine 1.16% + Linseed Oil 3% + Methyl Salicylate 10% + Menthol 5%',
    categoryKey: 'otc',
    form: 'Topical',
    rxType: 'OTC',
    packaging: '30 g / 50 g laminated tube in carton',
    storage: 'Store below 25°C, do not freeze',
    therapeuticUse: 'Topical pain relief for joint pain, low backache, sprains, myalgia and sports injuries.',
    brandName: 'Firmitas Healthcare',
    slug: 'diclofenac-linseed-oil-gel'
  },
  {
    name: 'Paracetamol Paediatric Oral Suspension IP',
    composition: 'Paracetamol 120 mg / 250 mg per 5 ml (Palatable flavour)',
    categoryKey: 'otc',
    form: 'Suspension',
    rxType: 'OTC',
    packaging: '60 ml PET bottle with measuring cup / dropper',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Fever and pain relief in infants and children following immunisation or infection.',
    brandName: 'Firmitas Healthcare',
    slug: 'paracetamol-paediatric-oral-suspension-ip'
  },
  {
    name: 'Glucose Powder with Vitamin C & Zinc',
    composition: 'Dextrose Monohydrate 99.4% + Vitamin C 50 mg + Zinc Sulphate per 100 g (Orange / Lemon flavours)',
    categoryKey: 'otc',
    form: 'Powder',
    rxType: 'OTC',
    packaging: '75 g / 200 g / 500 g refill pouch and tin',
    storage: 'Store in a cool, dry place in airtight container',
    therapeuticUse: 'Instant energy replenishment during sports, heat exhaustion, weakness and convalescence.',
    brandName: 'Firmitas Healthcare',
    slug: 'glucose-powder-vitamin-c-zinc'
  },
  {
    name: 'Cetirizine Hydrochloride Tablets IP',
    composition: 'Cetirizine HCl 10 mg',
    categoryKey: 'otc',
    form: 'Tablet',
    rxType: 'OTC',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 30°C',
    therapeuticUse: 'Second-generation non-sedating antihistamine for allergic rhinitis and urticaria.',
    brandName: 'Firmitas Healthcare',
    slug: 'cetirizine-hydrochloride-tablets-ip'
  },
  {
    name: 'Folic Acid Tablets IP',
    composition: 'Folic Acid 5 mg',
    categoryKey: 'otc',
    form: 'Tablet',
    rxType: 'OTC',
    packaging: '10 x 10 / 10 x 30 Blister strip',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Megaloblastic anaemia, preconception neural tube defect prevention and pregnancy supplementation.',
    brandName: 'Firmitas Healthcare',
    slug: 'folic-acid-tablets-ip'
  },
  {
    name: 'Isopropyl Alcohol 70% Hand Rub / Sanitiser',
    composition: 'Isopropyl Alcohol IP 70% v/v + Glycerol + Hydrogen Peroxide (WHO formulation)',
    categoryKey: 'otc',
    form: 'Topical',
    rxType: 'OTC',
    packaging: '100 ml / 500 ml pump bottle / 5 Litre bulk can',
    storage: 'Flammable — store below 30°C away from flame',
    therapeuticUse: 'Rapid hand antisepsis in clinical settings and everyday hygiene.',
    brandName: 'Firmitas Healthcare',
    slug: 'isopropyl-alcohol-70-hand-rub'
  },
  {
    name: 'Povidone-Iodine Ointment 5%',
    composition: 'Povidone-Iodine IP 5% w/w (available iodine 0.5% w/w)',
    categoryKey: 'otc',
    form: 'Topical',
    rxType: 'OTC',
    packaging: '15 g / 20 g / 250 g jar',
    storage: 'Store below 25°C, do not freeze',
    therapeuticUse: 'Antiseptic treatment of minor cuts, wounds, abrasions and minor burns.',
    brandName: 'Firmitas Healthcare',
    slug: 'povidone-iodine-ointment-5'
  },

  // CRITICAL CARE & INJECTABLES (13 products)
  {
    name: 'Ceftriaxone for Injection IP',
    composition: 'Ceftriaxone Sodium 500 mg / 1000 mg / 2000 mg (with sterile water for injection)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: 'Vial with WFI ampoule / Box of 10 vials',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Third-generation cephalosporin for severe hospital-acquired infections, meningitis and sepsis.',
    brandName: 'Firmitas Healthcare',
    slug: 'ceftriaxone-for-injection-ip'
  },
  {
    name: 'Piperacillin + Tazobactam for Injection',
    composition: 'Piperacillin Sodium 4000 mg + Tazobactam Sodium 500 mg (4.5 g vial)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: 'Single-dose glass vial / Box of 5',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Broad-spectrum antipseudomonal penicillin combination for ICU, intra-abdominal and pulmonary infections.',
    brandName: 'Firmitas Healthcare',
    slug: 'piperacillin-tazobactam-for-injection'
  },
  {
    name: 'Meropenem for Injection IP',
    composition: 'Meropenem Trihydrate 500 mg / 1000 mg',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: 'Vial in individual carton / Box of 10',
    storage: 'Store below 25°C, do not freeze',
    therapeuticUse: 'Carbapenem antibiotic for multidrug-resistant infections, severe pneumonia and febrile neutropenia.',
    brandName: 'Firmitas Healthcare',
    slug: 'meropenem-for-injection-ip'
  },
  {
    name: 'Enoxaparin Sodium Injection IP (Prefilled Syringe)',
    composition: 'Enoxaparin Sodium 20 mg / 40 mg / 60 mg in prefilled syringe with safety lock',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: 'Pack of 2 prefilled syringes in blister',
    storage: 'Store below 25°C — do not freeze',
    therapeuticUse: 'Low molecular weight heparin for DVT prophylaxis, treatment of PE and acute coronary syndrome.',
    brandName: 'Firmitas Healthcare',
    slug: 'enoxaparin-sodium-injection-ip'
  },
  {
    name: 'Adrenaline (Epinephrine) Injection IP',
    composition: 'Adrenaline Bitartrate 1 mg/ml (1:1000)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '1 ml glass ampoule / Box of 10 / 50',
    storage: 'Store below 25°C, protect from light — do not use if discoloured',
    therapeuticUse: 'Emergency treatment of anaphylaxis, cardiac arrest and severe acute asthma.',
    brandName: 'Firmitas Healthcare',
    slug: 'adrenaline-epinephrine-injection-ip'
  },
  {
    name: 'Atropine Sulphate Injection IP',
    composition: 'Atropine Sulphate 0.6 mg/ml',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '1 ml ampoule / Box of 10 / 50',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Anticholinergic for symptomatic bradycardia, organophosphate poisoning and pre-anaesthetic medication.',
    brandName: 'Firmitas Healthcare',
    slug: 'atropine-sulphate-injection-ip'
  },
  {
    name: 'Noradrenaline (Norepinephrine) Injection IP',
    composition: 'Noradrenaline Base 2 mg/ml (as Noradrenaline Tartrate 4 mg/2 ml)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '2 ml / 4 ml ampoule / Box of 5 / 10',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Potent vasopressor for restoration of blood pressure in acute hypotensive states and septic shock.',
    brandName: 'Firmitas Healthcare',
    slug: 'noradrenaline-norepinephrine-injection-ip'
  },
  {
    name: 'Hydrocortisone Sodium Succinate for Injection IP',
    composition: 'Hydrocortisone 100 mg / 200 mg / 400 mg (lyophilised vial with solvent)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: 'Vial with solvent ampoule / Box of 5',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: 'Short-acting corticosteroid for acute adrenal crisis, severe allergic emergencies and shock.',
    brandName: 'Firmitas Healthcare',
    slug: 'hydrocortisone-sodium-succinate-injection-ip'
  },
  {
    name: 'Furosemide Injection IP',
    composition: 'Furosemide 10 mg/ml (20 mg / 2 ml ampoule)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '2 ml amber ampoule / Box of 10 / 50',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Loop diuretic for acute pulmonary edema, congestive heart failure and oliguria.',
    brandName: 'Firmitas Healthcare',
    slug: 'furosemide-injection-ip'
  },
  {
    name: 'Ondansetron Injection IP',
    composition: 'Ondansetron HCl 2 mg/ml (4 mg / 2 ml ampoule)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '2 ml ampoule / Box of 10',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: '5-HT3 receptor antagonist for prevention and treatment of post-operative nausea and chemotherapy-induced vomiting.',
    brandName: 'Firmitas Healthcare',
    slug: 'ondansetron-injection-ip'
  },
  {
    name: 'Tramadol Hydrochloride Injection IP',
    composition: 'Tramadol HCl 50 mg/ml (100 mg / 2 ml ampoule)',
    categoryKey: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    packaging: '2 ml ampoule / Box of 10',
    storage: 'Store below 30°C, protect from light',
    therapeuticUse: 'Centrally acting opioid analgesic for moderate to severe post-operative and acute pain.',
    brandName: 'Firmitas Healthcare',
    slug: 'tramadol-hydrochloride-injection-ip'
  },
  {
    name: 'Sodium Chloride IV Infusion 0.9% (Normal Saline)',
    composition: 'Sodium Chloride IP 0.9% w/v in Water for Injection (Osmolarity ~308 mOsm/L)',
    categoryKey: 'critical',
    form: 'IV Fluid',
    rxType: 'Rx',
    packaging: '100 ml / 500 ml / 1000 ml BFS (Blow-Fill-Seal) plastic bottle / Carton of 24–48',
    storage: 'Store below 30°C, do not freeze',
    therapeuticUse: 'Isotonic fluid resuscitation, electrolyte replenishment and vehicle for IV drug administration.',
    brandName: 'Firmitas Healthcare',
    slug: 'sodium-chloride-iv-infusion-0-9'
  },
  {
    name: 'Human Normal Immunoglobulin (IVIG) 5%',
    composition: 'Human Normal Immunoglobulin 5 g / 100 ml (liquid formulation, cold-chain handled)',
    categoryKey: 'critical',
    form: 'IV Fluid',
    rxType: 'Rx',
    packaging: '50 ml / 100 ml vial in cold-box shipper',
    storage: 'Cold-chain required — 2°C to 8°C, do not freeze, protect from light',
    therapeuticUse: 'Primary immunodeficiency, ITP, Kawasaki disease, Guillain-Barré syndrome and severe sepsis adjunct.',
    brandName: 'Firmitas Healthcare',
    slug: 'human-normal-immunoglobulin-ivig-5'
  }
];

const FAQS = [
  {
    question: 'You are a new company — why should I buy from you?',
    answer: 'We are upfront about being newly founded. What that means in practice is that you deal directly with the people who own the outcome: no layered account management, no minimum-order politics, and direct answers on availability, pricing and documentation. We would rather earn a second order than oversell the first one.',
    category: 'General',
    displayOrder: 1,
    isActive: true
  },
  {
    question: 'Why are no prices shown on the website?',
    answer: 'Pharmaceutical pricing moves with pack size, quantity, brand and batch. Publishing a number that is stale by the time you read it helps nobody. Send the requirement and you get a current quote against your actual quantity.',
    category: 'Commercial',
    displayOrder: 2,
    isActive: true
  },
  {
    question: 'Is there a minimum order quantity?',
    answer: 'No rigid minimum. Quantities are quoted per enquiry, so a first trial order can be structured around what you actually need rather than around a threshold.',
    category: 'Commercial',
    displayOrder: 3,
    isActive: true
  },
  {
    question: 'What do I need to provide to buy prescription products?',
    answer: 'For prescription (Schedule H / H1) products we need a copy of your valid drug licence and your GST registration before supply. Over-the-counter lines and surgical consumables do not require a drug licence.',
    category: 'Compliance',
    displayOrder: 4,
    isActive: true
  },
  {
    question: 'What documentation comes with the order?',
    answer: 'A tax invoice listing every line item with its batch number, manufacturing date and expiry date. A Certificate of Analysis can be provided on request for applicable products, and export consignments include the customs paperwork for the destination.',
    category: 'Compliance',
    displayOrder: 5,
    isActive: true
  },
  {
    question: 'Is the product list on the site your live stock?',
    answer: 'No — it describes the lines we supply against enquiry. Availability, the specific manufacturer and the batch are confirmed at the time of quotation, before you commit to anything.',
    category: 'Products',
    displayOrder: 6,
    isActive: true
  },
  {
    question: 'Can you source something that is not listed?',
    answer: 'Yes. Custom molecules, alternate strengths, different pack presentations and specific manufacturer preferences are all sourced on request. Send the specification and we will come back on whether we can supply it.',
    category: 'Products',
    displayOrder: 7,
    isActive: true
  },
  {
    question: 'Do you supply narcotics or Schedule X drugs?',
    answer: 'No. We do not deal in narcotic, psychotropic or Schedule X controlled substances.',
    category: 'Compliance',
    displayOrder: 8,
    isActive: true
  },
  {
    question: 'Do you handle export orders?',
    answer: 'We accept export enquiries. Export supply is always subject to the destination country\'s import permit, drug control approvals and registration requirements, which we confirm before quoting.',
    category: 'General',
    displayOrder: 9,
    isActive: true
  },
  {
    question: 'How quickly will I hear back?',
    answer: 'Enquiries are handled during business hours — Monday to Saturday, 09:00 – 18:00 IST. If a requirement is urgent, call or WhatsApp on +91 82002 28607 rather than using the form.',
    category: 'General',
    displayOrder: 10,
    isActive: true
  }
];

const TESTIMONIALS = [
  {
    name: 'Dr. Rajesh Patel',
    company: 'Sterling Hospital & Surgical Center',
    quote: 'Firmitas 1 has been exceptionally reliable for our routine surgical disposables and ICU antibiotic supplies. Transparent batch tracking and zero delivery delays.',
    rating: 5,
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Suresh Mehta',
    company: 'Apex Pharmacy Retail Network',
    quote: 'Sourcing fast-moving generics and OTC products directly from Firmitas 1 cut down our procurement turnaround time significantly. Highly recommended.',
    rating: 5,
    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Pooja Shah',
    company: 'Lifeline Critical Care Nursing Home',
    quote: 'Their cold-chain logistics for biologicals and emergency injectables adhere strictly to storage norms with tamper-evident batch documentation.',
    rating: 5,
    isActive: true,
    displayOrder: 3
  }
];

const BLOGS = [
  {
    title: 'Essential Hospital Consumables & Surgical Disposables Checklist for 2026',
    slug: 'essential-hospital-consumables-checklist-2026',
    body: 'Managing routine procurement for multi-specialty hospitals requires dependable supplies of surgical gloves, cannulas, IV sets, and wound dressings. Here is the operational checklist for inventory managers.',
    author: 'Firmitas Healthcare Team',
    tags: ['Hospital Supplies', 'Surgical Consumables', 'Procurement'],
    status: 'published'
  },
  {
    title: 'Understanding Cold Chain Storage in Pharmaceutical Distribution',
    slug: 'understanding-cold-chain-storage-pharma',
    body: 'Maintaining the 2°C to 8°C temperature window is critical for vaccines, insulin, and human normal immunoglobulins (IVIG). Learn how controlled temperature logging prevents potency loss.',
    author: 'Quality Assurance Desk',
    tags: ['Cold Chain', 'Critical Care', 'Compliance'],
    status: 'published'
  },
  {
    title: 'Ethical vs Generic Formulations: Quality & Bioequivalence Standards',
    slug: 'ethical-vs-generic-formulations-guide',
    body: 'A guide for clinical directors and retail pharmacists on assessing bioequivalence certificates (COA), GMP certifications, and drug master files for generic pharmaceuticals.',
    author: 'Regulatory Affairs',
    tags: ['Generics', 'Quality Assurance', 'CDSCO'],
    status: 'published'
  }
];

const PAGES = [
  { key: 'seo', name: 'SEO & Meta', route: '/', displayOrder: 1, sectionCount: 1 },
  { key: 'site-wide', name: 'Site-Wide Details', route: '/', displayOrder: 2, sectionCount: 3 },
  { key: 'home', name: 'Home Page', route: '/', displayOrder: 3, sectionCount: 4 },
  { key: 'about', name: 'About Us', route: '/about', displayOrder: 4, sectionCount: 3 },
  { key: 'categories', name: 'Divisions & Categories', route: '/categories', displayOrder: 5, sectionCount: 2 },
  { key: 'products', name: 'Products Catalog', route: '/products', displayOrder: 6, sectionCount: 2 },
  { key: 'why-choose-us', name: 'Why Choose Us', route: '/why-choose-us', displayOrder: 7, sectionCount: 3 },
  { key: 'compliance', name: 'Compliance & Quality', route: '/compliance', displayOrder: 8, sectionCount: 3 },
  { key: 'contact', name: 'Contact Us', route: '/contact', displayOrder: 9, sectionCount: 2 },
  { key: 'enquiry', name: 'Enquiry / RFQ', route: '/enquiry', displayOrder: 10, sectionCount: 2 }
];

const SECTIONS = [
  // SITE-WIDE
  {
    pageKey: 'site-wide',
    key: 'top-nav-bar',
    name: 'Top Navigation & Header',
    description: 'Header brand title, phone hotline, and quotation button.',
    order: 1,
    fields: [
      { key: 'brandTitle', label: 'Brand Name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'ctaButtonText', label: 'Header CTA Button', type: 'text' },
      { key: 'primaryPhone', label: 'Phone Number', type: 'text' },
      { key: 'primaryEmail', label: 'Contact Email', type: 'text' }
    ],
    initialData: {
      brandTitle: 'Firmitas 1',
      tagline: 'Global Reach. Trusted Care.',
      ctaButtonText: 'Request a Quote',
      primaryPhone: '+91 82002 28607',
      primaryEmail: 'sales@firmitas1.com'
    }
  },
  {
    pageKey: 'site-wide',
    key: 'company-contact-details',
    name: 'Company Office & Address',
    description: 'Office address, working hours and WhatsApp contact.',
    order: 2,
    fields: [
      { key: 'legalName', label: 'Legal Company Name', type: 'text' },
      { key: 'officeAddress', label: 'Office Address', type: 'textarea' },
      { key: 'workingHours', label: 'Working Hours', type: 'text' },
      { key: 'whatsappNumber', label: 'WhatsApp Number', type: 'text' }
    ],
    initialData: {
      legalName: 'Firmitas 1 Pharma Solutions',
      officeAddress: 'Ahmedabad / Gujarat, India',
      workingHours: 'Monday to Saturday, 09:00 – 18:00 IST',
      whatsappNumber: '918200228607'
    }
  },
  {
    pageKey: 'site-wide',
    key: 'footer-content',
    name: 'Footer & Regulatory Disclaimer',
    description: 'Copyright notice and B2B pharmaceutical disclaimer.',
    order: 3,
    fields: [
      { key: 'copyrightText', label: 'Copyright Notice', type: 'text' },
      { key: 'disclaimerText', label: 'Wholesale / B2B Disclaimer', type: 'textarea' }
    ],
    initialData: {
      copyrightText: `© ${new Date().getFullYear()} Firmitas 1 Pharma Solutions. All Rights Reserved.`,
      disclaimerText: 'Firmitas 1 is a B2B pharmaceutical and healthcare distributor. All prescription medicines and surgical supplies are provided exclusively against valid drug licenses and institutional credentials.'
    }
  },

  // HOME
  {
    pageKey: 'home',
    key: 'hero-banner',
    name: 'Hero Banner & Core Promise',
    description: 'Primary headline, subtitle, badge and CTA buttons on the Home page.',
    order: 1,
    fields: [
      { key: 'badgeText', label: 'Top Pill / Badge', type: 'text' },
      { key: 'mainHeadline', label: 'Main Headline', type: 'text' },
      { key: 'subHeadline', label: 'Sub-headline / Paragraph', type: 'textarea' },
      { key: 'primaryCta', label: 'Primary Button Label', type: 'text' },
      { key: 'secondaryCta', label: 'Secondary Button Label', type: 'text' }
    ],
    initialData: {
      badgeText: 'Newly Founded · Now Accepting Bulk Enquiries',
      mainHeadline: 'Complete Pharmacy Solutions',
      subHeadline: 'Firmitas 1 is a newly founded pharmaceutical distributor supplying ethical drugs, surgical essentials, critical care medicines, and OTC products to pharmacies, hospitals, and clinics. Tell us what you need and we will quote it.',
      primaryCta: 'Request Bulk Quote',
      secondaryCta: 'View Catalog'
    }
  },
  {
    pageKey: 'home',
    key: 'stats-counter',
    name: 'Quick Metrics / Stats Bar',
    description: 'Core statistics displayed in the trust strip.',
    order: 2,
    fields: [
      { key: 'stat1Value', label: 'Stat 1 Value', type: 'text' },
      { key: 'stat1Label', label: 'Stat 1 Label', type: 'text' },
      { key: 'stat2Value', label: 'Stat 2 Value', type: 'text' },
      { key: 'stat2Label', label: 'Stat 2 Label', type: 'text' },
      { key: 'stat3Value', label: 'Stat 3 Value', type: 'text' },
      { key: 'stat3Label', label: 'Stat 3 Label', type: 'text' }
    ],
    initialData: {
      stat1Value: '54+',
      stat1Label: 'Core Product Lines',
      stat2Value: '100%',
      stat2Label: 'Batch Traceable with COA',
      stat3Value: '24-48h',
      stat3Label: 'Quotation Turnaround'
    }
  },

  // ABOUT
  {
    pageKey: 'about',
    key: 'about-header',
    name: 'About Page Header & Mission',
    description: 'Title, subtitle and founding ethos.',
    order: 1,
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
      { key: 'missionStatement', label: 'Mission Statement', type: 'textarea' }
    ],
    initialData: {
      title: 'About Firmitas 1',
      subtitle: 'Building a dependable pharmaceutical distribution bridge across India and global partners.',
      missionStatement: 'To make quality pharmaceuticals, critical injectables, and surgical essentials seamlessly accessible with transparent batch documentation, fair commercial terms, and dedicated human support.'
    }
  },

  // PRODUCTS
  {
    pageKey: 'products',
    key: 'products-header',
    name: 'Product Catalog Header',
    description: 'Title and subtitle shown above the product catalog.',
    order: 1,
    fields: [
      { key: 'title', label: 'Catalog Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' }
    ],
    initialData: {
      title: 'Explore Our Core Catalog',
      subtitle: 'Browse 54 pharmaceutical formulations, surgical consumables, OTC lines and critical care injectables. Filter by division or search by active molecule.'
    }
  },

  // CONTACT
  {
    pageKey: 'contact',
    key: 'contact-header',
    name: 'Contact Page Header',
    description: 'Headline and intro text on the Contact page.',
    order: 1,
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' }
    ],
    initialData: {
      title: 'Get in Touch with Our Procurement Desk',
      subtitle: 'Whether you need a full hospital supply tender or a single bulk molecule quotation, our team responds promptly.'
    }
  },

  // SEO
  {
    pageKey: 'seo',
    key: 'meta-tags',
    name: 'Global Site SEO & OpenGraph',
    description: 'Default meta title, description, and keywords.',
    order: 1,
    fields: [
      { key: 'siteTitle', label: 'Default Site Title', type: 'text' },
      { key: 'metaDescription', label: 'Default Meta Description', type: 'textarea' },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'text' }
    ],
    initialData: {
      siteTitle: 'Firmitas 1 — Pharmaceutical & Healthcare Supplies Distributor',
      metaDescription: 'Wholesale distributor of ethical & generic medicines, surgical supplies, OTC products, and critical care injectables across India.',
      keywords: 'Firmitas 1, pharmaceutical distributor, hospital supplies India, wholesale medicines, critical care drugs'
    }
  }
];

async function seed() {
  await connectDB();
  console.log(`[Seed] Connected to database: "${mongoose.connection.name}"`);

  // ---- 1. Roles -----------------------------------------------------------
  const superAdminPermissions: Record<string, any> = {};
  const editorPermissions: Record<string, any> = {};
  ALL_MODULES.forEach((m) => {
    superAdminPermissions[m] = { view: true, create: true, edit: true, delete: true, publish: true };
    editorPermissions[m] = {
      view: true,
      create: !['roles', 'users', 'email_setup'].includes(m),
      edit: !['roles', 'users', 'email_setup'].includes(m),
      delete: false,
      publish: m === 'website_editor'
    };
  });

  await Role.updateOne(
    { key: 'super_admin' },
    {
      $set: { permissions: superAdminPermissions },
      $setOnInsert: {
        name: 'Super Admin',
        description: 'Unrestricted access to all Firmitas admin and CMS controls',
        isSystem: true
      }
    },
    { upsert: true }
  );

  await Role.updateOne(
    { key: 'editor' },
    {
      $setOnInsert: {
        name: 'Content Manager',
        description: 'Can manage catalog products, enquiries, and website content',
        permissions: editorPermissions,
        isSystem: false
      }
    },
    { upsert: true }
  );

  const superAdminRole = await Role.findOne({ key: 'super_admin' });
  console.log('[Seed] Roles ready (super_admin, editor)');

  // ---- 2. Super Admin User -----------------------------------------------
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@firmitas.com').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, await bcrypt.genSalt(10));
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      passwordHash,
      role: superAdminRole!._id,
      isActive: true,
      avatar: ''
    });
    console.log(`[Seed] Created super admin "${adminEmail}"`);
  } else {
    console.log(`[Seed] Admin user "${adminEmail}" exists`);
  }

  // ---- 3. Categories -----------------------------------------------------
  for (const cat of CATEGORIES) {
    await Category.updateOne(
      { key: cat.key },
      { $set: { name: cat.name, displayOrder: cat.displayOrder, isActive: cat.isActive } },
      { upsert: true }
    );
  }
  console.log(`[Seed] ${CATEGORIES.length} Categories seeded`);

  // ---- 4. Brands ---------------------------------------------------------
  for (const br of BRANDS) {
    await Brand.updateOne(
      { slug: br.slug },
      { $set: { name: br.name, displayOrder: br.displayOrder, isActive: br.isActive } },
      { upsert: true }
    );
  }
  console.log(`[Seed] ${BRANDS.length} Brands seeded`);

  // ---- 5. Products (Clean legacy non-pharma records & seed all 54) --------
  // Delete any non-pharma test products (e.g. motors, cables, FRP)
  await Product.deleteMany({ categoryKey: { $nin: ['ethical', 'surgical', 'otc', 'critical'] } });

  let srNo = 1;
  for (const prod of PRODUCTS) {
    await Product.updateOne(
      { slug: prod.slug },
      {
        $set: {
          srNo: srNo++,
          name: prod.name,
          composition: prod.composition,
          categoryKey: prod.categoryKey,
          form: prod.form,
          rxType: prod.rxType,
          packaging: prod.packaging,
          storage: prod.storage,
          therapeuticUse: prod.therapeuticUse,
          brandName: prod.brandName,
          status: 'active'
        }
      },
      { upsert: true }
    );
  }
  const totalProds = await Product.countDocuments();
  console.log(`[Seed] ${totalProds} Pharmaceutical Products active in database`);

  // ---- 6. FAQs -----------------------------------------------------------
  await Faq.deleteMany({});
  for (const f of FAQS) {
    await Faq.create(f);
  }
  console.log(`[Seed] ${FAQS.length} FAQs seeded`);

  // ---- 7. Testimonials ---------------------------------------------------
  await Testimonial.deleteMany({});
  for (const t of TESTIMONIALS) {
    await Testimonial.create(t);
  }
  console.log(`[Seed] ${TESTIMONIALS.length} Testimonials seeded`);

  // ---- 8. Blogs ----------------------------------------------------------
  await Blog.deleteMany({});
  for (const b of BLOGS) {
    await Blog.create(b);
  }
  console.log(`[Seed] ${BLOGS.length} Blogs seeded`);

  // ---- 9. Website CMS Pages & Sections -----------------------------------
  for (const p of PAGES) {
    await Page.updateOne({ key: p.key }, { $set: p }, { upsert: true });
  }
  console.log(`[Seed] ${PAGES.length} CMS pages ready`);

  for (const s of SECTIONS) {
    await Section.updateOne(
      { pageKey: s.pageKey, key: s.key },
      { $set: { name: s.name, description: s.description, order: s.order, fields: s.fields } },
      { upsert: true }
    );

    const section = await Section.findOne({ pageKey: s.pageKey, key: s.key });
    const content = await SectionContent.findOne({ pageKey: s.pageKey, sectionKey: s.key });
    if (!content) {
      await SectionContent.create({
        sectionId: section!._id,
        pageKey: s.pageKey,
        sectionKey: s.key,
        draftData: s.initialData,
        publishedData: s.initialData,
        isEdited: false,
        status: 'published',
        lastEditedBy: 'System',
        lastEditedAt: new Date()
      });
    }
  }
  console.log(`[Seed] ${SECTIONS.length} CMS sections ready`);

  console.log('\n======================================================');
  console.log('✅ [Seed] FIRMITAS 1 COMPLETE DATABASE SEEDING FINISHED!');
  console.log(`   - 54 Pharmaceutical Products`);
  console.log(`   - 4 Divisions (Ethical, Surgical, OTC, Critical)`);
  console.log(`   - 10 CMS Pages & Real Section Templates`);
  console.log(`   - 10 FAQs, 3 Testimonials, 3 Industry Blogs`);
  console.log(`   - Super Admin: ${adminEmail}`);
  console.log('======================================================\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ [Seed] Error during seeding:', err);
  process.exit(1);
});
