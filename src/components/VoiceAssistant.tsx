import { useState, useEffect } from "react";
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
  const [agentId, setAgentId] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      bookAppointment: async (parameters: { name: string; email: string; phone: string; date: string; time: string }) => {
        console.log("Booking appointment:", parameters);
        
        try {
          const { error } = await supabase.from("leads").insert([
            {
              name: parameters.name,
              email: parameters.email,
              phone: parameters.phone,
              message: `Appointment request: ${parameters.date} at ${parameters.time}`,
              source: "voice_assistant"
            }
          ]);

          if (error) throw error;

          toast.success(t("appointmentBooked"));
          return "Appointment booked successfully. We will contact you shortly to confirm.";
        } catch (error) {
          console.error("Error booking appointment:", error);
          return "There was an error booking your appointment. Please try again or contact us directly.";
        }
      }
    }
  });

  useEffect(() => {
    // Load agent ID from localStorage
    const savedAgentId = localStorage.getItem("elevenlabs_agent_id");
    if (savedAgentId) {
      setAgentId(savedAgentId);
      setIsConfigured(true);
    }
  }, []);

  const startConversation = async () => {
    if (!agentId) {
      toast.error(t("configureAgentFirst"));
      return;
    }

    setIsLoading(true);

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-session", {
        body: { agentId }
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

  const saveAgentId = () => {
    localStorage.setItem("elevenlabs_agent_id", agentId);
    setIsConfigured(true);
    toast.success(t("agentIdSaved"));
  };

  const resetAgentId = () => {
    localStorage.removeItem("elevenlabs_agent_id");
    setAgentId("");
    setIsConfigured(false);
    toast.success(t("agentIdReset"));
  };

  if (!isConfigured) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background vibe-card p-6 max-w-md w-full">
          <h3 className="text-xl font-semibold mb-4">{t("configureVoice")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("enterAgentId")} <a href="https://elevenlabs.io/app/conversational-ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">elevenlabs.io</a>
          </p>
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Agent ID"
            className="w-full px-3 py-2 border border-border rounded-md bg-secondary mb-4"
          />
          <div className="flex gap-2">
            <Button onClick={saveAgentId} className="flex-1">
              {t("save")}
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                {t("cancel")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background vibe-card p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1" />
          <h3 className="text-2xl font-semibold flex-1">
            {t("drYousifAssistant")}
          </h3>
          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAgentId}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("changeAgentId")}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
            conversation.status === "connected" && conversation.isSpeaking 
              ? "bg-primary/20 animate-pulse" 
              : "bg-secondary"
          }`}>
            <Phone className="w-12 h-12 text-primary" />
          </div>
        </div>
        
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
