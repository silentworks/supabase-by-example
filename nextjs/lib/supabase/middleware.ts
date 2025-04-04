import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getProfile } from '../utils'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const authPath = request.nextUrl.pathname.startsWith('/auth')
  const url = request.nextUrl.clone()

  if (
    !user &&
    !authPath
  ) {
    // no user, potentially respond by redirecting the user to the login page
    console.log(`Inside middleware..... user not found`)
    url.pathname = '/auth/signin'
    return NextResponse.redirect(url)
  }

  // if user is trying to access auth routes whilst signed in
  if (authPath && user && url.pathname !== '/auth/signout') {
    console.log(`Inside middleware..... user found`)
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // get profile and session
  const { profile, session } = await getProfile(supabase);

  if (!session && !authPath) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (
    !request.nextUrl.pathname.startsWith("/account/update-password") &&
    Boolean(request.cookies.get('password_update_required')?.value)
  ) {
    return NextResponse.redirect(new URL("/account/update-password", request.url));
  }

  if (
    !request.nextUrl.pathname.startsWith("/account/update") &&
    profile &&
    profile.display_name == null
  ) {
    return NextResponse.redirect(new URL("/account/update", request.url));
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
