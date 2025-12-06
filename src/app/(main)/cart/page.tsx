'use client'

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link href="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border rounded">
                    <button className="px-2 py-1" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-4 h-4"/></button>
                    <span className="px-2">{item.quantity}</span>
                    <button className="px-2 py-1" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-4 h-4"/></button>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Tổng cộng:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full" size="lg">Thanh toán ngay</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}