// app/api/login/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

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
