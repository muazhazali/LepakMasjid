import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton = ({ className }: GoogleAuthButtonProps) => {
  const { loginWithGoogle, isLoading } = useAuthStore();

  const handleClick = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google OAuth error:', error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      <Chrome className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
};

