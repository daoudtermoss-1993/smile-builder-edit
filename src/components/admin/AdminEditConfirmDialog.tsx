import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEditable } from "@/contexts/EditableContext";

export function AdminEditConfirmDialog() {
  const { pendingChange, confirmChange, cancelChange } = useEditable();

  if (!pendingChange) return null;

  return (
    <AlertDialog open={!!pendingChange} onOpenChange={(open) => !open && cancelChange()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>Êtes-vous sûr de vouloir appliquer cette modification ?</p>
            <div className="bg-muted p-3 rounded-md space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Section:</span>{" "}
                <span className="text-muted-foreground">{pendingChange.sectionKey}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Champ:</span>{" "}
                <span className="text-muted-foreground">{pendingChange.field}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Ancienne valeur:</span>
                <p className="text-muted-foreground mt-1 p-2 bg-destructive/10 rounded">
                  {pendingChange.oldValue.substring(0, 100)}
                  {pendingChange.oldValue.length > 100 && '...'}
                </p>
              </div>
              <div>
                <span className="font-medium text-foreground">Nouvelle valeur:</span>
                <p className="text-muted-foreground mt-1 p-2 bg-primary/10 rounded">
                  {pendingChange.newValue.substring(0, 100)}
                  {pendingChange.newValue.length > 100 && '...'}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelChange}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={confirmChange}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
