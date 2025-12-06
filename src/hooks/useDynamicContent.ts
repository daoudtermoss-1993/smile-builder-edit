import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface DynamicContentItem {
  id: string;
  [key: string]: unknown;
}

export const useDynamicContent = <T extends DynamicContentItem>(
  sectionKey: string,
  field: string,
  defaultItems: T[]
) => {
  const [items, setItems] = useState<T[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from database
  const loadContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();

      if (error) throw error;

      if (data?.content && typeof data.content === 'object') {
        const content = data.content as Record<string, unknown>;
        if (content[field] && Array.isArray(content[field])) {
          setItems(content[field] as T[]);
        }
      }
    } catch (error) {
      console.error("Error loading dynamic content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey, field]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Save content to database
  const saveContent = async (newItems: T[]) => {
    console.log("saveContent called with:", newItems.length, "items");
    // Update local state immediately for responsive UI
    setItems(newItems);
    
    try {
      // First, get existing content
      const { data: existingData } = await supabase
        .from("page_content")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();

      const existingContent = (existingData?.content as Record<string, unknown>) || {};
      const updatedContent = { ...existingContent, [field]: newItems };

      const { error } = await supabase
        .from("page_content")
        .upsert({
          section_key: sectionKey,
          content: updatedContent as unknown as Json,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "section_key"
        });

      if (error) {
        console.error("Error saving dynamic content:", error);
        console.log("Error details:", JSON.stringify(error));
        // Revert to previous state on error
        await loadContent();
        toast.error("Erreur lors de la sauvegarde - vérifiez que vous êtes connecté en tant qu'admin");
        return;
      }
      
      console.log("Save successful!");
      toast.success("Contenu mis à jour");
    } catch (error) {
      console.error("Error saving dynamic content:", error);
      console.log("Catch error details:", JSON.stringify(error));
      // Revert to previous state on error
      await loadContent();
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Add a new item
  const addItem = (newItem: Omit<T, 'id'>) => {
    const itemWithId = { ...newItem, id: crypto.randomUUID() } as T;
    const newItems = [...items, itemWithId];
    saveContent(newItems);
  };

  // Update an existing item
  const updateItem = (id: string, updates: Partial<T>) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveContent(newItems);
  };

  // Delete an item
  const deleteItem = (id: string) => {
    console.log("deleteItem called with id:", id);
    console.log("Current items:", items);
    const newItems = items.filter(item => item.id !== id);
    console.log("New items after filter:", newItems);
    console.log("Items count before:", items.length, "after:", newItems.length);
    saveContent(newItems);
  };

  // Reorder items
  const reorderItems = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    saveContent(newItems);
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    refreshContent: loadContent,
  };
};
