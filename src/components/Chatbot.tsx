import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  text: string;
  isBot: boolean;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const Chatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: language === 'ar' 
        ? "👋 مرحباً بكم في عيادة د. يوسف جيرمان!\n\nأنا مساعدك الذكي. اسألني أي سؤال عن:\n• علاجات الأسنان\n• حجز المواعيد\n• الأسعار والخدمات\n• حالات الطوارئ\n\nكيف يمكنني مساعدتك؟"
        : "👋 Welcome to Dr. Yousif German - Smile Builder!\n\nI'm your AI assistant. Ask me anything about:\n• Dental treatments\n• Booking appointments\n• Pricing & services\n• Emergencies\n\nHow can I help you today?", 
      isBot: true 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the AI chatbot edge function
      const { data, error } = await supabase.functions.invoke('patient-chatbot', {
        body: {
          message: userMessage,
          conversationHistory: conversationHistory
        }
      });

      if (error) throw error;

      const botResponse = data.answer || (language === 'ar' 
        ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
        : "Sorry, an error occurred. Please try again.");

      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
      ]);

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);

    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { 
        text: language === 'ar'
          ? "عذراً، حدث خطأ. يمكنك الاتصال بنا مباشرة على +96561112299"
          : "Sorry, an error occurred. You can contact us directly at +96561112299",
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatbotContent = (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[500px] vibe-card flex flex-col animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {language === 'ar' ? 'مساعد د. يوسف' : 'Dr. Yousif Assistant'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-powered'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isBot 
                    ? "bg-secondary text-foreground" 
                    : "bg-primary text-white"
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">
                    {language === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={language === 'ar' ? "اكتب رسالتك..." : "Write your message..."}
                className="bg-secondary border-border"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="bg-primary hover:bg-vibe-cyan"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(chatbotContent, document.body);
};
