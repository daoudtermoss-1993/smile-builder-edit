import { useState } from "react";
import { useConversation } from "@11labs/react";
import { Phone, PhoneOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceAssistantProps {
  onClose?: () => void;
}

export const VoiceAssistant = ({ onClose }: VoiceAssistantProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fixed agent ID - no configuration needed for patients
  const AGENT_ID = "agent_0601k7f005mxfams7w22csdfvcdh";

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice assistant");
      toast.success(t("voiceConnected"));
    },
    onDisconnect: () => {
      console.log("Disconnected from voice assistant");
    },
    onError: (error) => {
      console.error("Voice assistant error:", error);
      toast.error(t("voiceError") + error);
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    // Client tools for booking appointments
    clientTools: {
      bookAppointment: async (parameters: { name: string; email: string; phone: string; date: string; time: string; service: string }) => {
        console.log("Voice appointment booking initiated");
        
        try {
          // SECURITY: Validate appointment data from voice AI
          const { voiceAppointmentSchema } = await import('@/lib/validation');
          const validationResult = voiceAppointmentSchema.safeParse({
            ...parameters,
            service: parameters.service || "General Consultation",
            notes: "Booked via voice assistant"
          });

          if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            console.error("Voice booking validation failed:", firstError.message);
            return `Invalid booking information: ${firstError.message}. Please provide correct details.`;
          }

          const validatedData = validationResult.data;

          // Send to edge function which will handle rate limiting and database insertion
          const { data, error } = await supabase.functions.invoke('send-booking-notification', {
            body: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              service: validatedData.service,
              date: validatedData.date,
              time: validatedData.time,
              notes: validatedData.notes || "Booked via voice assistant"
            }
          });

          if (error) throw error;

          toast.success(t("appointmentBooked"));
          return "Appointment booked successfully. We will contact you shortly via WhatsApp to confirm.";
        } catch (error) {
          console.error("Error booking appointment:", error);
          return "There was an error booking your appointment. Please try again or contact us directly.";
        }
      }
    }
  });


  const startConversation = async () => {
    setIsLoading(true);

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-session", {
        body: { agentId: AGENT_ID }
      });

      if (error) throw error;
      if (!data?.signedUrl) throw new Error("No signed URL received");

      console.log("Starting conversation with signed URL");
      await conversation.startSession({ signedUrl: data.signedUrl });
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error(error instanceof Error ? error.message : t("failedToStart"));
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
    if (onClose) onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background vibe-card p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
            conversation.status === "connected" && conversation.isSpeaking 
              ? "bg-primary/20 animate-pulse" 
              : "bg-secondary"
          }`}>
            <Phone className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-2">
          {t("drYousifAssistant")}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {conversation.status === "connected" 
            ? (conversation.isSpeaking ? t("listening") : t("speakNow")) 
            : t("clickToStart")}
        </p>

        <div className="flex gap-3 justify-center">
          {conversation.status !== "connected" ? (
            <>
              <Button
                onClick={startConversation}
                disabled={isLoading}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
              {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("connecting")}
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    {t("startCall")}
                  </>
                )}
              </Button>
              <Button onClick={onClose} variant="outline" size="lg">
                {t("cancel")}
              </Button>
            </>
          ) : (
            <Button
              onClick={endConversation}
              variant="destructive"
              size="lg"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              {t("endCall")}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {t("available247")}
        </p>
      </div>
    </div>
  );
};
