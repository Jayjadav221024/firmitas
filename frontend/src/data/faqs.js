import { company } from './company';

// Straight answers to what a first-time buyer actually asks a new distributor.
export const faqs = [
  {
    q: 'You are a new company — why should I buy from you?',
    a: 'We are upfront about being newly founded. What that means in practice is that you deal directly with the people who own the outcome: no layered account management, no minimum-order politics, and direct answers on availability, pricing and documentation. We would rather earn a second order than oversell the first one.',
  },
  {
    q: 'Why are no prices shown on the website?',
    a: 'Pharmaceutical pricing moves with pack size, quantity, brand and batch. Publishing a number that is stale by the time you read it helps nobody. Send the requirement and you get a current quote against your actual quantity.',
  },
  {
    q: 'Is there a minimum order quantity?',
    a: 'No rigid minimum. Quantities are quoted per enquiry, so a first trial order can be structured around what you actually need rather than around a threshold.',
  },
  {
    q: 'What do I need to provide to buy prescription products?',
    a: 'For prescription (Schedule H / H1) products we need a copy of your valid drug licence and your GST registration before supply. Over-the-counter lines and surgical consumables do not require a drug licence.',
  },
  {
    q: 'What documentation comes with the order?',
    a: 'A tax invoice listing every line item with its batch number, manufacturing date and expiry date. A Certificate of Analysis can be provided on request for applicable products, and export consignments include the customs paperwork for the destination.',
  },
  {
    q: 'Is the product list on the site your live stock?',
    a: 'No — it describes the lines we supply against enquiry. Availability, the specific manufacturer and the batch are confirmed at the time of quotation, before you commit to anything.',
  },
  {
    q: 'Can you source something that is not listed?',
    a: 'Yes. Custom molecules, alternate strengths, different pack presentations and specific manufacturer preferences are all sourced on request. Send the specification and we will come back on whether we can supply it.',
  },
  {
    q: 'Do you supply narcotics or Schedule X drugs?',
    a: 'No. We do not deal in narcotic, psychotropic or Schedule X controlled substances.',
  },
  {
    q: 'Do you handle export orders?',
    a: 'We accept export enquiries. Export supply is always subject to the destination country\'s import permit, drug control approvals and registration requirements, which we confirm before quoting.',
  },
  {
    q: 'How quickly will I hear back?',
    a: `Enquiries are handled during business hours — ${company.hours}. If a requirement is urgent, call or WhatsApp on ${company.phone} rather than using the form.`,
  },
];

export const faqsData = faqs;
