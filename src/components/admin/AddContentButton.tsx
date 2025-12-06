import { Plus } from "lucide-react";
import { useEditable } from "@/contexts/EditableContext";
import { Button } from "@/components/ui/button";

interface AddContentButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const AddContentButton = ({ 
  onClick, 
  label = "Ajouter",
  className = ""
}: AddContentButtonProps) => {
  const { isEditMode } = useEditable();
  
  if (!isEditMode) return null;
  
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={`gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary ${className}`}
    >
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
};
