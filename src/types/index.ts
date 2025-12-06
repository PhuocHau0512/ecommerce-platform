export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  images: string[]
  category_id?: string
  stock_quantity: number
  is_featured?: boolean
  rating: number
  review_count: number
}

export interface CartItem extends Product {
  quantity: number // Số lượng khách mua
}

export interface UserProfile {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
}