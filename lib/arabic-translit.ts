/** Arabic → Latin transliteration (readable romanization for UI copy). */

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

const CHAR_MAP: Record<string, string> = {
  '\u0621': "'", // hamza
  '\u0622': 'aa',
  '\u0623': 'a',
  '\u0624': 'u',
  '\u0625': 'i',
  '\u0626': 'y',
  '\u0627': 'a',
  '\u0628': 'b',
  '\u0629': 'a',
  '\u062A': 't',
  '\u062B': 'th',
  '\u062C': 'j',
  '\u062D': 'h',
  '\u062E': 'kh',
  '\u062F': 'd',
  '\u0630': 'dh',
  '\u0631': 'r',
  '\u0632': 'z',
  '\u0633': 's',
  '\u0634': 'sh',
  '\u0635': 's',
  '\u0636': 'd',
  '\u0637': 't',
  '\u0638': 'z',
  '\u0639': "'",
  '\u063A': 'gh',
  '\u0640': '', // tatweel
  '\u0641': 'f',
  '\u0642': 'q',
  '\u0643': 'k',
  '\u0644': 'l',
  '\u0645': 'm',
  '\u0646': 'n',
  '\u0647': 'h',
  '\u0648': 'w',
  '\u0649': 'a',
  '\u064A': 'y',
  '\u064B': '',
  '\u064C': '',
  '\u064D': '',
  '\u064E': '',
  '\u064F': '',
  '\u0650': '',
  '\u0651': '',
  '\u0652': '',
  '\u0670': '',
  '\u0671': 'a',
  '\u06CC': 'y',
  '\u06A9': 'k',
  '\u06AF': 'g',
  '\u06BE': 'h',
  '\u06C1': 'h',
  '\u06D2': 'e',
  '\uFEFB': 'la',
  '\uFEF7': 'la',
  '\uFEF9': 'la',
  '\uFEF5': 'la',
};

export function hasArabicScript(text: string): boolean {
  return ARABIC_RE.test(text);
}

export function transliterateArabic(text: string): string {
  if (!text || !hasArabicScript(text)) return text;

  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '\u0644' && next && '\u0622\u0623\u0625\u0627'.includes(next)) {
      out += 'la';
      i++;
      continue;
    }

    const mapped = CHAR_MAP[ch];
    out += mapped !== undefined ? mapped : ch;
  }

  return out
    .replace(/\s+/g, ' ')
    .replace(/'{2,}/g, "'")
    .trim();
}

export function transliterateDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return transliterateArabic(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => transliterateDeep(item)) as T;
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = transliterateDeep(val);
    }
    return result as T;
  }
  return value;
}
