import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from './add-to-cart-button' // Tách Client Component

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-2xl font-bold text-primary">${product.price}</div>
          <div className="prose max-w-none text-gray-600">
            <h3 className="font-semibold">Mô tả sản phẩm:</h3>
            <p>{product.description}</p>
          </div>
          <div className="pt-4 border-t">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}