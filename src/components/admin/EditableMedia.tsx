import { useState, useEffect, useRef } from "react";
import { useEditable } from "@/contexts/EditableContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Upload, Link, X, Loader2, Video, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useScroll, useTransform } from "framer-motion";

interface EditableMediaProps {
  sectionKey: string;
  field: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  label?: string;
  enableParallax?: boolean;
  parallaxRange?: number; // How much the content moves (in percentage)
}

export const EditableMedia = ({
  sectionKey,
  field,
  defaultSrc,
  alt,
  className = "",
  label,
  enableParallax = false,
  parallaxRange = 30,
}: EditableMediaProps) => {
  const { isEditMode, getSectionContent, setPendingChange, loadSectionContent } = useEditable();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallaxRange}%`, `-${parallaxRange}%`]
  );

  useEffect(() => {
    loadSectionContent(sectionKey);
  }, [sectionKey, loadSectionContent]);

  function detectMediaType(src: string): "image" | "video" {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    const lowerSrc = src.toLowerCase();
    return videoExtensions.some((ext) => lowerSrc.includes(ext)) ? "video" : "image";
  }

  const sectionContent = getSectionContent(sectionKey);
  const storedSrc = sectionContent[field];
  const storedType = sectionContent[`${field}_type`];
  
  // Get the source - check if we have a stored value, otherwise use default
  const currentSrc = storedSrc || defaultSrc;
  
  // Determine media type - use stored type if available, otherwise detect from URL
  const currentType: "image" | "video" = storedType === "video" ? "video" : storedType === "image" ? "image" : detectMediaType(currentSrc);
  
  console.log('EditableMedia Debug:', { field, storedSrc, storedType, currentSrc, currentType });

  const handleMediaClick = () => {
    if (isEditMode) {
      setIsDialogOpen(true);
      setPreviewUrl(null);
      setUrlInput("");
      setMediaType(currentType);
    }
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${sectionKey}-${field}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Erreur lors du téléchargement");
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("site-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Veuillez sélectionner une image ou une vidéo");
      return;
    }

    // Size limit: 5MB for images, 50MB for videos
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(isVideo ? "La vidéo ne doit pas dépasser 50MB" : "L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    const url = await uploadMedia(file);
    setIsUploading(false);

    if (url) {
      setPreviewUrl(url);
      setMediaType(isVideo ? "video" : "image");
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    try {
      const parsedUrl = new URL(urlInput);

      if (parsedUrl.protocol !== "https:") {
        toast.error("Seules les URLs HTTPS sont autorisées");
        return;
      }

      setIsUploading(true);
      const detectedType = detectMediaType(urlInput);
      setMediaType(detectedType);

      if (detectedType === "video") {
        // For videos, just validate URL format
        setPreviewUrl(urlInput);
        setIsUploading(false);
        toast.success("Vidéo chargée avec succès");
      } else {
        // For images, test loading
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        const loadPromise = new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = urlInput;
        });

        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 10000);
        });

        const loaded = await Promise.race([loadPromise, timeoutPromise]);
        setIsUploading(false);

        if (loaded) {
          setPreviewUrl(urlInput);
          toast.success("Image chargée avec succès");
        } else {
          toast.error("Impossible de charger l'image");
        }
      }
    } catch {
      setIsUploading(false);
      toast.error("URL invalide");
    }
  };

  const handleConfirm = () => {
    if (previewUrl) {
      // Save the URL to the field
      setPendingChange({
        sectionKey,
        field,
        oldValue: currentSrc,
        newValue: previewUrl,
      });
      // Also save the media type
      setPendingChange({
        sectionKey,
        field: `${field}_type`,
        oldValue: currentType,
        newValue: mediaType,
      });
      console.log('Saving media:', { field, url: previewUrl, type: mediaType });
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPreviewUrl(null);
    setUrlInput("");
  };

  const renderMediaContent = (src: string, type: "image" | "video", isPreview = false) => {
    const baseClasses = "w-full h-full object-cover";

    if (type === "video") {
      return (
        <video
          key={src}
          src={src}
          className={baseClasses}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => console.error('Video load error:', e, src)}
          onLoadedData={() => console.log('Video loaded:', src)}
        />
      );
    }
    return <img src={src} alt={alt} className={baseClasses} onError={(e) => console.error('Image load error:', e, src)} />;
  };

  const renderDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-lg z-[9999]">
        <DialogHeader>
          <DialogTitle>Modifier le média{label ? ` - ${label}` : ""}</DialogTitle>
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

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-sm">Image</span>
                </div>
                <div className="text-muted-foreground">ou</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="h-6 w-6" />
                  <span className="text-sm">Vidéo</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Images: max 5MB | Vidéos: max 50MB
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer"
              />
              {isUploading && (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Téléchargement en cours...
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/media.mp4"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button onClick={handleUrlSubmit} variant="outline" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ...
                  </>
                ) : (
                  "Charger"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Extensions vidéo supportées: .mp4, .webm, .ogg, .mov
            </p>
          </TabsContent>
        </Tabs>

        {previewUrl && (
          <div className="relative mt-4">
            <div className="flex items-center gap-2 mb-2">
              {mediaType === "video" ? (
                <Video className="h-4 w-4 text-primary" />
              ) : (
                <ImageIcon className="h-4 w-4 text-primary" />
              )}
              <p className="text-sm text-muted-foreground">
                Aperçu ({mediaType === "video" ? "Vidéo" : "Image"}):
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
              {renderMediaContent(previewUrl, mediaType, true)}
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

  // Button-only mode
  if (label) {
    if (!isEditMode) return null;

    return (
      <>
        <Button
          type="button"
          onClick={handleMediaClick}
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

  // Standard media mode with optional parallax
  return (
    <>
      <div ref={containerRef} className={`relative group overflow-hidden ${className}`}>
        {enableParallax ? (
          <motion.div
            className="absolute inset-0 w-full"
            style={{
              y: parallaxY,
              height: `${100 + parallaxRange * 2}%`,
              top: `-${parallaxRange}%`,
            }}
          >
            {renderMediaContent(currentSrc, currentType)}
          </motion.div>
        ) : (
          renderMediaContent(currentSrc, currentType)
        )}

        {isEditMode && (
          <>
            {/* Overlay visible on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
              <div className="bg-white rounded-full p-3 shadow-lg">
                {currentType === "video" ? (
                  <Video className="h-6 w-6 text-primary" />
                ) : (
                  <Camera className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
            {/* Edit button always visible in edit mode */}
            <button
              type="button"
              onClick={handleMediaClick}
              className="absolute bottom-3 right-3 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-3 py-2 shadow-lg transition-all flex items-center gap-2 text-sm font-medium"
              title="Modifier le média"
            >
              <Upload className="h-4 w-4" />
              Modifier
            </button>
          </>
        )}
      </div>
      {renderDialog()}
    </>
  );
};
