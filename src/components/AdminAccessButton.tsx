import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AdminAccessButton() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let keySequence = '';
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      keySequence += e.key.toLowerCase();
      
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        keySequence = '';
      }, 1000);

      // Secret key sequence: "admin"
      if (keySequence.includes('admin')) {
        setShow(true);
        keySequence = '';
        setTimeout(() => setShow(false), 5000); // Hide after 5 seconds
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 fade-in">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="rounded-full h-14 w-14 bg-gradient-vibe shadow-glow hover:scale-110 transition-transform"
            >
              <Shield className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Admin Access</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
