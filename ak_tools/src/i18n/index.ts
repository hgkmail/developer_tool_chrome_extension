import { createI18n } from 'vue-i18n'
import enUS from '@/locales/en-US'
import zhCN from '@/locales/zh-CN'

const i18n = createI18n({
  locale: 'zhCN',
  fallbackLocale: 'enUS',
  messages: {
    // 美国英语
    enUS,
    // 简体中文
    zhCN,
  },
})

export default i18n
