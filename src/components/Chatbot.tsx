import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  text: string;
  isBot: boolean;
}

  const FAQ = [
    { q: "What are your opening hours?", a: "We are open Saturday to Thursday, 9am to 8pm." },
    { q: "Where are you located?", a: "We are located in Kuwait City, Kuwait." },
    { q: "What services do you offer?", a: "We offer dental implants, cosmetic dentistry, orthodontics, root canal treatment, cleaning and emergency care." },
    { q: "How do I book an appointment?", a: "You can book an appointment via our booking form on the site or by calling us at +96561112299." },
  ];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Dr. Yousif German's virtual assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [step, setStep] = useState<"name" | "email" | "phone" | "done">("name");

  const sendToN8n = async (webhookUrl: string, data: any) => {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error sending to n8n:", error);
    }
  };

  const saveLead = async () => {
    try {
      const { error } = await supabase.from("leads").insert([
        {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: messages.map(m => m.text).join("\n"),
          source: "chatbot"
        }
      ]);

      if (error) throw error;

      // Send to n8n webhook if configured
      const n8nWebhook = localStorage.getItem("n8n_webhook_url");
      if (n8nWebhook) {
        await sendToN8n(n8nWebhook, {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: messages.map(m => m.text).join("\n"),
          timestamp: new Date().toISOString()
        });
      }

      setMessages(prev => [...prev, {
        text: "Thank you! Your information has been recorded. We will contact you soon!",
        isBot: true
      }]);
      setCollectingInfo(false);
      setLeadData({ name: "", email: "", phone: "" });
      setStep("name");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    if (collectingInfo) {
      if (step === "name") {
        setLeadData(prev => ({ ...prev, name: input }));
        setStep("email");
        setMessages(prev => [...prev, { text: "Perfect! What is your email?", isBot: true }]);
      } else if (step === "email") {
        setLeadData(prev => ({ ...prev, email: input }));
        setStep("phone");
        setMessages(prev => [...prev, { text: "And your WhatsApp/phone number?", isBot: true }]);
      } else if (step === "phone") {
        setLeadData(prev => ({ ...prev, phone: input }));
        await saveLead();
      }
      return;
    }

    // Check FAQ
    const faqMatch = FAQ.find(faq => 
      input.toLowerCase().includes(faq.q.toLowerCase().split(" ")[0])
    );

    if (faqMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: faqMatch.a, isBot: true }]);
      }, 500);
    } else if (input.toLowerCase().includes("appointment") || input.toLowerCase().includes("book")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I can help you book an appointment! To get started, what is your name?", 
          isBot: true 
        }]);
        setCollectingInfo(true);
        setStep("name");
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I can help you with:\n- Opening hours\n- Services offered\n- Location\n- Booking appointments\n\nWhat would you like to know?", 
          isBot: true 
        }]);
      }, 500);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] vibe-card flex flex-col z-50 animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dr. Yousif Assistant</h3>
                <p className="text-xs text-muted-foreground">Online</p>
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
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Write your message..."
                className="bg-secondary border-border"
              />
              <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-vibe-cyan">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};