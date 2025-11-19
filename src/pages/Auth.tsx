import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100).optional(),
});

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      const validationData = isSignUp 
        ? { email, password, fullName }
        : { email, password };
      
      const result = authSchema.safeParse(validationData);
      
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message || 'Failed to sign up');
          }
        } else {
          toast.success('Account created! Please check your email to verify your account.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message || 'Failed to sign in');
          }
        } else {
          toast.success('Signed in successfully!');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="vibe-card">
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-4">
              <span className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">
                Admin Access
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-vibe bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Sign up to access the admin dashboard' : 'Sign in to manage appointments'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="Dr. Yousif German"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-primary/20"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-primary/20"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}