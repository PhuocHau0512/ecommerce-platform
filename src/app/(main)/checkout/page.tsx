'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Cần cài: npx shadcn@latest add radio-group
import { CreditCard, Banknote, QrCode } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod') // Mặc định COD
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  })

  // Nếu giỏ hàng trống, quay về home (đã xử lý ở cart page, nhưng thêm ở đây cho chắc)
  if (items.length === 0 && typeof window !== 'undefined') {
     // router.push('/') 
     // (Tạm comment để tránh lỗi hydration nếu render server side khác client side)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Vui lòng đăng nhập để thanh toán')
      router.push('/login')
      return
    }
    if (items.length === 0) return

    setLoading(true)
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: `ORD-${Date.now()}`,
          total_amount: total,
          status: 'pending',
          shipping_address: formData,
          payment_status: 'pending',
          payment_method: paymentMethod // Lưu phương thức thanh toán (cần thêm cột này vào DB nếu chưa có)
        })
        .select()
        .single()

      if (orderError) throw orderError

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

      clearCart()
      toast.success('Đặt hàng thành công!')
      router.push('/orders') 

    } catch (error: any) {
      console.error(error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán & Giao hàng</h1>
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        
        {/* Cột trái: Thông tin giao hàng & Thanh toán */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Thông tin nhận hàng
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Họ tên người nhận</Label>
                <Input required placeholder="Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input required placeholder="0909xxxxxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ nhận hàng</Label>
                <Input required placeholder="Số nhà, đường, phường, quận..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Phương thức thanh toán
            </h2>
            <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod} className="grid gap-4">
              <div>
                <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                <Label
                  htmlFor="cod"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Banknote className="mb-3 h-6 w-6" />
                  Thanh toán khi nhận hàng (COD)
                </Label>
              </div>
              <div>
                <RadioGroupItem value="banking" id="banking" className="peer sr-only" />
                <Label
                  htmlFor="banking"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <QrCode className="mb-3 h-6 w-6" />
                  Chuyển khoản ngân hàng (QR Code)
                </Label>
              </div>
            </RadioGroup>
          </section>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="h-fit sticky top-24">
          <div className="bg-slate-50 p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-xl mb-4">Đơn hàng của bạn ({items.length} sản phẩm)</h2>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4 bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-sm w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      {item.quantity}
                    </div>
                    <span className="text-sm font-medium line-clamp-1">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t text-primary">
                <span>Tổng thanh toán</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout} 
              className="w-full mt-6 text-lg py-6" 
              disabled={loading || items.length === 0}
            >
              {loading ? 'Đang xử lý...' : `Xác nhận đặt hàng`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}