import { createCookie, redirect } from "@remix-run/node";
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

export const passwordUpdateCookie = createCookie("password_update_required", {
    maxAge: 604_800, // one week
});

export const isPasswordUpdateRequired = async (request: Request) => {
    const cookie = (await passwordUpdateCookie.parse(request.headers.get('Cookie'))) || {};

    if (cookie.password_update_required) {
        throw redirect('/account/update-password')
    }
}

export const passwordUpdateRequired = async (headers: Headers) => {
    headers.append('Set-Cookie', await passwordUpdateCookie.serialize({
        password_update_required: true
    }));

    return headers;
}

export const passwordUpdated = async (request: Request, headers: Headers) => {
    const cookie = (await passwordUpdateCookie.parse(request.headers.get('Cookie'))) || {};
    cookie.password_update_required = false;
    headers.append('Set-Cookie', await passwordUpdateCookie.serialize(cookie));

    return headers;
}
