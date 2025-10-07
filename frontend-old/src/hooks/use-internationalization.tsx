"use client"

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

export type SupportedLanguage = 'en' | 'ur' | 'ar' | 'hi' | 'es' | 'fr' | 'de' | 'zh'

export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  rtl: boolean
  flag: string
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true, flag: '🇵🇰' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' }
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary
}

export interface I18nContextType {
  currentLanguage: SupportedLanguage
  direction: 'ltr' | 'rtl'
  isRTL: boolean
  setLanguage: (language: SupportedLanguage) => void
  t: (key: string, params?: Record<string, any>) => string
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  formatCurrency: (amount: number, currency?: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

// Translation dictionaries
const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.websites': 'Websites',
    'nav.templates': 'Templates',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.help': 'Help',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',

    // Dashboard
    'dashboard.welcome': 'Welcome to Pakistan Website Builder',
    'dashboard.subtitle': 'Create stunning websites with our AI-powered tools',
    'dashboard.create_website': 'Create Website',
    'dashboard.recent_websites': 'Recent Websites',
    'dashboard.quick_actions': 'Quick Actions',

    // Editor
    'editor.preview': 'Preview',
    'editor.publish': 'Publish',
    'editor.undo': 'Undo',
    'editor.redo': 'Redo',
    'editor.components': 'Components',
    'editor.settings': 'Settings',
    'editor.styles': 'Styles',

    // Forms
    'form.required': 'This field is required',
    'form.email': 'Please enter a valid email',
    'form.min_length': 'Minimum {{count}} characters required',
    'form.max_length': 'Maximum {{count}} characters allowed',

    // Accessibility
    'a11y.skip_links': 'Skip links',
    'a11y.skip_to_main': 'Skip to main content',
    'a11y.skip_to_nav': 'Skip to navigation',
    'a11y.skip_to_search': 'Skip to search',
    'a11y.close': 'Close',
    'a11y.loading': 'Loading',
    'a11y.error': 'Error occurred'
  },
  ur: {
    // Navigation
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.websites': 'ویب سائٹس',
    'nav.templates': 'ٹیمپلیٹس',
    'nav.analytics': 'تجزیات',
    'nav.settings': 'ترتیبات',
    'nav.help': 'مدد',

    // Common
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ کریں',
    'common.delete': 'حذف کریں',
    'common.edit': 'ترمیم کریں',
    'common.create': 'بنائیں',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'خرابی',
    'common.success': 'کامیابی',

    // Dashboard
    'dashboard.welcome': 'پاکستان ویب سائٹ بلڈر میں خوش آمدید',
    'dashboard.subtitle': 'ہماری AI پاورڈ ٹولز کے ساتھ شاندار ویب سائٹس بنائیں',
    'dashboard.create_website': 'ویب سائٹ بنائیں',
    'dashboard.recent_websites': 'حالیہ ویب سائٹس',
    'dashboard.quick_actions': 'فوری اقدامات',

    // Editor
    'editor.preview': 'پیش نظارہ',
    'editor.publish': 'شائع کریں',
    'editor.undo': 'واپس',
    'editor.redo': 'دوبارہ',
    'editor.components': 'اجزاء',
    'editor.settings': 'ترتیبات',
    'editor.styles': 'طرزیں',

    // Forms
    'form.required': 'یہ فیلڈ ضروری ہے',
    'form.email': 'براہ کرم درست ای میل درج کریں',
    'form.min_length': 'کم از کم {{count}} حروف درکار ہیں',
    'form.max_length': 'زیادہ سے زیادہ {{count}} حروف کی اجازت ہے',

    // Accessibility
    'a11y.skip_links': 'جست لنکس',
    'a11y.skip_to_main': 'مرکزی مواد پر جائیں',
    'a11y.skip_to_nav': 'نیویگیشن پر جائیں',
    'a11y.skip_to_search': 'تلاش پر جائیں',
    'a11y.close': 'بند کریں',
    'a11y.loading': 'لوڈ ہو رہا ہے',
    'a11y.error': 'خرابی پیش آگئی'
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.websites': 'المواقع',
    'nav.templates': 'القوالب',
    'nav.analytics': 'التحليلات',
    'nav.settings': 'الإعدادات',
    'nav.help': 'المساعدة',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.create': 'إنشاء',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',

    // Dashboard
    'dashboard.welcome': 'مرحباً بك في باني مواقع باكستان',
    'dashboard.subtitle': 'أنشئ مواقع رائعة بأدواتنا المدعومة بالذكاء الاصطناعي',
    'dashboard.create_website': 'إنشاء موقع',
    'dashboard.recent_websites': 'المواقع الأخيرة',
    'dashboard.quick_actions': 'الإجراءات السريعة',

    // Editor
    'editor.preview': 'معاينة',
    'editor.publish': 'نشر',
    'editor.undo': 'تراجع',
    'editor.redo': 'إعادة',
    'editor.components': 'المكونات',
    'editor.settings': 'الإعدادات',
    'editor.styles': 'الأنماط',

    // Forms
    'form.required': 'هذا الحقل مطلوب',
    'form.email': 'يرجى إدخال بريد إلكتروني صحيح',
    'form.min_length': 'مطلوب {{count}} أحرف كحد أدنى',
    'form.max_length': 'مسموح بـ {{count}} حرف كحد أقصى',

    // Accessibility
    'a11y.skip_links': 'روابط التخطي',
    'a11y.skip_to_main': 'تخطي إلى المحتوى الرئيسي',
    'a11y.skip_to_nav': 'تخطي إلى التنقل',
    'a11y.skip_to_search': 'تخطي إلى البحث',
    'a11y.close': 'إغلاق',
    'a11y.loading': 'جاري التحميل',
    'a11y.error': 'حدث خطأ'
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.websites': 'वेबसाइटें',
    'nav.templates': 'टेम्प्लेट',
    'nav.analytics': 'एनालिटिक्स',
    'nav.settings': 'सेटिंग्स',
    'nav.help': 'मदद',

    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'कैंसल करें',
    'common.delete': 'डिलीट करें',
    'common.edit': 'एडिट करें',
    'common.create': 'बनाएं',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एरर',
    'common.success': 'सक्सेस',

    // Dashboard
    'dashboard.welcome': 'पाकिस्तान वेबसाइट बिल्डर में आपका स्वागत है',
    'dashboard.subtitle': 'हमारी AI-पावर्ड टूल्स के साथ शानदार वेबसाइटें बनाएं',
    'dashboard.create_website': 'वेबसाइट बनाएं',
    'dashboard.recent_websites': 'हाल की वेबसाइटें',
    'dashboard.quick_actions': 'क्विक एक्शंस',

    // Editor
    'editor.preview': 'प्रिव्यू',
    'editor.publish': 'पब्लिश करें',
    'editor.undo': 'अन्डू',
    'editor.redo': 'रीडू',
    'editor.components': 'कॉम्पोनेंट्स',
    'editor.settings': 'सेटिंग्स',
    'editor.styles': 'स्टाइल्स',

    // Forms
    'form.required': 'यह फ़ील्ड आवश्यक है',
    'form.email': 'कृपया वैध ईमेल दर्ज करें',
    'form.min_length': 'न्यूनतम {{count}} वर्ण आवश्यक हैं',
    'form.max_length': 'अधिकतम {{count}} वर्ण अनुमत हैं',

    // Accessibility
    'a11y.skip_to_main': 'मुख्य सामग्री पर जाएं',
    'a11y.skip_to_nav': 'नेविगेशन पर जाएं',
    'a11y.skip_to_search': 'खोज पर जाएं',
    'a11y.close': 'बंद करें',
    'a11y.loading': 'लोड हो रहा है',
    'a11y.error': 'त्रुटि हुई'
  },
  es: {
    'nav.dashboard': 'Panel',
    'nav.websites': 'Sitios Web',
    'nav.templates': 'Plantillas',
    'nav.analytics': 'Análisis',
    'nav.settings': 'Configuración',
    'nav.help': 'Ayuda',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'dashboard.welcome': 'Bienvenido al Constructor de Sitios Web de Pakistán',
    'dashboard.subtitle': 'Crea sitios web impresionantes con nuestras herramientas impulsadas por IA',
    'dashboard.create_website': 'Crear Sitio Web',
    'dashboard.recent_websites': 'Sitios Web Recientes',
    'dashboard.quick_actions': 'Acciones Rápidas',
    'editor.preview': 'Vista Previa',
    'editor.publish': 'Publicar',
    'editor.undo': 'Deshacer',
    'editor.redo': 'Rehacer',
    'editor.components': 'Componentes',
    'editor.settings': 'Configuración',
    'editor.styles': 'Estilos',
    'form.required': 'Este campo es obligatorio',
    'form.email': 'Por favor ingresa un email válido',
    'form.min_length': 'Se requieren mínimo {{count}} caracteres',
    'form.max_length': 'Se permiten máximo {{count}} caracteres',
    'a11y.skip_to_main': 'Saltar al contenido principal',
    'a11y.skip_to_nav': 'Saltar a la navegación',
    'a11y.skip_to_search': 'Saltar a la búsqueda',
    'a11y.close': 'Cerrar',
    'a11y.loading': 'Cargando',
    'a11y.error': 'Error ocurrido'
  },
  fr: {
    'nav.dashboard': 'Tableau de Bord',
    'nav.websites': 'Sites Web',
    'nav.templates': 'Modèles',
    'nav.analytics': 'Analyses',
    'nav.settings': 'Paramètres',
    'nav.help': 'Aide',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'dashboard.welcome': 'Bienvenue sur Pakistan Website Builder',
    'dashboard.subtitle': 'Créez des sites web exceptionnels avec nos outils alimentés par IA',
    'dashboard.create_website': 'Créer un Site Web',
    'dashboard.recent_websites': 'Sites Web Récents',
    'dashboard.quick_actions': 'Actions Rapides',
    'editor.preview': 'Aperçu',
    'editor.publish': 'Publier',
    'editor.undo': 'Annuler',
    'editor.redo': 'Rétablir',
    'editor.components': 'Composants',
    'editor.settings': 'Paramètres',
    'editor.styles': 'Styles',
    'form.required': 'Ce champ est obligatoire',
    'form.email': 'Veuillez saisir un email valide',
    'form.min_length': '{{count}} caractères minimum requis',
    'form.max_length': '{{count}} caractères maximum autorisés',
    'a11y.skip_to_main': 'Aller au contenu principal',
    'a11y.skip_to_nav': 'Aller à la navigation',
    'a11y.skip_to_search': 'Aller à la recherche',
    'a11y.close': 'Fermer',
    'a11y.loading': 'Chargement',
    'a11y.error': 'Erreur survenue'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.websites': 'Webseiten',
    'nav.templates': 'Vorlagen',
    'nav.analytics': 'Analytik',
    'nav.settings': 'Einstellungen',
    'nav.help': 'Hilfe',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.create': 'Erstellen',
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'dashboard.welcome': 'Willkommen bei Pakistan Website Builder',
    'dashboard.subtitle': 'Erstellen Sie atemberaubende Websites mit unseren KI-gestützten Tools',
    'dashboard.create_website': 'Website Erstellen',
    'dashboard.recent_websites': 'Kürzliche Websites',
    'dashboard.quick_actions': 'Schnellaktionen',
    'editor.preview': 'Vorschau',
    'editor.publish': 'Veröffentlichen',
    'editor.undo': 'Rückgängig',
    'editor.redo': 'Wiederholen',
    'editor.components': 'Komponenten',
    'editor.settings': 'Einstellungen',
    'editor.styles': 'Stile',
    'form.required': 'Dieses Feld ist erforderlich',
    'form.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'form.min_length': 'Mindestens {{count}} Zeichen erforderlich',
    'form.max_length': 'Maximal {{count}} Zeichen erlaubt',
    'a11y.skip_to_main': 'Zum Hauptinhalt springen',
    'a11y.skip_to_nav': 'Zur Navigation springen',
    'a11y.skip_to_search': 'Zur Suche springen',
    'a11y.close': 'Schließen',
    'a11y.loading': 'Lädt',
    'a11y.error': 'Fehler aufgetreten'
  },
  zh: {
    'nav.dashboard': '仪表板',
    'nav.websites': '网站',
    'nav.templates': '模板',
    'nav.analytics': '分析',
    'nav.settings': '设置',
    'nav.help': '帮助',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.create': '创建',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'dashboard.welcome': '欢迎使用巴基斯坦网站构建器',
    'dashboard.subtitle': '使用我们的人工智能工具创建令人惊叹的网站',
    'dashboard.create_website': '创建网站',
    'dashboard.recent_websites': '最近的网站',
    'dashboard.quick_actions': '快速操作',
    'editor.preview': '预览',
    'editor.publish': '发布',
    'editor.undo': '撤销',
    'editor.redo': '重做',
    'editor.components': '组件',
    'editor.settings': '设置',
    'editor.styles': '样式',
    'form.required': '此字段为必填项',
    'form.email': '请输入有效的电子邮件',
    'form.min_length': '至少需要 {{count}} 个字符',
    'form.max_length': '最多允许 {{count}} 个字符',
    'a11y.skip_to_main': '跳转到主要内容',
    'a11y.skip_to_nav': '跳转到导航',
    'a11y.skip_to_search': '跳转到搜索',
    'a11y.close': '关闭',
    'a11y.loading': '加载中',
    'a11y.error': '发生错误'
  }
}

