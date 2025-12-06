'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock_quantity: '',
    image_url: ''
  })

  useEffect(() => {
    checkAdminAndFetchData()
  }, [])

  const checkAdminAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    
    // Logic kiểm tra quyền admin đơn giản:
    // Bạn có thể thay 'admin@example.com' bằng email của bạn để test
    // Hoặc bỏ qua đoạn if này nếu muốn ai đăng nhập cũng vào được (dev mode)
    // if (session.user.email !== 'admin@example.com') {
    //   toast.error('Bạn không có quyền truy cập!')
    //   router.push('/')
    //   return
    // }
    
    fetchOrders()
  }

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('products').insert({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        images: [newProduct.image_url],
        is_active: true
      })

      if (error) throw error

      toast.success('Thêm sản phẩm thành công')
      setNewProduct({ name: '', price: '', description: '', stock_quantity: '', image_url: '' })
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    
    if (error) toast.error('Cập nhật thất bại')
    else {
      toast.success('Đã cập nhật trạng thái')
      fetchOrders()
    }
  }

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu admin...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Quản lý Đơn hàng</TabsTrigger>
          <TabsTrigger value="products">Thêm Sản phẩm</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{order.order_number}</CardTitle>
                    <p className="text-sm text-gray-500">Khách: {order.shipping_address?.fullName} - {order.shipping_address?.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded p-1 text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="shipping">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Hủy</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="text-sm flex justify-between mb-1">
                      <span>{item.product_name} (x{item.quantity})</span>
                      <span>${item.subtotal}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 font-bold text-right">
                    Tổng: ${order.total_amount}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Thêm sản phẩm mới</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <label>Tên sản phẩm</label>
                  <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <label>Giá ($)</label>
                    <Input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label>Tồn kho</label>
                    <Input type="number" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label>Link ảnh (URL)</label>
                  <Input value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} placeholder="https://..." required />
                </div>
                <div className="space-y-2">
                  <label>Mô tả ngắn</label>
                  <Input value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <Button type="submit">Lưu sản phẩm</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}