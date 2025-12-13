// middleware.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key) => Promise.resolve(req.cookies.get(key)?.value ?? null),
          setItem: (key, value) => {
            res.cookies.set(key, value)
            return Promise.resolve()
          },
          removeItem: (key) => {
            res.cookies.delete(key)
            return Promise.resolve()
          },
        },
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const protectedRoutes = ['/articles']
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
