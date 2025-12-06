'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area' // Cần cài: npx shadcn@latest add scroll-area

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Giả lập AI trả lời (Trong thực tế bạn sẽ gọi API OpenAI ở đây)
    setTimeout(() => {
      const aiResponse = mockAIResponse(userMsg.content)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponse }])
      setIsTyping(false)
    }, 1500)
  }

  // Hàm giả lập câu trả lời thông minh
  const mockAIResponse = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes('giá') || q.includes('bao nhiêu')) return 'Sản phẩm bên mình có giá rất tốt, dao động từ $50 đến $2000 tùy loại ạ. Bạn quan tâm sản phẩm nào?'
    if (q.includes('iphone') || q.includes('điện thoại')) return 'Hiện tại iPhone 15 Pro Max đang có giá ưu đãi giảm 10%. Bạn có muốn xem chi tiết không?'
    if (q.includes('bảo hành')) return 'Tất cả sản phẩm đều được bảo hành chính hãng 12 tháng bạn nhé!'
    if (q.includes('ship') || q.includes('giao hàng')) return 'Bên mình miễn phí giao hàng cho đơn từ $50 nha.'
    return 'Cảm ơn bạn đã quan tâm. Bạn có thể nói rõ hơn nhu cầu để mình tư vấn kỹ hơn được không?'
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 animate-bounce"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[350px] md:w-[400px] shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <CardTitle className="text-base">Trợ lý AI</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-8 w-8">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-slate-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-bl-none">
                      <span className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t bg-gray-50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex w-full gap-2"
            >
              <Input 
                placeholder="Hỏi gì đó..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}