export function useInternationalization(defaultLanguage: SupportedLanguage = 'en') {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(defaultLanguage)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')

  // Detect user language on mount
  useEffect(() => {
    const detectLanguage = (): SupportedLanguage => {
      // Check localStorage first
      const saved = localStorage.getItem('website-builder-language') as SupportedLanguage
      if (saved && SUPPORTED_LANGUAGES[saved]) {
        return saved
      }

      // Detect from browser
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage
      if (SUPPORTED_LANGUAGES[browserLang]) {
        return browserLang
      }

      // Default fallback
      return defaultLanguage
    }

    const detectedLanguage = detectLanguage()
    setCurrentLanguage(detectedLanguage)
  }, [defaultLanguage])

  // Update direction when language changes
  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES[currentLanguage]
    const newDirection = langInfo.rtl ? 'rtl' : 'ltr'
    setDirection(newDirection)

    // Update document direction
    document.documentElement.dir = newDirection
    document.documentElement.lang = currentLanguage

    // Save to localStorage
    localStorage.setItem('website-builder-language', currentLanguage)
  }, [currentLanguage])

  const setLanguage = useCallback((language: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES[language]) {
      setCurrentLanguage(language)
    }
  }, [])

  // Translation function
  const t = useCallback((key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let translation: any = translations[currentLanguage]

    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k]
      } else {
        translation = undefined
        break
      }
    }

    if (typeof translation !== 'string') {
      // Fallback to English
      translation = translations.en
      for (const k of keys) {
        if (translation && typeof translation === 'object') {
          translation = translation[k]
        } else {
          translation = undefined
          break
        }
      }

      // If still not found, return the key
      if (typeof translation !== 'string') {
        return key
      }
    }

    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), params[param])
      })
    }

    return translation
  }, [currentLanguage])

  // Number formatting
  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLanguage, options).format(num)
  }, [currentLanguage])

  // Date formatting
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(currentLanguage, options).format(date)
  }, [currentLanguage])

  // Currency formatting
  const formatCurrency = useCallback((amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency
    }).format(amount)
  }, [currentLanguage])

  const isRTL = direction === 'rtl'

  return {
    currentLanguage,
    direction,
    isRTL,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    formatCurrency,
    supportedLanguages: SUPPORTED_LANGUAGES
  }
}

// Provider component
export function I18nProvider({ children, defaultLanguage = 'en' }: { children: React.ReactNode, defaultLanguage?: SupportedLanguage }) {
  const i18n = useInternationalization(defaultLanguage)
  
  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use i18n context
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
