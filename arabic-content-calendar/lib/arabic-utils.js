/**
 * Arabic Utilities
 * RTL support, dialect handling, transliteration
 */

// Arabic number conversion
const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toArabicNumerals(num) {
  return String(num).split('').map(d => ARABIC_NUMERALS[parseInt(d)] || d).join('');
}

function fromArabicNumerals(str) {
  return str.replace(/[٠-٩]/g, d => ARABIC_NUMERALS.indexOf(d));
}

// Dialect-specific greetings
const GREETINGS = {
  msa: { hello: 'مرحباً', goodbye: 'مع السلامة', thanks: 'شكراً' },
  gulf: { hello: 'هلا', goodbye: 'في أمان الله', thanks: 'مشكور' },
  egyptian: { hello: 'أهلاً', goodbye: 'سلام', thanks: 'متشكر' },
  levantine: { hello: 'كيفك', goodbye: 'يلا باي', thanks: 'يسلمو' }
};

// Common Arabic hashtag translations
const HASHTAG_PAIRS = {
  '#business': '#أعمال',
  '#success': '#نجاح',
  '#entrepreneur': '#ريادة_أعمال',
  '#marketing': '#تسويق',
  '#coffee': '#قهوة',
  '#food': '#طعام',
  '#dubai': '#دبي',
  '#riyadh': '#الرياض',
  '#cairo': '#القاهرة',
  '#tech': '#تقنية',
  '#startup': '#شركة_ناشئة'
};

// RTL wrapper for mixed content
function wrapRTL(text) {
  return `\u202B${text}\u202C`;
}

// Check if text is primarily Arabic
function isArabic(text) {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return arabicChars / totalChars > 0.5;
}

// Validate Arabic content quality
function validateArabicQuality(text) {
  const issues = [];
  
  // Check for common translation artifacts
  if (/\s(ال){2,}/.test(text)) issues.push('Repeated ال detected');
  if (/[a-zA-Z]{3,}/.test(text)) issues.push('Latin characters in Arabic text');
  if (text.includes('...')) issues.push('Use Arabic ellipsis (؟) instead of ...');
  
  // Check for proper punctuation
  if (text.includes('?') && !text.includes('؟')) {
    issues.push('Use Arabic question mark (؟)');
  }
  
  return { valid: issues.length === 0, issues };
}

module.exports = {
  toArabicNumerals,
  fromArabicNumerals,
  GREETINGS,
  HASHTAG_PAIRS,
  wrapRTL,
  isArabic,
  validateArabicQuality
};
