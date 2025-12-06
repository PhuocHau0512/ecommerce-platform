'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut, Package } from 'lucide-react'
import { SearchBar } from '@/components/products/SearchBar' // Import mới

export function Header() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary shrink-0">
          <Package className="h-6 w-6" /> E-Shop
        </Link>

        {/* Search Bar - Hiển thị trên Desktop */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-auto">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Search Bar Mobile - Hiển thị dòng dưới trên Mobile */}
      <div className="md:hidden container mx-auto px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  )
}