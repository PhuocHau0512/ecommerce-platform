'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  })

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (items.length === 0) return

    setLoading(true)
    try {
      // 1. Tạo đơn hàng trong bảng 'orders'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: `ORD-${Date.now()}`, // Mã đơn hàng tự sinh
          total_amount: total,
          status: 'pending',
          shipping_address: formData, // Lưu JSON địa chỉ
          payment_status: 'cod' // Giả lập thanh toán khi nhận hàng
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Lưu chi tiết từng sản phẩm vào bảng 'order_items'
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Thành công: Xóa giỏ hàng và chuyển hướng
      clearCart()
      toast.success('Đặt hàng thành công!')
      router.push('/orders') // Chuyển đến trang lịch sử đơn hàng

    } catch (error: any) {
      console.error(error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleCheckout} className="space-y-4 border p-6 rounded-lg bg-white">
          <h2 className="font-semibold text-lg">Thông tin giao hàng</h2>
          <div className="space-y-2">
            <label className="text-sm">Họ tên người nhận</label>
            <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Số điện thoại</label>
            <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Địa chỉ nhận hàng</label>
            <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading || items.length === 0}>
            {loading ? 'Đang xử lý...' : `Thanh toán $${total.toFixed(2)}`}
          </Button>
        </form>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="font-semibold text-lg mb-4">Đơn hàng của bạn</h2>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}