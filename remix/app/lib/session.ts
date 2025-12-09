import { createCookieSessionStorage, redirect } from "react-router";
import { createServerClient } from "./supabase";
import { Profile } from "./utils";

const cookieSecret = process.env.COOKIE_SECRET ?? "uPFNzMoB8VOJ9ji0XoiksN5xqLLNPOXS9RTOHKdd";

export const isUserAuthorized = async (request: Request) => {
    const { supabase, headers } = createServerClient(request, request.headers);
    
    const { data, error } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
        throw redirect('/auth/signin')
    }

    if (error) {
        // JWT validation has failed
        throw redirect('/auth/signin')
    }

    return { user, headers }
}

export const isProfileCompleted = async (profile: Profile) => {
  if (
    profile &&
    profile.display_name == null
  ){
    throw redirect('/account/update')
  }
}


type SessionData = {
    password_update_required: boolean;
};

  
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
        name: '__sb_by_example',
        maxAge: 604_800, // one week
        secrets: [cookieSecret]
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
