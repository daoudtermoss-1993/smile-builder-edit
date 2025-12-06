import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  text: string;
  isBot: boolean;
}

interface FAQCategory {
  keywords: string[];
  answer: string;
  answerAr?: string;
}

const FAQ_CATEGORIES: Record<string, FAQCategory> = {
    // Practical information
    hours: { 
      keywords: ["opening", "hours", "horaires", "ouvert", "open", "ferme", "closed", "ساعات", "مفتوح", "مغلق"],
      answer: "🕐 **Clinic Hours:**\nMonday to Friday: 9:00 AM - 5:00 PM\nClosed on weekends (Saturday and Sunday)\n\nTo book an appointment: +96561112299",
      answerAr: "🕐 **ساعات العمل:**\nالإثنين إلى الجمعة: 9:00 صباحاً - 5:00 مساءً\nمغلق في عطلة نهاية الأسبوع\n\nللحجز: +96561112299"
    },
    location: {
      keywords: ["location", "where", "address", "où", "adresse", "kuwait", "موقع", "عنوان", "أين", "الكويت"],
      answer: "📍 **Location:**\nKuwait City, Kuwait\n\nFind us easily in the Contact section with Google Maps.\nPhone: +96561112299",
      answerAr: "📍 **الموقع:**\nمدينة الكويت، الكويت\n\nتجدنا بسهولة في قسم الاتصال مع خرائط جوجل.\nهاتف: +96561112299"
    },
    contact: {
      keywords: ["contact", "phone", "email", "téléphone", "appeler", "call", "اتصال", "هاتف", "بريد"],
      answer: "📞 **Contact us:**\nPhone: +96561112299\nEmail: info@dryousifgerman.com\nInstagram: @dr_german\nSnapchat: @yousif_german",
      answerAr: "📞 **تواصل معنا:**\nهاتف: +96561112299\nبريد إلكتروني: info@dryousifgerman.com\nإنستغرام: @dr_german\nسناب شات: @yousif_german"
    },
    
    // Dental treatments
    implants: {
      keywords: ["implant", "implants", "missing tooth", "dent manquante", "زراعة", "أسنان مفقودة"],
      answer: "🦷 **Dental Implants:**\nPermanent solution for missing teeth. The implant is an artificial titanium root that fuses with the bone.\n\n✓ Duration: 3-6 months (complete process)\n✓ Natural and permanent result\n✓ Free consultation available",
      answerAr: "🦷 **زراعة الأسنان:**\nحل دائم للأسنان المفقودة. الزرعة هي جذر صناعي من التيتانيوم يندمج مع العظم.\n\n✓ المدة: 3-6 أشهر\n✓ نتيجة طبيعية ودائمة\n✓ استشارة مجانية متاحة"
    },
    whitening: {
      keywords: ["whitening", "white", "blanchiment", "blanches", "whiten", "تبييض", "بياض"],
      answer: "✨ **Teeth Whitening:**\nGet a bright smile with our professional whitening treatments.\n\n✓ Visible results from 1st session\n✓ Safe and painless treatment\n✓ Lasts 1-3 years with good hygiene",
      answerAr: "✨ **تبييض الأسنان:**\nاحصل على ابتسامة مشرقة مع علاجات التبييض الاحترافية.\n\n✓ نتائج مرئية من الجلسة الأولى\n✓ علاج آمن وغير مؤلم\n✓ يدوم 1-3 سنوات"
    },
    orthodontics: {
      keywords: ["braces", "orthodontic", "orthodontie", "appareil", "align", "alignement", "تقويم", "محاذاة"],
      answer: "😁 **Orthodontics:**\nCorrect your teeth alignment with our modern solutions:\n\n• Classic braces\n• Clear braces\n• Invisible aligners\n\nAverage duration: 12-24 months",
      answerAr: "😁 **تقويم الأسنان:**\nصحح محاذاة أسنانك مع حلولنا الحديثة:\n\n• التقويم الكلاسيكي\n• التقويم الشفاف\n• الحاملات غير المرئية\n\nالمدة المتوسطة: 12-24 شهر"
    },
    cleaning: {
      keywords: ["cleaning", "nettoyage", "détartrage", "scaling", "hygiene", "تنظيف", "نظافة"],
      answer: "🪥 **Cleaning & Scaling:**\nProfessional cleaning recommended every 6 months.\n\n✓ Prevents cavities and gum disease\n✓ Removes plaque and tartar\n✓ Duration: 30-45 minutes\n✓ Painless and refreshing",
      answerAr: "🪥 **التنظيف وإزالة الجير:**\nتنظيف احترافي موصى به كل 6 أشهر.\n\n✓ يمنع التسوس وأمراض اللثة\n✓ يزيل البلاك والجير\n✓ المدة: 30-45 دقيقة"
    },
    rootcanal: {
      keywords: ["root canal", "canal", "traitement canalaire", "endodontie", "nerve", "علاج عصب", "قناة"],
      answer: "🔬 **Root Canal Treatment:**\nSave your tooth with modern, painless root canal treatment.\n\n✓ Eliminates infection\n✓ Preserves natural tooth\n✓ Local anesthesia for total comfort\n✓ 1-2 sessions depending on case",
      answerAr: "🔬 **علاج قناة الجذر:**\nأنقذ سنك بعلاج قناة الجذر الحديث وغير المؤلم.\n\n✓ يقضي على العدوى\n✓ يحافظ على السن الطبيعي\n✓ تخدير موضعي للراحة التامة"
    },
    
    // Dental emergencies
    emergency: {
      keywords: ["emergency", "urgence", "pain", "douleur", "hurt", "broken", "cassé", "طوارئ", "ألم", "مكسور"],
      answer: "🚨 **Dental Emergencies:**\nWe treat emergencies quickly!\n\n📞 Call immediately: +96561112299\n\n**Common emergencies:**\n• Severe pain\n• Broken/lost tooth\n• Dental abscess\n• Significant bleeding\n• Facial trauma\n\nContact us 24/7 for real emergencies!",
      answerAr: "🚨 **حالات طوارئ الأسنان:**\nnنعالج الطوارئ بسرعة!\n\n📞 اتصل فوراً: +96561112299\n\n**حالات الطوارئ الشائعة:**\n• ألم شديد\n• سن مكسور/مفقود\n• خراج الأسنان\n• نزيف كبير"
    },
    
    // About
    about: {
      keywords: ["about", "doctor", "dr", "yousif", "german", "qualifications", "experience", "عن", "دكتور", "خبرة"],
      answer: "👨‍⚕️ **Dr. Yousif German - Smile Builder**\n\n15+ years of experience in advanced dentistry\n5000+ satisfied patients\n10000+ successful treatments\n\nSpecializing in:\n• Implantology\n• Cosmetic dentistry\n• Modern orthodontics\n• Complete care\n\nState-of-the-art technology • Maximum comfort",
      answerAr: "👨‍⚕️ **د. يوسف جيرمان - صانع الابتسامات**\n\n+15 سنة خبرة في طب الأسنان المتقدم\n+5000 مريض راضٍ\n+10000 علاج ناجح\n\nمتخصص في:\n• زراعة الأسنان\n• طب الأسنان التجميلي\n• تقويم الأسنان الحديث"
    },
    services: {
      keywords: ["services", "treatments", "traitements", "what do you offer", "خدمات", "علاجات"],
      answer: "🏥 **Our Services:**\n\n• Dental implants\n• Professional whitening\n• Orthodontics\n• Root canal treatment\n• Crowns & Bridges\n• Dental veneers\n• Cleaning & Scaling\n• Emergency care\n• Pediatric dentistry\n\nAll care under one roof!",
      answerAr: "🏥 **خدماتنا:**\n\n• زراعة الأسنان\n• تبييض احترافي\n• تقويم الأسنان\n• علاج قناة الجذر\n• التيجان والجسور\n• الفينير\n• التنظيف\n• رعاية الطوارئ\n• طب أسنان الأطفال"
    },
    
    // Appointment
    appointment: {
      keywords: ["appointment", "book", "rendez-vous", "réserver", "booking", "موعد", "حجز"],
      answer: "📅 **Book an appointment:**\n\n3 easy ways:\n1️⃣ Online form (Booking section)\n2️⃣ Direct call: +96561112299\n3️⃣ 'Call' button for voice assistant\n\nYou will receive instant WhatsApp confirmation!",
      answerAr: "📅 **احجز موعد:**\n\n3 طرق سهلة:\n1️⃣ النموذج عبر الإنترنت (قسم الحجز)\n2️⃣ اتصال مباشر: +96561112299\n3️⃣ زر 'اتصال' للمساعد الصوتي\n\nستتلقى تأكيداً فورياً عبر واتساب!"
    },
    cost: {
      keywords: ["cost", "price", "tarif", "prix", "combien", "how much", "سعر", "تكلفة", "كم"],
      answer: "💰 **Pricing:**\n\nOur rates vary depending on the treatment needed.\n\n✓ Free evaluation consultation\n✓ Payment plans available\n✓ Transparent quote before treatment\n✓ We accept several insurances\n\nContact us for a personalized quote: +96561112299",
      answerAr: "💰 **الأسعار:**\n\nتختلف أسعارنا حسب العلاج المطلوب.\n\n✓ استشارة تقييم مجانية\n✓ خطط دفع متاحة\n✓ عرض سعر شفاف قبل العلاج\n✓ نقبل عدة تأمينات\n\nاتصل بنا للحصول على عرض سعر: +96561112299"
    }
  };

