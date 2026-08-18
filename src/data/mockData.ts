export interface Product {
  id: string
  name: {
    en: string
    km: string
    ko: string
  }
  category: 'Coffee' | 'Tea & Milk' | 'Bakery' | 'Snacks' | 'Beverages'
  price: number
  imageUrl: string
  code: string
  description?: {
    en: string
    km: string
    ko: string
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export const categories = ['All', 'Coffee', 'Tea & Milk', 'Bakery', 'Snacks', 'Beverages'] as const

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: {
      en: 'Iced Caramel Macchiato',
      km: 'ការ៉ាមែល ម៉ាគីយ៉ាតូ ទឹកកក',
      ko: '아이스 카라멜 마끼아또'
    },
    category: 'Coffee',
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
    code: 'COF-01',
    description: {
      en: 'Fresh espresso combined with vanilla syrup, steamed milk and caramel drizzle.',
      km: 'អេសប្រេសូស្រស់ ជាមួយទឹកស៊ីរ៉ូវ៉ានីឡា ទឹកដោះគោក្ដៅ និងទឹកការ៉ាមែលផ្អែមឈ្ងុយ។',
      ko: '신선한 에스프레소에 바닐라 시럽, 우유, 카라멜 드리즐을 더한 커피.'
    }
  },
  {
    id: 'p2',
    name: {
      en: 'Signature Cold Brew',
      km: 'កូដប៊្រូ ប្រចាំហាង',
      ko: '시그니처 콜드브루'
    },
    category: 'Coffee',
    price: 3.25,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    code: 'COF-02',
    description: {
      en: 'Slow-steeped for 20 hours with deep chocolate and roasted notes.',
      km: 'ត្រាំរយៈពេល ២០ ម៉ោងដើម្បីទទួលបានរសជាតិសូកូឡាដិត និងក្លិនឈ្ងុយ។',
      ko: '20시간 동안 천천히 추출하여 깊은 초콜릿 풍미를 살린 콜드브루.'
    }
  },
  {
    id: 'p3',
    name: {
      en: 'Matcha Green Tea Latte',
      km: 'ម៉ាត់ឆា តែបៃតងឡាតេ',
      ko: '말차 그린티 라떼'
    },
    category: 'Tea & Milk',
    price: 3.75,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    code: 'TEA-01',
    description: {
      en: 'Premium Uji green matcha blended with smooth fresh milk.',
      km: 'ម្សៅតែបៃតងម៉ាត់ឆាលំដាប់ពិសេស ផ្សំជាមួយទឹកដោះគោស្រស់។',
      ko: '최고급 우지 말차 가루와 부드러운 우유의 조화로운 라떼.'
    }
  },
  {
    id: 'p4',
    name: {
      en: 'Brown Sugar Pearl Milk',
      km: 'តែគុជ ស្ករត្នោតស្រស់',
      ko: '흑당 버블 밀크티'
    },
    category: 'Tea & Milk',
    price: 3.90,
    imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cf05d8a58?auto=format&fit=crop&w=400&q=80',
    code: 'TEA-02',
    description: {
      en: 'Rich brown sugar tiger boba infused in fresh creamy milk.',
      km: 'គុជស្ករត្នោតទន់ល្មើយ ក្នុងទឹកដោះគោស្រស់រសជាតិផ្អែមឈ្ងុយឆ្ងាញ់។',
      ko: '진한 흑당 시럽에 쫄깃한 타피오카 펄과 신선한 생우유.'
    }
  },
  {
    id: 'p5',
    name: {
      en: 'Almond Croissant',
      km: 'នំក្រូសង់ គ្រាប់អាល់ម៉ុន',
      ko: '아몬드 크루아상'
    },
    category: 'Bakery',
    price: 2.80,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    code: 'BAK-01',
    description: {
      en: 'Flaky French butter pastry filled with sweet almond frangipane.',
      km: 'នំក្រូសង់ប័រស្រួយបែបបារាំង ស្នូលគ្រាប់អាល់ម៉ុនផ្អែមឈ្ងុយ។',
      ko: '바삭한 프랑스산 버터 패스트리에 달콤한 아몬드 크림을 듬뿍 넣은 빵.'
    }
  },
  {
    id: 'p6',
    name: {
      en: 'Blueberry Cream Muffin',
      km: 'នំម៉ាហ្វ៊ីន ប្លូបឺរី ក្រែម',
      ko: '블루베리 크림 머핀'
    },
    category: 'Bakery',
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=400&q=80',
    code: 'BAK-02',
    description: {
      en: 'Fresh organic blueberries baked into tender sponge muffin.',
      km: 'ផ្លែប្លូបឺរីធម្មជាតិ ដុតក្នុងសាច់នំម៉ាហ្វ៊ីនទន់ល្មើយ។',
      ko: '상큼한 유기농 블루베리가 가득 들어간 부드러운 머핀.'
    }
  },
  {
    id: 'p7',
    name: {
      en: 'Avocado Toast & Egg',
      km: 'នំប៉័ងដុត ផ្លែប័រ & ស៊ុត',
      ko: '아보카도 에그 토스트'
    },
    category: 'Snacks',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
    code: 'SNK-01',
    description: {
      en: 'Toasted sourdough with seasoned smashed avocado and poached egg.',
      km: 'នំប៉័ងដុត ជាមួយផ្លែប័រកិនឈ្ងុយឆ្ងាញ់ និងពងមាន់ចំហុយ។',
      ko: '바삭한 사워도우 토스트 위에 으깬 아보카도와 수란을 얹은 건강식.'
    }
  },
  {
    id: 'p8',
    name: {
      en: 'Passion Fruit Sparkling',
      km: 'ផាសិន ស្ប៉ាកក្លីង សូដា',
      ko: '패션후르츠 스파클링 에이드'
    },
    category: 'Beverages',
    price: 2.95,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    code: 'BEV-01',
    description: {
      en: 'Refreshing sparkling soda with natural fresh passion fruit pulp.',
      km: 'សូដាផ្អែមត្រជាក់ស្រស់ស្រាយ ជាមួយផ្លែផាសិនស្រស់ពីធម្មជាតិ។',
      ko: '생생한 생 패션후르츠 과육과 톡 쏘는 탄산수의 만남.'
    }
  }
]
