<template>
  <div class="pos-home-view">
    <!-- Top Greeting Area with Language Selector -->
    <div class="greeting-area">
      <div class="top-row-header">
        <div class="user-greeting">
          <div class="cashier-avatar">☕</div>
          <div class="chat-bubbles">
            <div class="bubble small">{{ t.appName }}</div>
            <div class="bubble large">{{ userName }}</div>
            <div class="bubble small" v-if="userPhone">{{ userPhone }}</div>
          </div>
        </div>

        <!-- Language Selector Button -->
        <button class="lang-switch-btn" @click="showLangSheet = true" aria-label="Change Language">
          <span class="flag-icon">{{ currentLangFlag }}</span>
          <span class="lang-text">{{ currentLangLabel }}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      
      <!-- Search Input -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input v-model="searchQuery" :placeholder="t.searchPlaceholder" />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="category-scroll">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="category-chip"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        {{ t.categories[cat] || cat }}
      </button>
    </div>

    <!-- Products Grid Area -->
    <div class="products-container">
      <div class="products-grid" v-if="filteredProducts.length > 0">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card"
          @click="addToCart(product)"
        >
          <div class="img-wrapper">
            <img :src="product.imageUrl" :alt="getProductName(product)" loading="lazy" />
            <span class="product-code">{{ product.code }}</span>
            <span v-if="getItemQuantity(product.id) > 0" class="qty-badge">
              {{ getItemQuantity(product.id) }}
            </span>
          </div>
          <div class="product-info">
            <h4 class="product-title">{{ getProductName(product) }}</h4>
            <div class="product-bottom">
              <span class="product-price">${{ product.price.toFixed(2) }}</span>
              <button class="add-btn" @click.stop="addToCart(product)">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Result State -->
      <div v-else class="no-result">
        <div class="no-result-icon">🔍</div>
        <p>No products found for "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- Sticky Cart Summary Bar at Bottom -->
    <div class="bottom-checkout-bar" v-if="totalCount > 0">
      <div class="cart-info">
        <div class="items-count-badge">
          <span>{{ totalCount }} {{ t.items }}</span>
        </div>
        <div class="total-price-text">
          <span class="label">{{ t.total }}:</span>
          <span class="val">${{ grandTotal.toFixed(2) }}</span>
        </div>
      </div>
      <button class="checkout-btn" @click="$router.push('/checkout')">
        <span>{{ t.reviewAndPay }}</span>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>

    <!-- 3-Language Selector Bottom Sheet (English / Khmer / Korean) -->
    <PPBottomSheet v-model="showLangSheet">
      <div class="pos-lang-sheet">
        <div class="pos-lang-header">
          <h3 class="pos-lang-title">{{ t.selectLanguage }}</h3>
          <p class="pos-lang-subtitle">{{ t.languageSubtitle }}</p>
        </div>

        <div class="pos-lang-list">
          <div 
            v-for="lang in supportedLanguages" 
            :key="lang.code"
            class="pos-lang-item"
            :class="{ 'is-active': currentLanguage === lang.code }"
            @click="onLanguageChange(lang.code)"
          >
            <div class="pos-lang-left">
              <span class="pos-lang-flag">{{ lang.flag }}</span>
              <div class="pos-lang-name-wrap">
                <span class="pos-lang-name">{{ lang.name }}</span>
                <span class="pos-lang-subname">{{ lang.subname }}</span>
              </div>
            </div>
            <div class="pos-lang-radio">
              <div class="radio-dot" v-if="currentLanguage === lang.code"></div>
            </div>
          </div>
        </div>
      </div>
    </PPBottomSheet>

    <!-- UI-Framework Confirmation Dialog for Exit App -->
    <PPConfirm
      v-model="showExitConfirm"
      :title="t.exitTitle"
      :message="t.exitMessage"
      :confirmText="t.yesExit"
      :cancelText="t.stay"
      confirmVariant="primary"
      @confirm="confirmExit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PPConfirm, PPBottomSheet } from '@phanna/ui-framework'
import { categories, mockProducts } from '../data/mockData'
import type { Product } from '../data/mockData'
import { usePosStore } from '../store/usePosStore'
import { useI18n } from '../i18n'
import type { LanguageCode } from '../i18n'
import '@/lib/mini.app.lib.js'

const MiniApp = (window as any).MiniApp
const { totalCount, grandTotal, addToCart, getItemQuantity } = usePosStore()
const { t, currentLanguage, setLanguage } = useI18n()

const userName = ref(t.value.cashierGuest)
const userPhone = ref('')
const selectedCategory = ref<'All' | typeof categories[number]>('All')
const searchQuery = ref('')
const showExitConfirm = ref(false)
const showLangSheet = ref(false)

const supportedLanguages: { code: LanguageCode; name: string; subname: string; flag: string }[] = [
  { code: 'km', name: 'ភាសាខ្មែរ', subname: 'Khmer', flag: '🇰🇭' },
  { code: 'en', name: 'English', subname: 'United Kingdom / US', flag: '🇬🇧' },
  { code: 'ko', name: '한국어', subname: 'Korean', flag: '🇰🇷' }
]

