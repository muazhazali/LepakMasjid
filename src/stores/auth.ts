import { create } from 'zustand';
import { pb, getCurrentUser, isAdmin } from '@/lib/pocketbase';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize auth state
  const checkAuth = () => {
    const user = getCurrentUser() as User | null;
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: isAdmin(),
      isLoading: false,
    });
  };

  // Check auth on store creation
  checkAuth();

  // Listen to auth changes
  pb.authStore.onChange(() => {
    checkAuth();
  });

  return {
    user: getCurrentUser() as User | null,
    isAuthenticated: !!getCurrentUser(),
    isAdmin: isAdmin(),
    isLoading: false,
    
    login: async (email: string, password: string) => {
      try {
        await pb.collection('users').authWithPassword(email, password);
        checkAuth();
      } catch (error) {
        throw error;
      }
    },
    
    register: async (email: string, password: string, passwordConfirm: string, name?: string) => {
      try {
        // Create user
        await pb.collection('users').create({
          email,
          password,
          passwordConfirm,
          name,
        });
        
        // Auto-login after registration
        await pb.collection('users').authWithPassword(email, password);
        checkAuth();
      } catch (error) {
        throw error;
      }
    },
    
    loginWithGoogle: async () => {
      try {
        const authMethods = await pb.collection('users').listAuthMethods();
        const googleProvider = authMethods.authProviders?.find(
          (provider) => provider.name === 'google'
        );
        
        if (!googleProvider) {
          throw new Error('Google OAuth not configured');
        }
        
        // Redirect to OAuth
        const redirectUrl = `${window.location.origin}/auth/callback`;
        const url = googleProvider.authUrl + redirectUrl;
        window.location.href = url;
      } catch (error) {
        throw error;
      }
    },
    
    logout: () => {
      pb.authStore.clear();
      checkAuth();
    },
    
    checkAuth,
  };
});

