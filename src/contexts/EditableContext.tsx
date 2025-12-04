import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingChange {
  sectionKey: string;
  field: string;
  oldValue: string;
  newValue: string;
}

interface EditableContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  pendingChange: PendingChange | null;
  setPendingChange: (change: PendingChange | null) => void;
  confirmChange: () => Promise<void>;
  cancelChange: () => void;
  getSectionContent: (sectionKey: string) => Record<string, string>;
  loadSectionContent: (sectionKey: string) => Promise<void>;
  sectionContents: Record<string, Record<string, string>>;
}

const EditableContext = createContext<EditableContextType | undefined>(undefined);

export function EditableProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [sectionContents, setSectionContents] = useState<Record<string, Record<string, string>>>({});

  const toggleEditMode = useCallback(() => {
    if (isAdmin) {
      setIsEditMode(prev => !prev);
      if (isEditMode) {
        toast.info('Mode édition désactivé');
      } else {
        toast.info('Mode édition activé - Cliquez sur les éléments pour les modifier');
      }
    }
  }, [isAdmin, isEditMode]);

  const loadSectionContent = useCallback(async (sectionKey: string) => {
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (!error && data) {
      setSectionContents(prev => ({
        ...prev,
        [sectionKey]: data.content as Record<string, string>
      }));
    }
  }, []);

  const getSectionContent = useCallback((sectionKey: string) => {
    return sectionContents[sectionKey] || {};
  }, [sectionContents]);

  const confirmChange = useCallback(async () => {
    if (!pendingChange) return;

    const { sectionKey, field, newValue } = pendingChange;
    
    // Get current content
    const currentContent = sectionContents[sectionKey] || {};
    const updatedContent = { ...currentContent, [field]: newValue };

    // Upsert the content
    const { error } = await supabase
      .from('page_content')
      .upsert({
        section_key: sectionKey,
        content: updatedContent
      }, {
        onConflict: 'section_key'
      });

    if (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Save error:', error);
    } else {
      setSectionContents(prev => ({
        ...prev,
        [sectionKey]: updatedContent
      }));
      toast.success('Modification enregistrée');
    }

    setPendingChange(null);
  }, [pendingChange, sectionContents]);

  const cancelChange = useCallback(() => {
    setPendingChange(null);
    toast.info('Modification annulée');
  }, []);

  return (
    <EditableContext.Provider value={{
      isEditMode,
      toggleEditMode,
      pendingChange,
      setPendingChange,
      confirmChange,
      cancelChange,
      getSectionContent,
      loadSectionContent,
      sectionContents
    }}>
      {children}
    </EditableContext.Provider>
  );
}

export function useEditable() {
  const context = useContext(EditableContext);
  if (context === undefined) {
    throw new Error('useEditable must be used within an EditableProvider');
  }
  return context;
}
