// Single source of truth for company facts shown across the site.
//
// IMPORTANT: the fields under "TO BE FILLED IN" are deliberately left blank.
// The site hides any of them that are empty, so nothing false is ever shown.
// Fill them in with the real values before going live.

export const company = {
  name: 'Firmitas 1',
  legalName: 'Firmitas 1 Pharma Solutions',
  tagline: 'Global Reach. Trusted Care.',

  phone: '+91 82002 28607',
  phoneHref: 'tel:+918200228607',
  whatsapp: '918200228607',
  email: 'sales@firmitas1.com',
  website: 'www.firmitas1.com',
  websiteHref: 'https://www.firmitas1.com',

  addressLines: ['Firmitas 1 Pharma Solutions,', 'Gujarat, India.'],
  hours: 'Monday to Saturday, 09:00 – 18:00 IST',
  hoursShort: 'IST 09:00 - 18:00',

  // ---- TO BE FILLED IN -------------------------------------------------
  // Each of these is hidden on the site while it is an empty string.
  drugLicenceNo: '',   // e.g. 'GJ/AHM/20B-XXXXX, 21B-XXXXX'
  gstin: '',           // e.g. '24XXXXXXXXXXXZX'
  foundedYear: '',     // e.g. '2025'
  fullAddress: '',     // full street address once the premises are registered
  // ----------------------------------------------------------------------
};

// Registration details, filtered down to whatever has actually been filled in.
export const registrationDetails = [
  { label: 'Drug Licence No.', value: company.drugLicenceNo },
  { label: 'GSTIN', value: company.gstin },
  { label: 'Established', value: company.foundedYear },
].filter((detail) => detail.value);
