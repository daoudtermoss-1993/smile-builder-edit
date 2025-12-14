import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, Trash2, FileText, ExternalLink, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const MedicalKnowledge = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  
  // RAG Chat state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isAsking, setIsAsking] = useState(false);

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['medical-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Upload PDF mutation
  const uploadPdfMutation = useMutation({
    mutationFn: async () => {
      if (!pdfFile || !pdfTitle) {
        throw new Error('Veuillez fournir un fichier PDF et un titre');
      }

      // Upload to storage
      const fileExt = pdfFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, pdfFile);

      if (uploadError) throw uploadError;

      // Process PDF with edge function
      const { data, error } = await supabase.functions.invoke('process-pdf-document', {
        body: { filePath, title: pdfTitle },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Document ajouté',
        description: 'Le document PDF a été traité et ajouté à la base de connaissances',
      });
      setPdfFile(null);
      setPdfTitle('');
      queryClient.invalidateQueries({ queryKey: ['medical-knowledge'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add URL mutation
  const addUrlMutation = useMutation({
    mutationFn: async () => {
      if (!urlInput) {
        throw new Error('Veuillez fournir une URL');
      }

      const { data, error } = await supabase.functions.invoke('process-url-document', {
        body: { url: urlInput, title: urlTitle || urlInput },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Document ajouté',
        description: "L'article web a été ajouté à la base de connaissances",
      });
      setUrlInput('');
      setUrlTitle('');
      queryClient.invalidateQueries({ queryKey: ['medical-knowledge'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medical_knowledge')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Document supprimé',
        description: 'Le document a été retiré de la base de connaissances',
      });
      queryClient.invalidateQueries({ queryKey: ['medical-knowledge'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // RAG Chat function
  const askQuestion = async () => {
    if (!chatQuestion.trim()) return;

    setIsAsking(true);
    const userMessage = { role: 'user', content: chatQuestion };
    setChatHistory(prev => [...prev, userMessage]);
    setChatQuestion('');

    try {
      const { data, error } = await supabase.functions.invoke('rag-chat', {
        body: {
          question: chatQuestion,
          conversationHistory: chatHistory,
        },
      });

      if (error) throw error;

      const assistantMessage = { role: 'assistant', content: data.answer };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la génération de la réponse',
        variant: 'destructive',
      });
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold">Base de Connaissances Médicales (RAG)</h2>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="chat" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 py-2 text-xs md:text-sm">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chatbot IA</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="add" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 py-2 text-xs md:text-sm">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter Documents</span>
            <span className="sm:hidden">Ajouter</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 py-2 text-xs md:text-sm">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Gérer Documents</span>
            <span className="sm:hidden">Gérer</span>
          </TabsTrigger>
        </TabsList>

        {/* RAG Chat Tab */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Assistant IA Médical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3 md:p-6">
              <div className="h-[250px] md:h-[400px] overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-4 border rounded-lg bg-muted/20">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center px-4">
                    Posez une question médicale pour commencer...
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border'
                        }`}
                      >
                        <p className="text-xs md:text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isAsking && (
                  <div className="flex justify-start">
                    <div className="bg-card border p-2 md:p-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs md:text-sm text-muted-foreground">Génération...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  placeholder="Posez votre question médicale..."
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      askQuestion();
                    }
                  }}
                  className="min-h-[60px] md:min-h-[80px] text-sm flex-1"
                />
                <Button
                  onClick={askQuestion}
                  disabled={isAsking || !chatQuestion.trim()}
                  className="self-stretch sm:self-end w-full sm:w-auto"
                >
                  {isAsking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Envoyer'
                  )}
                </Button>
              </div>
              
              {chatHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChatHistory([])}
                >
                  Nouvelle conversation
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Documents Tab */}
        <TabsContent value="add">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* PDF Upload */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Upload className="w-4 h-4 md:w-5 md:h-5" />
                  Télécharger PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div>
                  <Label htmlFor="pdf-title" className="text-sm">Titre du document</Label>
                  <Input
                    id="pdf-title"
                    placeholder="Ex: Guide de traitement"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="pdf-file" className="text-sm">Fichier PDF</Label>
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={() => uploadPdfMutation.mutate()}
                  disabled={!pdfFile || !pdfTitle || uploadPdfMutation.isPending}
                  className="w-full text-sm"
                >
                  {uploadPdfMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Télécharger et Traiter</span>
                      <span className="sm:hidden">Télécharger</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* URL Input */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Ajouter Article Web
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div>
                  <Label htmlFor="url-title" className="text-sm">Titre (optionnel)</Label>
                  <Input
                    id="url-title"
                    placeholder="Auto-détection"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="url-input" className="text-sm">URL de l'article</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={() => addUrlMutation.mutate()}
                  disabled={!urlInput || addUrlMutation.isPending}
                  className="w-full text-sm"
                >
                  {addUrlMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Ajouter Article
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Documents Tab */}
        <TabsContent value="manage">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Documents dans la base de connaissances</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-2 p-3 md:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {doc.source_type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                          <h4 className="font-medium text-sm md:text-base truncate">{doc.title}</h4>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {doc.content.substring(0, 100)}...
                        </p>
                        {doc.source_url && (
                          <a
                            href={doc.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-1 inline-block truncate max-w-full"
                          >
                            {doc.source_url.length > 40 ? `${doc.source_url.substring(0, 40)}...` : doc.source_url}
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(doc.id)}
                        disabled={deleteMutation.isPending}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun document dans la base de connaissances
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
