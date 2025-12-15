// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 🔒 保護したいルート
  const protectedRoutes = ['/articles']

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 未ログインで保護ルート → リダイレクト
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ログイン済みで login / signup → トップへ
  if (
    user &&
    (pathname === '/login' || pathname === '/signup')
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
