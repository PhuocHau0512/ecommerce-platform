'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { useState } from 'react'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  return (
    <div className="flex gap-4 items-center">
      <input 
        type="number" 
        min="1" 
        max={product.stock_quantity}
        value={qty}
        onChange={(e) => setQty(parseInt(e.target.value))}
        className="border rounded px-3 py-2 w-20 text-center"
      />
      <Button size="lg" onClick={() => addToCart(product, qty)}>
        Thêm vào giỏ
      </Button>
    </div>
  )
}