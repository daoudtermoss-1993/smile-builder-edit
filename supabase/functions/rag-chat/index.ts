import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ragChatSchema = z.object({
  question: z.string().trim().min(1, 'Question is required').max(2000, 'Question too long'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(5000)
  })).max(20).optional().default([])
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create client with user's token to verify identity
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has admin role using service role client
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });
    
    if (roleError || !hasAdminRole) {
      console.error('Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const rawInput = await req.json();
    const validationResult = ragChatSchema.safeParse(rawInput);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: validationResult.error.flatten().fieldErrors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { question, conversationHistory } = validationResult.data;
    
    console.log('RAG Chat query (admin verified):', question.substring(0, 100));

    // Search for relevant documents using full-text search
    const { data: relevantDocs, error: searchError } = await supabase
      .rpc('search_medical_knowledge', {
        search_query: question,
        match_count: 3
      });

    if (searchError) {
      console.error('Search error:', searchError);
      throw searchError;
    }

    console.log('Found relevant documents:', relevantDocs?.length || 0);

    // Prepare context from relevant documents
    let context = '';
    if (relevantDocs && relevantDocs.length > 0) {
      context = relevantDocs.map((doc: any, idx: number) => {
        return `\n\n[Source ${idx + 1}: ${doc.title}${doc.source_url ? ` - ${doc.source_url}` : ''}]\n${doc.content.substring(0, 1000)}...`;
      }).join('\n');
    }

    // Build messages for AI
    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant médical expert pour dentiste. Tu réponds aux questions en citant des sources médicales pertinentes.

INSTRUCTIONS IMPORTANTES:
- Réponds UNIQUEMENT en te basant sur les documents fournis dans le contexte
- Cite TOUJOURS tes sources en mentionnant [Source X]
- Si tu ne trouves pas l'information dans les documents, dis-le clairement
- Utilise un langage professionnel et médical approprié
- Fournis des réponses précises et détaillées

CONTEXTE MÉDICAL DISPONIBLE:
${context || "Aucun document pertinent trouvé dans la base de connaissances."}`,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: question,
      },
    ];

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.3, // Lower temperature for more factual responses
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices[0].message.content;

    console.log('Generated answer length:', answer.length);

    return new Response(
      JSON.stringify({ 
        answer,
        sources: relevantDocs?.map((doc: any) => ({
          title: doc.title,
          url: doc.source_url,
          type: doc.source_type,
        })) || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rag-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
