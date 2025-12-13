// app/api/login/route.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const cookieStore = cookies()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key) => Promise.resolve(cookieStore.get(key)?.value ?? null),
          setItem: (key, value) => {
            cookieStore.set({ name: key, value, path: '/' })
            return Promise.resolve()
          },
          removeItem: (key) => {
            cookieStore.set({ name: key, value: '', path: '/', maxAge: -1 })
            return Promise.resolve()
          },
        },
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  )

  const { email, password } = await req.json()

  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !session?.user) {
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    session: {
      access_token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: 'User',
      },
    },
  })
}
