'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAppStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ ログイン処理
      const login = async () => {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const result = await res.json();
        const { session } = result;
      if (session) {
          const { access_token, user } = session;
          if (user) {
            setUser({id: user.id, email: user.email, token: access_token, name: user.name});
            localStorage.setItem('loginTime', Date.now().toString()) 
          }
        }
      }
      
      toast({
        title: dictionary.common.success,
        description: dictionary.common.welcome,
      });
      login();
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast({
        title: dictionary.common.error,
        description: dictionary.auth.loginError,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{dictionary.auth.loginTitle}</CardTitle>
          <CardDescription className="text-center">
            {dictionary.auth.email}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{dictionary.auth.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{dictionary.auth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dictionary.auth.loggingIn : dictionary.auth.loginButton}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {dictionary.auth.noAccount}{' '}
              <Link href="/signup" className="text-primary hover:underline">
                {dictionary.auth.signupLink}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
