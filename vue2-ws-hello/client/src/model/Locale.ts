import { AntdLocale } from '@/util/AntdLocaleFix';

/**
 * code for locale varies for libraries,
 * here is the code we use.
 */
export enum LocaleCode {

  /**
   * English
   */
  en = 'en',

  /**
   * Chinese
   */
  zh = 'zh',

  /**
   * Japanese
   */
  ja = 'ja',

}

/**
 * for the provided locale code, return the 
 * corresponding Antd(ant-design-vue) locale object.
 * @returns (if no matching found, return en as fallback)
 */
export function getAntdLocale(locale: LocaleCode): any {
  switch (locale) {
    case LocaleCode.en:
      return AntdLocale.en;
      break;
    case LocaleCode.zh:
      return AntdLocale.zh;
      break;
    case LocaleCode.ja:
      return AntdLocale.ja;
      break;
  }

  return AntdLocale.en;
}

/**
 * for the provided locale code, return the locale name 
 * used by moment. (suitable for calling moment.locale())
 * @returns (if no matching found, return en as fallback)
 */
export function getMomentLocaleName(locale: LocaleCode): string {
  switch (locale) {
    case LocaleCode.en:
      return 'en';
      break;
    case LocaleCode.zh:
      return 'zh-cn';
      break;
    case LocaleCode.ja:
      return 'ja';
      break;
  }

  return 'en';
}
