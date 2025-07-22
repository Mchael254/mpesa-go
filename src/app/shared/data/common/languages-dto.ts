export interface LanguagesDto {
  code: string;
  class: string;
  lang: string;
}

export const LANGUAGES: LanguagesDto[] = [
  { code: 'de', class: 'fi fi-de fis', lang: 'German' },
  { code: 'ke', class: 'fi fi-ke fis', lang: 'Swahili' },
  { code: 'en', class: 'fi fi-gb fis', lang: 'English' },
  { code: 'fr', class: 'fi fi-fr fis', lang: 'French' },
  { code: 'cn', class: 'fi fi-cn fis', lang: 'Mandarin' },
  { code: 'es', class: 'fi fi-es fis', lang: 'Espanyol' },
];
