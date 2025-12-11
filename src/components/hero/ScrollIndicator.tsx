import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          const aboutSection = document.getElementById('about');
          aboutSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
          Scroll
        </span>
        <div className="w-8 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
          <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
        </div>
      </motion.div>
    </motion.div>
  );
}
