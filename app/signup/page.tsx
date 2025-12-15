'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { supabaseBrowser } from '@/lib/supabase/browser'
import { useLanguage } from '@/contexts/LanguageContext'
import { CONFIRM_EMAIL_NOTICE } from '@/lib/messages'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function SignupPage() {
  const router = useRouter()
  const { dictionary } = useLanguage()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: dictionary.common.error,
        description: dictionary.auth.passwordMismatch,
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          // 必要ならリダイレクト先（確認メール用）
          // emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      /**
       * ケース1: Email confirmation OFF
       * → session がある → そのままログイン済み
       *
       * ケース2: Email confirmation ON
       * → session === null → メール確認待ち
       */

      if (data.session) {
        // 即ログインできた場合
        toast({
          title: dictionary.common.success,
          description: dictionary.common.welcome,
        })

        router.push('/')
        router.refresh()
      } else {
        // メール確認が必要な場合
        toast({
          title: dictionary.common.success,
          description: CONFIRM_EMAIL_NOTICE,
        })

        router.push('/login')
      }
    } catch (err) {
      toast({
        title: dictionary.common.error,
        description: dictionary.auth.signupError,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {dictionary.auth.signupTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {dictionary.auth.email}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {dictionary.auth.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? dictionary.auth.signingUp
                : dictionary.auth.signupButton}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {dictionary.auth.hasAccount}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {dictionary.auth.loginLink}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
