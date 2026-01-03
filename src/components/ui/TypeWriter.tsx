import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypeWriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  startOnView?: boolean;
}

export function TypeWriter({
  text,
  className = "",
  delay = 0,
  speed = 40,
  cursor = true,
  cursorChar = "|",
  onComplete,
  startOnView = true,
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection observer for startOnView
  useEffect(() => {
    if (!startOnView || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  // Typing animation
  useEffect(() => {
    if (!hasStarted) return;

    // Initial delay before starting
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          
          // Variable speed for more natural typing
          const charDelay = text[currentIndex - 1] === " " 
            ? speed * 0.5 
            : text[currentIndex - 1]?.match(/[.,!?]/) 
              ? speed * 3 
              : speed + Math.random() * (speed * 0.5);
          
          timeoutRef.current = setTimeout(typeNextChar, charDelay);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasStarted, text, delay, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    setIsTyping(false);
    if (startOnView) {
      setHasStarted(false);
    }
  }, [text, startOnView]);

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {displayedText.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      ))}
      <AnimatePresence>
        {cursor && (isTyping || !isComplete) && (
          <motion.span
            className="inline-block ml-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {cursorChar}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// Text reveal animation - words appear one by one
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  startOnView?: boolean;
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.08,
  startOnView = true,
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(!startOnView);
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (!startOnView || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView, isVisible, delay]);

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: index * staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Character by character reveal with glow effect
interface GlowTypeProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  glowColor?: string;
  startOnView?: boolean;
}

export function GlowType({
  text,
  className = "",
  delay = 0,
  speed = 30,
  glowColor = "hsl(175 60% 45%)",
  startOnView = true,
}: GlowTypeProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTimeout = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRevealedCount(count);
        if (count >= text.length) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [hasStarted, text.length, delay, speed]);

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {text.split("").map((char, index) => {
        const isRevealed = index < revealedCount;
        const isLatest = index === revealedCount - 1;

        return (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isRevealed ? 1 : 0.1,
            }}
            style={{
              textShadow: isLatest
                ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
                : "none",
            }}
            transition={{ duration: 0.1 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
