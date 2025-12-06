import { supabase } from '@/lib/supabase/client'
import { ProductCard } from '@/components/products/ProductCard'

// Server Component (Không cần 'use client')
export default async function HomePage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Sản phẩm nổi bật</h1>
        <p className="text-gray-500">Khám phá bộ sưu tập mới nhất của chúng tôi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full">Đang cập nhật sản phẩm...</p>
        )}
      </div>
    </div>
  )
}