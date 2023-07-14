// Antd (ant-design-vue) locale is defined in JS file,
// to make it friendly to TS, we re-export it here.
import zh_CN from 'ant-design-vue/lib/locale/zh_CN';
import en_US from 'ant-design-vue/lib/locale/en_US';
import ja_JP from 'ant-design-vue/lib/locale/ja_JP';

// rename and export
let AntdLocale = {
  en: en_US,
  zh: zh_CN,
  ja: ja_JP,
}

export { AntdLocale };
