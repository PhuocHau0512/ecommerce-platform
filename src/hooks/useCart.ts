'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { toast } from 'sonner'

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addToCart: (product, quantity) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === product.id)

        let newItems
        if (existingItem) {
          newItems = currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...currentItems, { ...product, quantity }]
        }

        // Tính lại tổng
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, itemCount })
        toast.success('Đã thêm vào giỏ hàng')
      },

      removeFromCart: (productId) => {
        const newItems = get().items.filter((item) => item.id !== productId)
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        set({ items: newItems, total, itemCount })
        toast.info('Đã xóa sản phẩm')
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return
        const newItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        set({ items: newItems, total, itemCount })
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage', // Key lưu trong LocalStorage
    }
  )
)