import { useAuth } from '@/contexts/AuthContext';
import { useEditable } from '@/contexts/EditableContext';
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminEditToggle() {
  const { isAdmin } = useAuth();
  const { isEditMode, toggleEditMode } = useEditable();

  if (!isAdmin) return null;

  return (
    <Button
      onClick={toggleEditMode}
      variant={isEditMode ? "destructive" : "default"}
      size="sm"
      className={cn(
        "fixed bottom-20 right-4 z-50 shadow-lg",
        isEditMode && "animate-pulse"
      )}
    >
      {isEditMode ? (
        <>
          <X className="w-4 h-4 mr-2" />
          Quitter l'édition
        </>
      ) : (
        <>
          <Pencil className="w-4 h-4 mr-2" />
          Mode édition
        </>
      )}
    </Button>
  );
}
