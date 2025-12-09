import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ArticleRestrictionScreen() {
  const { dictionary } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Article Limit Reached</CardTitle>
          <CardDescription className="text-base">
            You&apos;ve reached your free article limit. Sign up or log in to continue reading unlimited articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Benefits of creating an account:</p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Unlimited article access</li>
              <li>• Save your favorite articles</li>
              <li>• Personalized language preferences</li>
              <li>• Access to premium content</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/signup" className="flex-1">
              <Button className="w-full" size="lg">
                {dictionary.nav.signup}
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                {dictionary.nav.login}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
