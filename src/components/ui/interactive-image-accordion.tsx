import React, { useState } from 'react';
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick?: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter, onClick }: AccordionItemProps) => {
  return (
    <div
      className={cn(
        "relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-700 ease-in-out",
        isActive ? "w-[280px] md:w-[400px]" : "w-[50px] md:w-[60px]"
      )}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { 
          (e.target as HTMLImageElement).onerror = null; 
          (e.target as HTMLImageElement).src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error'; 
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Caption Text */}
      <span
        className={cn(
          "absolute text-white text-base md:text-lg font-semibold whitespace-nowrap",
          "transition-all duration-300 ease-in-out",
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
            : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
        )}
      >
        {item.title}
      </span>
    </div>
  );
};

interface InteractiveImageAccordionProps {
  items: AccordionItemData[];
  defaultActiveIndex?: number;
  className?: string;
  onItemClick?: (index: number, item: AccordionItemData) => void;
}

export function InteractiveImageAccordion({ 
  items, 
  defaultActiveIndex = 0,
  className,
  onItemClick
}: InteractiveImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-row items-center justify-center gap-2 md:gap-4 overflow-x-auto p-4">
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            isActive={index === activeIndex}
            onMouseEnter={() => handleItemHover(index)}
            onClick={() => onItemClick?.(index, item)}
          />
        ))}
      </div>
    </div>
  );
}

export { AccordionItem };
