'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function SearchBar() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  // Hàm xử lý khi người dùng gõ (đợi 300ms sau khi ngừng gõ mới chạy)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    // Cập nhật URL mà không reload trang
    replace(`/?${params.toString()}`)
  }, 300)

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Tìm tên sản phẩm..."
        className="pl-8 bg-gray-50"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}