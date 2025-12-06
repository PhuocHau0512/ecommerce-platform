'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push('/login')
  }

  if (!user) return <div className="p-8 text-center">Đang tải thông tin...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Ngày tham gia</label>
            <div className="font-medium">{new Date(user.created_at || '').toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={() => router.push('/orders')}>
            Xem lịch sử đơn hàng
          </Button>
          <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
            {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Button>
        </div>
      </div>
    </div>
  )
}