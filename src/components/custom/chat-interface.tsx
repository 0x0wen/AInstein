"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Paperclip, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ChatInterfaceProps {
  studyKitId: string
}

export function ChatInterface({ studyKitId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm AInstein, your AI tutor for this Study Kit. How can I help you with Calculus Fundamentals today?",
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }])

    // In a real app, you would send the message to an API and get a response
    // For demo purposes, we'll simulate a response after a short delay
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm here to help with your calculus questions. Could you tell me more specifically what topic you'd like to explore? For example, we could discuss limits, derivatives, or integrals.",
        },
      ])
    }, 1000)

    setMessage("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      <Card className="lg:col-span-1 h-full overflow-hidden">
        <CardContent className="p-4 h-full flex flex-col">
          <h3 className="font-medium mb-3">Context Resources</h3>
          <div className="space-y-2 overflow-y-auto flex-grow">
            <div className="p-3 bg-gray-100 rounded-md text-sm">
              <div className="font-medium">Calculus Textbook.pdf</div>
              <div className="text-xs text-gray-500">Added 3 days ago</div>
            </div>
            <div className="p-3 bg-gray-100 rounded-md text-sm">
              <div className="font-medium">Derivatives Notes.docx</div>
              <div className="text-xs text-gray-500">Added yesterday</div>
            </div>
            <div className="p-3 bg-gray-100 rounded-md text-sm">
              <div className="font-medium">Integration Examples.pdf</div>
              <div className="text-xs text-gray-500">Added 5 hours ago</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            Add Context
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 h-full flex flex-col overflow-hidden">
        <CardContent className="p-4 flex-grow overflow-y-auto">
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    chat.role === "assistant" ? "bg-gray-100 text-gray-800" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {chat.role === "assistant" && (
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium">AInstein</span>
                    </div>
                  )}
                  <p>{chat.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Ask AInstein anything about this topic..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button size="icon" variant="outline">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

