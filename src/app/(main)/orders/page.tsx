import { supabase } from '@/lib/supabase/client' // Lưu ý: Trong Server Component nên dùng createServerComponentClient, nhưng để đơn giản ta dùng client logic hoặc fetch server-side cơ bản
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export default async function OrdersPage() {
  const cookieStore = cookies()
  const supabaseServer = createServerComponentClient({ cookies: () => cookieStore })

  // Lấy user hiện tại
  const { data: { session } } = await supabaseServer.auth.getSession()

  if (!session) {
    return <div className="container mx-auto px-4 py-8">Vui lòng đăng nhập để xem đơn hàng.</div>
  }

  // Lấy danh sách đơn hàng + items
  const { data: orders } = await supabaseServer
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <div key={order.id} className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="font-medium">${order.total_amount}</p>
                </div>
                <div>
                  <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{item.quantity}x</span>
                      <span>{item.product_name}</span>
                    </div>
                    <span className="font-medium">${item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  )
}