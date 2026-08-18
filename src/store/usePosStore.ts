import { reactive, computed } from 'vue'
import type { Product, CartItem } from '../data/mockData'

const state = reactive({
  cart: [] as CartItem[]
})

export const usePosStore = () => {
  const cart = computed(() => state.cart)

  const totalCount = computed(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.05 // 5% tax
  })

  const grandTotal = computed(() => {
    return subtotal.value + tax.value
  })

  const addToCart = (product: Product) => {
    const existing = state.cart.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      state.cart.push({ product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: string) => {
    const index = state.cart.findIndex(i => i.product.id === productId)
    if (index > -1) {
      if (state.cart[index].quantity > 1) {
        state.cart[index].quantity--
      } else {
        state.cart.splice(index, 1)
      }
    }
  }

  const deleteItem = (productId: string) => {
    const index = state.cart.findIndex(i => i.product.id === productId)
    if (index > -1) {
      state.cart.splice(index, 1)
    }
  }

  const clearCart = () => {
    state.cart = []
  }

  const getItemQuantity = (productId: string) => {
    const item = state.cart.find(i => i.product.id === productId)
    return item ? item.quantity : 0
  }

  return {
    cart,
    totalCount,
    subtotal,
    tax,
    grandTotal,
    addToCart,
    removeFromCart,
    deleteItem,
    clearCart,
    getItemQuantity
  }
}
