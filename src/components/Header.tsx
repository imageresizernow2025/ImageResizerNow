'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M21 12H3M21 12l-4 4M21 12l-4-4M12 3v18M12 3l4 4M12 3L8 7" />
          </svg>
          <span className="text-lg font-bold">
            <span className="text-foreground">Image</span><span className="text-primary">ResizerNow</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded" />
          ) : !user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex text-xs sm:text-sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
