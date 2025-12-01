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

  const FAQ_CATEGORIES = {
    // Informations pratiques
    hours: { 
      keywords: ["opening", "hours", "horaires", "ouvert", "open", "ferme", "closed"],
      answer: "🕐 **Horaires de la clinique:**\nLundi à Vendredi: 9h00 - 17h00\nFermé le week-end (Samedi et Dimanche)\n\nPour prendre rendez-vous: +96561112299"
    },
    location: {
      keywords: ["location", "where", "address", "où", "adresse", "kuwait"],
      answer: "📍 **Localisation:**\nKuwait City, Kuwait\n\nRetrouvez-nous facilement dans la section Contact avec la carte Google Maps.\nTéléphone: +96561112299"
    },
    contact: {
      keywords: ["contact", "phone", "email", "téléphone", "appeler", "call"],
      answer: "📞 **Nous contacter:**\nTéléphone: +96561112299\nEmail: info@dryousifgerman.com\nInstagram: @dr_german\nSnapchat: @yousif_german"
    },
    
    // Traitements dentaires
    implants: {
      keywords: ["implant", "implants", "missing tooth", "dent manquante"],
      answer: "🦷 **Implants dentaires:**\nSolution permanente pour remplacer les dents manquantes. L'implant est une racine artificielle en titane qui fusionne avec l'os.\n\n✓ Durée: 3-6 mois (processus complet)\n✓ Résultat naturel et permanent\n✓ Consultation gratuite disponible"
    },
    whitening: {
      keywords: ["whitening", "white", "blanchiment", "blanches", "whiten"],
      answer: "✨ **Blanchiment dentaire:**\nObtenez un sourire éclatant avec nos traitements de blanchiment professionnel.\n\n✓ Résultats visibles dès la 1ère séance\n✓ Traitement sûr et indolore\n✓ Dure 1-3 ans avec bonne hygiène\n\nConsultez-nous pour un plan personnalisé!"
    },
    orthodontics: {
      keywords: ["braces", "orthodontic", "orthodontie", "appareil", "align", "alignement"],
      answer: "😁 **Orthodontie:**\nCorrigez l'alignement de vos dents avec nos solutions modernes:\n\n• Appareils classiques\n• Appareils transparents\n• Gouttières invisibles\n\nDurée moyenne: 12-24 mois\nConsultation d'évaluation disponible"
    },
    cleaning: {
      keywords: ["cleaning", "nettoyage", "détartrage", "scaling", "hygiene"],
      answer: "🪥 **Nettoyage & Détartrage:**\nNettoyage professionnel recommandé tous les 6 mois.\n\n✓ Prévient les caries et maladies gingivales\n✓ Élimine la plaque et le tartre\n✓ Durée: 30-45 minutes\n✓ Indolore et rafraîchissant"
    },
    rootcanal: {
      keywords: ["root canal", "canal", "traitement canalaire", "endodontie", "nerve"],
      answer: "🔬 **Traitement canalaire:**\nSauvez votre dent avec un traitement de canal moderne et indolore.\n\n✓ Élimine l'infection\n✓ Préserve la dent naturelle\n✓ Anesthésie locale pour confort total\n✓ 1-2 séances selon le cas"
    },
    
    // Urgences dentaires
    emergency: {
      keywords: ["emergency", "urgence", "pain", "douleur", "hurt", "broken", "cassé"],
      answer: "🚨 **Urgences dentaires:**\nNous traitons les urgences rapidement!\n\n📞 Appelez immédiatement: +96561112299\n\n**Urgences courantes:**\n• Douleur sévère\n• Dent cassée/perdue\n• Abcès dentaire\n• Saignement important\n• Traumatisme facial\n\nContactez-nous 24/7 pour les vraies urgences!"
    },
    toothache: {
      keywords: ["toothache", "mal de dent", "tooth pain", "ache"],
      answer: "😣 **Mal de dents:**\n\n**Que faire immédiatement:**\n1. Rincez à l'eau tiède salée\n2. Prenez un anti-douleur (paracétamol)\n3. Évitez aliments chauds/froids\n4. Contactez-nous: +96561112299\n\n⚠️ Ne jamais ignorer une douleur dentaire - elle peut indiquer une infection sérieuse."
    },
    
    // Prévention & Conseils
    prevention: {
      keywords: ["prevention", "prévention", "conseils", "tips", "advice", "care"],
      answer: "🛡️ **Prévention dentaire:**\n\n**Routine quotidienne:**\n✓ Brossage 2x/jour (2 minutes)\n✓ Fil dentaire quotidien\n✓ Bain de bouche\n✓ Limitez sucre et acides\n✓ Visite dentiste tous les 6 mois\n\n**Astuce:** Brossez après les repas, attendez 30min après aliments acides!"
    },
    children: {
      keywords: ["children", "enfant", "kid", "pediatric", "bébé", "baby"],
      answer: "👶 **Soins pédiatriques:**\nDr. Yousif German traite les enfants avec douceur et patience.\n\n✓ Première visite dès 1 an\n✓ Environnement amusant et rassurant\n✓ Prévention des caries\n✓ Éducation à l'hygiène\n\nPrenez RDV pour créer de bonnes habitudes dès le jeune âge!"
    },
    
    // À propos
    about: {
      keywords: ["about", "doctor", "dr", "yousif", "german", "qualifications", "experience"],
      answer: "👨‍⚕️ **Dr. Yousif German - Smile Builder**\n\n15+ ans d'expérience en dentisterie avancée\n5000+ patients satisfaits\n10000+ traitements réussis\n\nSpécialisé en:\n• Implantologie\n• Dentisterie esthétique\n• Orthodontie moderne\n• Soins complets\n\nTechnologies de pointe • Confort maximal"
    },
    services: {
      keywords: ["services", "treatments", "traitements", "what do you offer"],
      answer: "🏥 **Nos services:**\n\n• Implants dentaires\n• Blanchiment professionnel\n• Orthodontie (appareils/gouttières)\n• Traitement canalaire\n• Couronnes & Bridges\n• Facettes dentaires\n• Nettoyage & Détartrage\n• Soins d'urgence\n• Dentisterie pédiatrique\n\nTous les soins sous un même toit!"
    },
    
    // Rendez-vous
    appointment: {
      keywords: ["appointment", "book", "rendez-vous", "réserver", "booking"],
      answer: "📅 **Prendre rendez-vous:**\n\n3 façons faciles:\n1️⃣ Formulaire en ligne (section Booking)\n2️⃣ Appel direct: +96561112299\n3️⃣ Bouton 'Call' pour assistant vocal\n\nVous recevrez une confirmation WhatsApp instantanée!"
    },
    firstVisit: {
      keywords: ["first visit", "première visite", "new patient", "nouveau patient"],
      answer: "🌟 **Première visite:**\n\n**Ce que nous ferons:**\n1. Examen complet\n2. Radiographies si nécessaire\n3. Discussion de vos besoins\n4. Plan de traitement personnalisé\n\n**À apporter:**\n• Carte d'identité\n• Dossier médical (si existant)\n• Assurance (si applicable)\n\nDurée: 45-60 minutes"
    },
    cost: {
      keywords: ["cost", "price", "tarif", "prix", "combien", "how much"],
      answer: "💰 **Tarifs:**\n\nNos tarifs varient selon le traitement nécessaire.\n\n✓ Consultation d'évaluation gratuite\n✓ Plans de paiement disponibles\n✓ Devis transparent avant traitement\n✓ Acceptons plusieurs assurances\n\nContactez-nous pour un devis personnalisé: +96561112299"
    }
  };

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "👋 **Bienvenue chez Dr. Yousif German - Smile Builder!**\n\nJe suis votre assistant virtuel. Je peux vous renseigner sur:\n\n• 🦷 Nos traitements dentaires\n• 🚨 Urgences et douleurs\n• 💡 Conseils de prévention\n• 📅 Prise de rendez-vous\n• 📍 Informations pratiques\n\n❓ **Comment puis-je vous aider aujourd'hui?**", isBot: true }
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
      // SECURITY: Validate lead data before saving
      const { leadSchema } = await import('@/lib/validation');
      const validationResult = leadSchema.safeParse({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: messages.map(m => m.text).join("\n")
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        setMessages(prev => [...prev, {
          text: `Invalid information: ${firstError.message}. Please try again.`,
          isBot: true
        }]);
        return;
      }

      const validatedData = validationResult.data;

      const { error } = await supabase.from("leads").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message,
          source: "chatbot"
        }
      ]);

      if (error) throw error;

      // Send to n8n webhook if configured
      const n8nWebhook = localStorage.getItem("n8n_webhook_url");
      if (n8nWebhook) {
        await sendToN8n(n8nWebhook, {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message,
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
        setMessages(prev => [...prev, { text: matchedCategory.answer, isBot: true }]);
      }, 500);
    } else if (lowerInput.includes("appointment") || lowerInput.includes("book") || lowerInput.includes("rendez-vous")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "📅 Je peux vous aider à prendre rendez-vous! Pour commencer, quel est votre nom?", 
          isBot: true 
        }]);
        setCollectingInfo(true);
        setStep("name");
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "👋 **Je peux vous renseigner sur:**\n\n🏥 **Traitements:**\n• Implants • Blanchiment • Orthodontie\n• Nettoyage • Traitement canalaire\n\n🚨 **Urgences dentaires**\n\n💡 **Conseils de prévention**\n\n📍 **Infos pratiques:**\n• Horaires • Localisation • Tarifs\n• Prendre rendez-vous\n\n❓ Que puis-je faire pour vous?", 
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