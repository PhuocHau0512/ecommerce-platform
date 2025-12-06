import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from 'sonner'
import { AIChatBot } from '@/components/chat/AIChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce Platform',
  description: 'Built with Next.js 15 & Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative"> {/* Thêm relative */}
            <Header />
            <main className="flex-1 bg-gray-50">{children}</main>
            <AIChatBot /> {/* Đặt Chatbot ở đây để hiện mọi nơi */}
          </div>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}