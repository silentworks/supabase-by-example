import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { createServerClient } from "./supabase";

export const isUserAuthorized = async (request: Request) => {
    const { supabase, headers } = createServerClient(request, request.headers);

    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
        throw redirect('/auth/signin')
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        // JWT validation has failed
        throw redirect('/auth/signin')
    }

    return { session, user, headers }
}

type SessionData = {
    password_update_required: boolean;
};

  
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
        name: '__sb_by_example',
        maxAge: 604_800, // one week
    }
  });

export const isPasswordUpdateRequired = async (request: Request) => {
    const session = await getSession(request.headers.get('Cookie'));

    if (session.has('password_update_required')) {
        throw redirect('/account/update-password');
    }
}

export const passwordUpdateRequired = async (request: Request, headers: Headers) => {
    const session = await getSession(request.headers.get('Cookie'));
    session.set('password_update_required', true);

    headers.append('Set-Cookie', await commitSession(session));

    return headers;
}

export const clearPasswordUpdateCookie = async (request: Request, headers: Headers) => {
    const session = await getSession(request.headers.get('Cookie'));
    headers.append('Set-Cookie', await destroySession(session));

    return headers;
}
