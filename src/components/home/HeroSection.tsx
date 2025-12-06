'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden rounded-3xl mb-12 mx-4 mt-4 shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
      
      <div className="relative container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>Bộ sưu tập Mùa Hè 2025</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up [animation-delay:200ms]">
          Khám Phá Công Nghệ <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Đỉnh Cao Của Tương Lai
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 animate-fade-in-up [animation-delay:400ms]">
          Trải nghiệm mua sắm đẳng cấp với hàng ngàn sản phẩm công nghệ chính hãng, bảo hành trọn đời và giao hàng siêu tốc trong 2h.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:600ms]">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8" asChild>
            <Link href="/products">
              Mua Ngay <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
            Xem Ưu Đãi
          </Button>
        </div>
      </div>
    </section>
  )
}