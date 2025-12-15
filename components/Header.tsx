'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabaseBrowser } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileSidebar } from './MobileSidebar';
import { FileText, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { user } = useAuth();
  const { dictionary } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabaseBrowser.auth.signOut()
      if (error) throw error;
      toast({
        title: dictionary.common.success,
        description: 'Signed out successfully',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        title: dictionary.common.error,
        description: dictionary.common.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PatentHub</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-2">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    {dictionary.nav.profile}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {dictionary.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{dictionary.nav.login}</Button>
              </Link>
              <Link href="/signup">
                <Button>{dictionary.nav.signup}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