export const Chatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: language === 'ar' 
      ? "👋 **مرحباً بكم في عيادة د. يوسف جيرمان!**\n\nأنا مساعدك الافتراضي. يمكنني مساعدتك في:\n\n• 🦷 علاجات الأسنان\n• 🚨 الحالات الطارئة\n• 💡 نصائح الوقاية\n• 📅 حجز موعد\n• 📍 معلومات عملية\n\n❓ **كيف يمكنني مساعدتك؟**"
      : "👋 **Welcome to Dr. Yousif German - Smile Builder!**\n\nI'm your virtual assistant. I can help you with:\n\n• 🦷 Dental treatments\n• 🚨 Emergencies\n• 💡 Prevention tips\n• 📅 Book appointment\n• 📍 Practical info\n\n❓ **How can I help you today?**", 
      isBot: true 
    }
  ]);
  const [input, setInput] = useState("");
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [step, setStep] = useState<"name" | "email" | "phone" | "done">("name");

  // SECURITY: Use edge function for lead submission (no localStorage exposure)
  const saveLead = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          message: messages.filter(m => !m.isBot).map(m => m.text).join("\n"),
          source: "chatbot"
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        text: language === 'ar' 
          ? "شكراً لك! تم تسجيل معلوماتك. سنتواصل معك قريباً!"
          : "Thank you! Your information has been recorded. We will contact you soon!",
        isBot: true
      }]);
      setCollectingInfo(false);
      setLeadData({ name: "", email: "", phone: "" });
      setStep("name");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error(language === 'ar' ? "خطأ في الحفظ" : "Error saving information");
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
        setMessages(prev => [...prev, { 
          text: language === 'ar' ? "ما هو بريدك الإلكتروني؟" : "Perfect! What is your email?", 
          isBot: true 
        }]);
      } else if (step === "email") {
        setLeadData(prev => ({ ...prev, email: input }));
        setStep("phone");
        setMessages(prev => [...prev, { 
          text: language === 'ar' ? "ما هو رقم الواتساب/الهاتف؟" : "And your WhatsApp/phone number?", 
          isBot: true 
        }]);
      } else if (step === "phone") {
        setLeadData(prev => ({ ...prev, phone: input }));
        await saveLead();
      }
      return;
    }

    // Check FAQ categories with keyword matching
    const lowerInput = input.toLowerCase();
    let matchedCategory = null;
    
    for (const [key, category] of Object.entries(FAQ_CATEGORIES)) {
      if (category.keywords.some(keyword => lowerInput.includes(keyword))) {
        matchedCategory = category;
        break;
      }
    }

    if (matchedCategory) {
      setTimeout(() => {
        const answer = language === 'ar' && matchedCategory.answerAr 
          ? matchedCategory.answerAr 
          : matchedCategory.answer;
        setMessages(prev => [...prev, { text: answer, isBot: true }]);
      }, 500);
    } else if (lowerInput.includes("appointment") || lowerInput.includes("book") || lowerInput.includes("rendez-vous") || lowerInput.includes("موعد") || lowerInput.includes("حجز")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: language === 'ar' 
            ? "📅 يمكنني مساعدتك في حجز موعد! ما هو اسمك؟" 
            : "📅 I can help you book an appointment! What is your name?", 
          isBot: true 
        }]);
        setCollectingInfo(true);
        setStep("name");
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: language === 'ar'
            ? "👋 **يمكنني مساعدتك في:**\n\n🏥 **العلاجات:**\n• زراعة الأسنان • التبييض • تقويم الأسنان\n• التنظيف • علاج العصب\n\n🚨 **حالات الطوارئ**\n\n💡 **نصائح الوقاية**\n\n📍 **معلومات عملية:**\n• المواعيد • الموقع • الأسعار\n• حجز موعد\n\n❓ كيف يمكنني مساعدتك؟"
            : "👋 **I can help you with:**\n\n🏥 **Treatments:**\n• Implants • Whitening • Orthodontics\n• Cleaning • Root canal\n\n🚨 **Dental emergencies**\n\n💡 **Prevention tips**\n\n📍 **Practical info:**\n• Hours • Location • Pricing\n• Book appointment\n\n❓ How can I help you?", 
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
          className="fixed bottom-6 w-16 h-16 rounded-full bg-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform z-[60]"
          style={{ right: '1.5rem', left: 'auto' }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed bottom-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] vibe-card flex flex-col z-[60] animate-scale-in"
          style={{ right: '1.5rem', left: 'auto' }}
        >
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