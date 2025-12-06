import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from './add-to-cart-button'
import { Badge } from '@/components/ui/badge'
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) return notFound()

  // Tính % giảm giá
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Cột ảnh sản phẩm */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border shadow-sm">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-lg px-3 py-1">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Cột thông tin */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                Chính hãng
              </Badge>
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Còn hàng
                </Badge>
              ) : (
                <Badge variant="destructive">Hết hàng</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating giả lập (vì DB có thể chưa có data thật) */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.review_count || 0} đánh giá)</span>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-primary">${product.price}</div>
              {product.original_price && (
                <div className="text-xl text-gray-400 line-through mb-1">
                  ${product.original_price}
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none text-gray-600 bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm:</h3>
            <p>{product.description}</p>
          </div>

          {/* Các cam kết marketing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Truck className="w-8 h-8 text-blue-500" />
              <div className="text-sm">
                <div className="font-semibold">Freeship</div>
                <div className="text-gray-500">Đơn từ $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <div className="text-sm">
                <div className="font-semibold">Bảo hành</div>
                <div className="text-gray-500">12 tháng</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}