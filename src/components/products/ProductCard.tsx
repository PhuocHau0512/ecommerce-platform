'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-gray-100">
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
            Hết hàng
          </div>
        )}
      </Link>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 font-bold text-lg">${product.price}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => addToCart(product, 1)}
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" /> Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}