const currentLangFlag = computed(() => {
  if (currentLanguage.value === 'km') return '🇰🇭'
  if (currentLanguage.value === 'ko') return '🇰🇷'
  return '🇬🇧'
})

const currentLangLabel = computed(() => {
  if (currentLanguage.value === 'km') return 'ខ្មែរ'
  if (currentLanguage.value === 'ko') return '한국어'
  return 'EN'
})

const onLanguageChange = (code: string) => {
  if (code === 'km' || code === 'ko' || code === 'en') {
    setLanguage(code as LanguageCode)
  }
}

const getProductName = (product: Product) => {
  const lang = currentLanguage.value
  return product.name[lang] || product.name.en
}

const confirmExit = () => {
  MiniApp.exit(false)
}

const filteredProducts = computed(() => {
  let list = mockProducts
  if (selectedCategory.value !== 'All') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p => {
      const nameEn = p.name.en.toLowerCase()
      const nameKm = p.name.km.toLowerCase()
      const nameKo = p.name.ko.toLowerCase()
      const code = p.code.toLowerCase()
      return nameEn.includes(q) || nameKm.includes(q) || nameKo.includes(q) || code.includes(q)
    })
  }
  return list
})

onMounted(async () => {
  try {
    const profile = await MiniApp.getUserProfile({ appKey: 'MINI_POS_APP_KEY' })
    if (profile && profile.name) {
      userName.value = profile.name.toUpperCase()
    }
    if (profile && profile.phoneNumber) {
      userPhone.value = profile.phoneNumber
    }
  } catch (err) {
    console.error('Failed to get user profile:', err)
  }
})
</script>

<style scoped>
.pos-home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--pos-bg);
  overflow: hidden;
  position: relative;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.greeting-area {
  background: linear-gradient(180deg, var(--pos-primary) 0%, #ff8c38 100%);
  padding: 1rem 1.25rem 1.25rem;
  color: white;
}

.top-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-switch-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  border-radius: 20px;
  padding: 0.35rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.lang-switch-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.96);
}

.flag-icon {
  font-size: 1rem;
  line-height: 1;
}

.lang-text {
  letter-spacing: 0.3px;
}

.cashier-avatar {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.chat-bubbles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bubble {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.bubble.small {
  font-size: 0.75rem;
  color: #b45309;
  align-self: flex-start;
}

.bubble.large {
  font-size: 0.95rem;
  color: #9a3412;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.search-icon {
  color: #94a3b8;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: var(--text-main);
}

.clear-search-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
}

.category-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  scrollbar-width: none;
}
.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  background: #f1f5f9;
  border: 1px solid transparent;
  color: #64748b;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.category-chip.active {
  background: var(--pos-primary-light);
  color: var(--pos-primary);
  border-color: var(--pos-primary);
  font-weight: 600;
}

.products-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 90px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.product-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:active {
  transform: scale(0.98);
}

.img-wrapper {
  position: relative;
  width: 100%;
  height: 120px;
  background: #f8fafc;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-code {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
}

.qty-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--pos-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.product-info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.product-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--pos-primary);
}

.add-btn {
  background: var(--pos-primary-light);
  border: none;
  color: var(--pos-primary);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn:active {
  background: var(--pos-primary);
  color: white;
}

.no-result {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
}

.no-result-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.bottom-checkout-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  border-top: 1px solid #f1f5f9;
  z-index: 20;
}

.cart-info {
  display: flex;
  flex-direction: column;
}

.items-count-badge {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.total-price-text {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.total-price-text .label {
  font-size: 0.8rem;
  color: #64748b;
}

.total-price-text .val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pos-primary);
}

.checkout-btn {
  background: var(--pos-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
  transition: background-color 0.2s ease;
}

.checkout-btn:active {
  background: var(--pos-primary-dark);
}

:deep(.pp-confirm-content .pp-button--primary) {
  background-color: var(--pos-primary) !important;
  color: white !important;
}

:deep(.pp-confirm-content .pp-button--primary:hover) {
  background-color: var(--pos-primary-dark) !important;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3) !important;
}

:deep(.pp-confirm-content .pp-button--outline) {
  color: var(--pos-primary) !important;
  border-color: #ffd0b0 !important;
}

:deep(.pp-confirm-content .pp-button--outline:hover) {
  background-color: var(--pos-primary-light) !important;
  border-color: var(--pos-primary) !important;
}

/* Custom 3-Language Sheet Styling */
.pos-lang-sheet {
  padding: 0.5rem 1.25rem 1.5rem;
}

.pos-lang-header {
  margin-bottom: 1.25rem;
}

.pos-lang-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--pos-primary);
  margin: 0 0 0.35rem 0;
}

.pos-lang-subtitle {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.pos-lang-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pos-lang-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pos-lang-item.is-active {
  border-color: var(--pos-primary);
  background: var(--pos-primary-light);
}

.pos-lang-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.pos-lang-flag {
  font-size: 1.5rem;
}

.pos-lang-name-wrap {
  display: flex;
  flex-direction: column;
}

.pos-lang-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.pos-lang-subname {
  font-size: 0.75rem;
  color: #64748b;
}

.pos-lang-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pos-lang-item.is-active .pos-lang-radio {
  border-color: var(--pos-primary);
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--pos-primary);
}
</style>
