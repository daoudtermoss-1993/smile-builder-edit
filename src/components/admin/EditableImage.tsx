import { useState, useRef, useEffect } from "react";
import { useEditable } from "@/contexts/EditableContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Upload, Link, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditableImageProps {
  sectionKey: string;
  field: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  label?: string;
}

export const EditableImage = ({
  sectionKey,
  field,
  defaultSrc,
  alt,
  className = "",
  label,
}: EditableImageProps) => {
  const { isEditMode, getSectionContent, setPendingChange, loadSectionContent } = useEditable();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSectionContent(sectionKey);
  }, [sectionKey, loadSectionContent]);

  const sectionContent = getSectionContent(sectionKey);
  const currentSrc = sectionContent[field] || defaultSrc;

  const handleImageClick = () => {
    if (isEditMode) {
      setIsDialogOpen(true);
      setPreviewUrl(null);
      setUrlInput("");
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${sectionKey}-${field}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error("Erreur lors du téléchargement de l'image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    const url = await uploadImage(file);
    setIsUploading(false);

    if (url) {
      setPreviewUrl(url);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    try {
      new URL(urlInput);
      setPreviewUrl(urlInput);
    } catch {
      toast.error("URL invalide");
    }
  };

  const handleConfirm = () => {
    if (previewUrl) {
      setPendingChange({
        sectionKey,
        field,
        oldValue: currentSrc,
        newValue: previewUrl,
      });
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPreviewUrl(null);
    setUrlInput("");
  };

  const renderDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle>Modifier l'image{label ? ` - ${label}` : ''}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Télécharger
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
              variant="outline"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button onClick={handleUrlSubmit} variant="outline">
                Charger
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {previewUrl && (
          <div className="relative mt-4">
            <p className="text-sm text-muted-foreground mb-2">Aperçu:</p>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={!previewUrl}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Mode bouton uniquement (pour before/after avec label)
  if (label) {
    if (!isEditMode) return null;
    
    return (
      <>
        <Button
          type="button"
          onClick={handleImageClick}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {label}
        </Button>
        {renderDialog()}
      </>
    );
  }

  // Mode image standard
  return (
    <>
      <div className={`relative group ${className}`}>
        <img
          src={currentSrc}
          alt={alt}
          className="w-full h-full object-cover"
        />
        {isEditMode && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Camera className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
        {isEditMode && (
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-2 right-2 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
            title="Modifier l'image"
          >
            <Upload className="h-4 w-4" />
          </button>
        )}
      </div>
      {renderDialog()}
    </>
  );
};
