'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserProfile, updateUserProfile } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Locale, localeNames } from '@/lib/i18n/dictionaries';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { dictionary, locale, setLocale } = useLanguage();
  const { toast } = useToast();
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then((profile) => {
        if (profile?.preferred_language) {
          setPreferredLanguage(profile.preferred_language as Locale);
        }
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        preferred_language: preferredLanguage,
      });
      setLocale(preferredLanguage);
      toast({
        title: dictionary.common.success,
        description: dictionary.profile.updated,
      });
    } catch (error) {
      toast({
        title: dictionary.common.error,
        description: dictionary.common.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Card>
        <CardHeader>
          <CardTitle>{dictionary.profile.title}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">{dictionary.profile.preferredLanguage}</Label>
            <Select value={preferredLanguage} onValueChange={(value) => setPreferredLanguage(value as Locale)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{localeNames.en}</SelectItem>
                <SelectItem value="ja">{localeNames.ja}</SelectItem>
                <SelectItem value="zh">{localeNames.zh}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading ? dictionary.profile.updating : dictionary.profile.updateButton}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
