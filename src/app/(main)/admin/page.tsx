'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock_quantity: '',
    image_url: ''
  })
  
  // State lưu file được chọn
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    checkAdminAndFetchData()
  }, [])

  const checkAdminAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
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

  // Hàm xử lý upload ảnh lên Supabase Storage
  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products') // Tên bucket (phải tạo trên Supabase Dashboard)
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let finalImageUrl = newProduct.image_url

      // Nếu có file, thực hiện upload trước
      if (file) {
        finalImageUrl = await handleImageUpload(file)
      }

      const { error } = await supabase.from('products').insert({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        images: [finalImageUrl],
        is_active: true
      })

      if (error) throw error

      toast.success('Thêm sản phẩm thành công')
      // Reset form
      setNewProduct({ name: '', price: '', description: '', stock_quantity: '', image_url: '' })
      setFile(null)
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setUploading(false)
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
                      className="border rounded p-1 text-sm bg-white"
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
                  <Label>Tên sản phẩm</Label>
                  <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Giá ($)</Label>
                    <Input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Tồn kho</Label>
                    <Input type="number" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required />
                  </div>
                </div>
                
                {/* Phần Upload Ảnh */}
                <div className="space-y-2 border p-4 rounded-lg bg-gray-50">
                  <Label>Hình ảnh sản phẩm</Label>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="bg-white cursor-pointer"
                  />
                  {file && <p className="text-sm text-green-600">Đã chọn: {file.name}</p>}
                  
                  <div className="relative flex items-center gap-2 my-2">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-xs text-gray-500">HOẶC DÙNG LINK</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>

                  <Input 
                    value={newProduct.image_url} 
                    onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mô tả ngắn</Label>
                  <Input value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Đang xử lý...' : 'Lưu sản phẩm'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}