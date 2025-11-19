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
  { q: "Quels sont vos horaires d'ouverture?", a: "Nous sommes ouverts du samedi au jeudi, de 9h à 20h." },
  { q: "Où êtes-vous situé?", a: "Nous sommes situés à Kuwait City, Kuwait." },
  { q: "Quels services offrez-vous?", a: "Nous offrons des implants dentaires, dentisterie cosmétique, orthodontie, traitement de canal, nettoyage et soins d'urgence." },
  { q: "Comment prendre rendez-vous?", a: "Vous pouvez prendre rendez-vous via notre formulaire de réservation sur le site ou en nous appelant." },
];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour! Je suis l'assistant virtuel de Dr. Yousif German. Comment puis-je vous aider aujourd'hui?", isBot: true }
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
        text: "Merci! Vos informations ont été enregistrées. Nous vous contacterons bientôt!",
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
        setMessages(prev => [...prev, { text: "Parfait! Quel est votre email?", isBot: true }]);
      } else if (step === "email") {
        setLeadData(prev => ({ ...prev, email: input }));
        setStep("phone");
        setMessages(prev => [...prev, { text: "Et votre numéro WhatsApp/téléphone?", isBot: true }]);
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
    } else if (input.toLowerCase().includes("rendez-vous") || input.toLowerCase().includes("réserver")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Je peux vous aider à prendre rendez-vous! Pour commencer, quel est votre nom?", 
          isBot: true 
        }]);
        setCollectingInfo(true);
        setStep("name");
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Je peux vous aider avec:\n- Horaires d'ouverture\n- Services offerts\n- Localisation\n- Prise de rendez-vous\n\nQue souhaitez-vous savoir?", 
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
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-vibe shadow-glow flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] vibe-card flex flex-col z-50 animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-vibe flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Assistant Dr. Yousif</h3>
                <p className="text-xs text-foreground/60">En ligne</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-foreground/60 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isBot 
                    ? "bg-background/50 text-foreground" 
                    : "bg-gradient-vibe text-white"
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrivez votre message..."
                className="bg-background/50 border-primary/20"
              />
              <Button onClick={handleSend} size="icon" className="bg-gradient-vibe hover:opacity-90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};