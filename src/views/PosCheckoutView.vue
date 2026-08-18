<template>
  <div class="checkout-view">
    <!-- Compact In-App Navigation Bar -->
    <div class="checkout-nav-bar">
      <button class="nav-back-btn" @click="$router.back()" aria-label="Back to Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h2 class="nav-title">{{ t.checkoutTitle }}</h2>
      <button class="nav-exit-btn" @click="handleExit" aria-label="Exit App">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="content-scroll">
      <!-- Order Items Card -->
      <div class="section-card">
        <div class="section-header">
          <h3 class="section-title">{{ t.orderItems }} ({{ totalCount }})</h3>
          <button class="clear-btn" @click="clearCart" v-if="cart.length > 0">{{ t.clearAll }}</button>
        </div>

        <div class="cart-list" v-if="cart.length > 0">
          <div class="cart-item" v-for="item in cart" :key="item.product.id">
            <img :src="item.product.imageUrl" :alt="getProductName(item.product)" class="item-img" />
            <div class="item-details">
              <span class="item-name">{{ getProductName(item.product) }}</span>
              <span class="item-price">${{ item.product.price.toFixed(2) }}</span>
            </div>
            
            <div class="quantity-controller">
              <button class="qty-btn" @click="removeFromCart(item.product.id)">−</button>
              <span class="qty-num">{{ item.quantity }}</span>
              <button class="qty-btn" @click="addToCart(item.product)">+</button>
            </div>
          </div>
        </div>

        <div v-else class="empty-cart">
          <p>{{ t.emptyCart }}</p>
          <button class="return-menu-btn" @click="$router.push('/')">{{ t.browseMenu }}</button>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="section-card" v-if="cart.length > 0">
        <h3 class="section-title">{{ t.subtotal }} & {{ t.total }}</h3>
        <div class="bill-row">
          <span>{{ t.subtotal }}</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="bill-row">
          <span>{{ t.vatTax }}</span>
          <span>${{ tax.toFixed(2) }}</span>
        </div>
        <div class="bill-divider"></div>
        <div class="bill-row total">
          <span>{{ t.grandTotal }}</span>
          <span class="highlight-total">${{ grandTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Sticky Pay Button -->
    <div class="bottom-action-bar" v-if="cart.length > 0">
      <button class="pay-btn" :disabled="isPaying" @click="handlePay">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <span>{{ t.pay }} ${{ grandTotal.toFixed(2) }}</span>
      </button>
    </div>

    <!-- Alert Modal for Success or Failed Payment -->
    <PPAlert
      v-model="showAlert"
      :title="alertTitle"
      :message="alertMessage"
      :confirmText="alertType === 'success' ? t.newOrder : t.tryAgain"
      @confirm="onAlertConfirm"
    >
      <template #icon>
        <div class="alert-status-icon" :class="alertType">
          <svg v-if="alertType === 'success'" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </template>
    </PPAlert>

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PPAlert, PPConfirm } from '@phanna/ui-framework'
import { usePosStore } from '../store/usePosStore'
import type { Product } from '../data/mockData'
import { useI18n } from '../i18n'
import '@/lib/mini.app.lib.js'

const router = useRouter()
const MiniApp = (window as any).MiniApp
const { cart, totalCount, subtotal, tax, grandTotal, addToCart, removeFromCart, clearCart } = usePosStore()
const { t, currentLanguage } = useI18n()

const isPaying = ref(false)
const userProfile = ref<any>(null)

// Exit Confirmation Dialog State
const showExitConfirm = ref(false)

// Alert State
const showAlert = ref(false)
const alertType = ref<'success' | 'failed'>('success')
const alertTitle = ref('')
const alertMessage = ref('')

const getProductName = (product: Product) => {
  const lang = currentLanguage.value
  return product.name[lang] || product.name.en
}

const handleExit = () => {
  showExitConfirm.value = true
}

const confirmExit = () => {
  // Exit without standard browser confirm dialog since we used PPConfirm
  MiniApp.exit(false)
}

onMounted(async () => {
  try {
    const profile = await MiniApp.getUserProfile({ appKey: 'MINI_POS_APP_KEY' })
    if (profile) {
      userProfile.value = profile
    }
  } catch (err) {
    console.error('Failed to get user profile in POS checkout:', err)
  }
})

const onAlertConfirm = () => {
  if (alertType.value === 'success') {
    clearCart()
    router.push('/')
  }
}

const handlePay = async () => {
  if (isPaying.value || cart.value.length === 0) return
  isPaying.value = true

  try {
    const result = await MiniApp.requestPayment({
      serviceType: MiniApp.ServiceType.CARD_PAYMENT,
      prepayId: 'PREPAY_POS_' + Date.now(),
      amount: parseFloat(grandTotal.value.toFixed(2)),
      currency: 'USD',
      partnerCode: 'MINI_POS_STORE',
      metadata: {
        orderId: 'POS_ORD_' + Date.now(),
        itemCount: totalCount.value,
        cashier: userProfile.value?.name || 'Cashier'
      }
    })

    console.log('POS Payment success:', result)
    alertType.value = 'success'
    alertTitle.value = t.value.paymentReceived
    alertMessage.value = `${t.value.orderTotal}: $${grandTotal.value.toFixed(2)}\n${t.value.transactionId}: ${result.transactionId || 'SUCCESS'}`
    showAlert.value = true
  } catch (error: any) {
    console.error('POS Payment failed or was cancelled:', error)
    alertType.value = 'failed'
    alertTitle.value = t.value.paymentFailedTitle
    alertMessage.value = error?.errorMessage || error?.message || 'The payment was cancelled or could not be completed.'
    showAlert.value = true
  } finally {
    isPaying.value = false
  }
}
</script>

<style scoped>
.checkout-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--pos-bg);
  overflow: hidden;
}

/* Compact In-App Navigation Bar */
.checkout-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.nav-back-btn,
.nav-exit-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-back-btn:active,
.nav-exit-btn:active {
  background: var(--pos-primary-light);
  color: var(--pos-primary);
  border-color: var(--pos-primary);
}

.nav-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: 0.2px;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: var(--text-main);
}

.section-header .section-title {
  margin-bottom: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f8fafc;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-main);
}

.item-price {
  font-size: 0.8rem;
  color: var(--pos-primary);
  font-weight: 700;
}

.quantity-controller {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 2px;
}

.qty-btn {
  background: white;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-num {
  padding: 0 8px;
  font-size: 0.85rem;
  font-weight: 700;
}

.empty-cart {
  text-align: center;
  padding: 2rem 1rem;
  color: #94a3b8;
}

.return-menu-btn {
  background: var(--pos-primary);
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
}

.bill-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

.bill-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.75rem 0;
}

.bill-row.total {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0;
}

.highlight-total {
  color: var(--pos-primary);
  font-size: 1.25rem;
}

.bottom-action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  z-index: 20;
}

.pay-btn {
  background: var(--pos-primary);
  color: white;
  border: none;
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.pay-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-status-icon.success {
  color: #10b981;
}

.alert-status-icon.failed {
  color: #ef4444;
}

:deep(.pp-confirm-content .pp-button--primary),
:deep(.pp-alert-content .pp-button--primary) {
  background-color: var(--pos-primary) !important;
  color: white !important;
}

:deep(.pp-confirm-content .pp-button--primary:hover),
:deep(.pp-alert-content .pp-button--primary:hover) {
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
</style>
