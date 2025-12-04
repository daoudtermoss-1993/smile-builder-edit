import { useState, useEffect } from 'react';
import { useEditable } from '@/contexts/EditableContext';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  sectionKey: string;
  field: string;
  defaultValue: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export function EditableText({ 
  sectionKey, 
  field, 
  defaultValue, 
  className,
  as: Component = 'span'
}: EditableTextProps) {
  const { isEditMode, getSectionContent, loadSectionContent, setPendingChange } = useEditable();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    loadSectionContent(sectionKey);
  }, [sectionKey, loadSectionContent]);

  const content = getSectionContent(sectionKey);
  const currentValue = content[field] || defaultValue;

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setLocalValue(currentValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== currentValue) {
      setPendingChange({
        sectionKey,
        field,
        oldValue: currentValue,
        newValue: localValue
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(currentValue);
      setIsEditing(false);
    }
  };

  if (isEditMode) {
    if (isEditing) {
      return (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className={cn(
            "bg-background/80 border-2 border-primary rounded-md p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary",
            className
          )}
          rows={localValue.split('\n').length || 1}
        />
      );
    }

    return (
      <Component 
        onClick={handleClick}
        className={cn(
          className,
          "cursor-pointer relative group hover:outline hover:outline-2 hover:outline-primary hover:outline-dashed rounded-sm transition-all"
        )}
      >
        {currentValue}
        <Pencil className="absolute -top-2 -right-2 w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </Component>
    );
  }

  return <Component className={className}>{currentValue}</Component>;
}
