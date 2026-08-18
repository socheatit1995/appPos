import { ref, computed } from 'vue'

export type LanguageCode = 'en' | 'km' | 'ko'

export interface TranslationDictionary {
  appName: string
  cashierActive: string
  cashierGuest: string
  searchPlaceholder: string
  items: string
  total: string
  subtotal: string
  vatTax: string
  grandTotal: string
  reviewAndPay: string
  pay: string
  orderItems: string
  clearAll: string
  emptyCart: string
  browseMenu: string
  checkoutTitle: string
  exitTitle: string
  exitMessage: string
  yesExit: string
  stay: string
  paymentSuccessTitle: string
  paymentFailedTitle: string
  paymentReceived: string
  orderTotal: string
  transactionId: string
  newOrder: string
  tryAgain: string
  close: string
  selectLanguage: string
  languageSubtitle: string
  categories: {
    All: string
    Coffee: string
    'Tea & Milk': string
    Bakery: string
    Snacks: string
    Beverages: string
  }
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'MCNC Coffee',
    cashierActive: 'Cashier Active',
    cashierGuest: 'CASHIER GUEST',
    searchPlaceholder: 'Search menu / code (e.g. Latte, COF-01)...',
    items: 'items',
    total: 'Total',
    subtotal: 'Subtotal',
    vatTax: 'VAT Tax (5%)',
    grandTotal: 'Grand Total',
    reviewAndPay: 'Review & Pay',
    pay: 'Pay',
    orderItems: 'Order Items',
    clearAll: 'Clear all',
    emptyCart: 'Your cart is empty. Please select products first.',
    browseMenu: 'Browse Menu',
    checkoutTitle: 'Checkout & Payment',
    exitTitle: 'Exit Mini POS',
    exitMessage: 'Are you sure you want to exit the app?',
    yesExit: 'Yes, Exit',
    stay: 'Stay',
    paymentSuccessTitle: 'Payment Successful',
    paymentFailedTitle: 'Payment Failed',
    paymentReceived: 'Payment Received!',
    orderTotal: 'Order Total',
    transactionId: 'Transaction ID',
    newOrder: 'New Order',
    tryAgain: 'Try Again',
    close: 'Close',
    selectLanguage: 'Please Select Your Language',
    languageSubtitle: 'Choose English, Khmer or Korean to use in Mini POS',
    categories: {
      All: 'All',
      Coffee: 'Coffee',
      'Tea & Milk': 'Tea & Milk',
      Bakery: 'Bakery',
      Snacks: 'Snacks',
      Beverages: 'Beverages'
    }
  },
  km: {
    appName: 'កាហ្វេ MCNC',
    cashierActive: 'គិតលុយសកម្ម',
    cashierGuest: 'បុគ្គលិកគិតលុយ',
    searchPlaceholder: 'ស្វែងរកមុខម្ហូប / លេខកូដ (ឧ. ឡាតេ, COF-01)...',
    items: 'មុខ',
    total: 'សរុប',
    subtotal: 'សរុបរង',
    vatTax: 'អាករលើតម្លៃបន្ថែម (5%)',
    grandTotal: 'ទឹកប្រាក់សរុប',
    reviewAndPay: 'ពិនិត្យ & បង់ប្រាក់',
    pay: 'បង់ប្រាក់',
    orderItems: 'មុខទំនិញដែលបានកុម្ម៉ង់',
    clearAll: 'លុបទាំងអស់',
    emptyCart: 'កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត។ សូមជ្រើសរើសទំនិញជាមុនសិន។',
    browseMenu: 'មើលបញ្ជីមុខម្ហូប',
    checkoutTitle: 'ការទូទាត់ & បង់ប្រាក់',
    exitTitle: 'ចាកចេញពី មីនី ភីអូអេស',
    exitMessage: 'តើអ្នកប្រាកដជាចង់ចាកចេញពីកម្មវិធីមែនទេ?',
    yesExit: 'បាទ/ចាស ចាកចេញ',
    stay: 'នៅបន្ត',
    paymentSuccessTitle: 'ការទូទាត់ជោគជ័យ',
    paymentFailedTitle: 'ការទូទាត់មិនជោគជ័យ',
    paymentReceived: 'ទទួលបានការទូទាត់រួចរាល់!',
    orderTotal: 'ទឹកប្រាក់សរុប',
    transactionId: 'លេខកូដប្រតិបត្តិការ',
    newOrder: 'ការកុម្ម៉ង់ថ្មី',
    tryAgain: 'ព្យាយាមម្តងទៀត',
    close: 'បិទ',
    selectLanguage: 'សូមជ្រើសរើសភាសារបស់អ្នក',
    languageSubtitle: 'ជ្រើសរើសភាសាអង់គ្លេស ខ្មែរ ឬកូរ៉េ សម្រាប់ប្រើប្រាស់ក្នុងកម្មវិធី',
    categories: {
      All: 'ទាំងអស់',
      Coffee: 'កាហ្វេ',
      'Tea & Milk': 'តែ & ទឹកដោះគោ',
      Bakery: 'នំបុ័ង & នំខេក',
      Snacks: 'អាហារសម្រន់',
      Beverages: 'ភេសជ្ជៈ'
    }
  },
  ko: {
    appName: 'MCNC 커피',
    cashierActive: '캐셔 활성화',
    cashierGuest: '게스트 캐셔',
    searchPlaceholder: '메뉴 / 코드 검색 (예: 라떼, COF-01)...',
    items: '개',
    total: '합계',
    subtotal: '소계',
    vatTax: '부가세 (5%)',
    grandTotal: '총 결제금액',
    reviewAndPay: '주문 확인 및 결제',
    pay: '결제하기',
    orderItems: '주문 내역',
    clearAll: '전체 삭제',
    emptyCart: '장바구니가 비어 있습니다. 메뉴를 먼저 선택해 주세요.',
    browseMenu: '메뉴 둘러보기',
    checkoutTitle: '주문 결제',
    exitTitle: '미니 POS 종료',
    exitMessage: '정말로 앱을 종료하시겠습니까?',
    yesExit: '종료하기',
    stay: '머무르기',
    paymentSuccessTitle: '결제 완료',
    paymentFailedTitle: '결제 실패',
    paymentReceived: '결제가 완료되었습니다!',
    orderTotal: '주문 금액',
    transactionId: '거래 번호',
    newOrder: '새 주문',
    tryAgain: '다시 시도',
    close: '닫기',
    selectLanguage: '언어를 선택해 주세요',
    languageSubtitle: '미니 POS에서 사용할 언어(영어, 한국어, 크메르어)를 선택하세요',
    categories: {
      All: '전체',
      Coffee: '커피',
      'Tea & Milk': '티 & 밀크',
      Bakery: '베이커리',
      Snacks: '스낵 & 디저트',
      Beverages: '음료'
    }
  }
}

// Current language state stored in memory and localStorage
const savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('pos_lang') as LanguageCode) || 'en'
const currentLanguage = ref<LanguageCode>(savedLang === 'km' || savedLang === 'ko' ? savedLang : 'en')

export const useI18n = () => {
  const t = computed(() => translations[currentLanguage.value])

  const setLanguage = (lang: LanguageCode) => {
    currentLanguage.value = lang
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pos_lang', lang)
    }
  }

  const currentLangCode = computed(() => currentLanguage.value)

  return {
    t,
    currentLanguage: currentLangCode,
    setLanguage
  }
}
