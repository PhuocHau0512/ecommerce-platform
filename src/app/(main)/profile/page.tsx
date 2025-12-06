'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  // State form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Load thông tin profile khi vào trang
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error && error.code !== 'PGRST116') { // PGRST116 là lỗi không tìm thấy data (chưa có profile)
           console.error('Error fetching profile:', error)
        }

        if (data) {
          setFullName(data.full_name || '')
          setPhone(data.phone || '')
          // Ưu tiên hiển thị email từ Auth User, nếu không có thì lấy từ profile
          setEmail(user.email || data.email || '') 
        } else {
           // Nếu chưa có profile trong bảng user_profiles, lấy tạm từ Auth User
           setEmail(user.email || '')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setFetching(false)
      }
    }
    getProfile()
  }, [user, supabase])

  const handleUpdate = async () => {
    if (!user) return
    setLoading(true)

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email, // Luôn đồng bộ email từ Auth sang
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success('Cập nhật hồ sơ thành công!')
      router.refresh() // Refresh lại data server component nếu có
    } catch (error: any) {
      console.error(error)
      toast.error('Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push('/login')
  }

  if (!user) return <div className="p-8 text-center">Đang kiểm tra đăng nhập...</div>
  if (fetching) return <div className="p-8 text-center">Đang tải thông tin...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản của bạn</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email đăng nhập</Label>
            {/* Input này bị disable vì email quản lý bởi Supabase Auth */}
            <Input id="email" value={email} disabled className="bg-gray-100 cursor-not-allowed" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input 
              id="name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Nhập họ tên của bạn"
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Thêm số điện thoại liên hệ"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button variant="outline" onClick={() => router.push('/orders')}>
              Lịch sử đơn hàng
            </Button>
            <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}