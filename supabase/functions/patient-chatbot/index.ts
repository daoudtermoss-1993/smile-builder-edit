import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Tu es l'assistant virtuel de la clinique dentaire du Dr. Yousif German au Koweït. Tu es amical, professionnel et serviable.

INFORMATIONS SUR LA CLINIQUE:
- Nom: Dr. Yousif German - Smile Builder
- Téléphone: +96561112299
- Localisation: Kuwait City, Kuwait
- Horaires: Lundi à Vendredi, 09:00 - 17:00 (fermé le week-end)
- Instagram: @dr_german
- Snapchat: @yousif_german

SERVICES PROPOSÉS:
1. Implants dentaires - Remplacement permanent des dents manquantes avec des implants en titane
2. Blanchiment dentaire - Éclaircissement professionnel pour un sourire plus blanc
3. Orthodontie/Invisalign - Alignement des dents avec des appareils invisibles
4. Facettes dentaires - Amélioration esthétique avec des facettes en porcelaine
5. Couronnes et bridges - Restauration des dents endommagées
6. Soins préventifs - Nettoyage, détartrage et examens réguliers

URGENCES DENTAIRES:
- Douleur intense: Rincer à l'eau tiède salée, prendre un antidouleur, consulter rapidement
- Dent cassée: Conserver le morceau, rincer doucement, consulter en urgence
- Abcès: Ne pas percer, rincer à l'eau salée, consulter immédiatement

RÈGLES DE RÉPONSE:
- Réponds toujours en français sauf si le patient écrit en arabe (alors réponds en arabe)
- Sois concis mais informatif (2-3 phrases maximum par réponse)
- Pour les questions médicales complexes, recommande de prendre rendez-vous
- Pour réserver un rendez-vous, invite le patient à utiliser le formulaire de réservation sur le site
- Ne donne jamais de diagnostic médical définitif
- Reste positif et rassurant

EXEMPLES DE RÉPONSES:
- "Bonjour! Comment puis-je vous aider aujourd'hui? 😊"
- "Pour un blanchiment dentaire, nous proposons des traitements professionnels. Souhaitez-vous prendre rendez-vous?"
- "En cas de douleur dentaire, je vous conseille de consulter rapidement. Vous pouvez réserver en ligne!"`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Service temporairement indisponible. Veuillez réessayer.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service en maintenance. Veuillez réessayer plus tard.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in patient-chatbot:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter directement au +96561112299.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
