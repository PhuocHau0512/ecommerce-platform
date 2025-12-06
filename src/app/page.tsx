import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import { HeroSection } from '@/components/home/HeroSection'

// Định nghĩa kiểu cho props của Page
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  
  // Lấy từ khóa tìm kiếm từ URL
  const params = await searchParams
  const query = params.q || ''

  // Xây dựng câu truy vấn
  let dbQuery = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Nếu có từ khóa -> thêm điều kiện lọc
  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {query ? `Kết quả tìm kiếm cho: "${query}"` : 'Sản phẩm nổi bật'}
        </h1>
        <p className="text-gray-500">
          {query 
            ? `Tìm thấy ${products?.length || 0} sản phẩm` 
            : 'Khám phá bộ sưu tập mới nhất của chúng tôi'}
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      )}
    <div>
      {/* 1. Phần Hero Banner mới */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sản phẩm nổi bật 🔥</h2>
            <p className="text-gray-500 mt-2">Những lựa chọn tốt nhất dành cho bạn</p>
          </div>
          <a href="/products" className="text-primary hover:underline font-medium">
            Xem tất cả &rarr;
          </a>
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
    </div>
  </div>
  )
}
