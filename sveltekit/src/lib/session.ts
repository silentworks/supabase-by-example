import { redirect, type Cookies } from "@sveltejs/kit";

export const isPasswordUpdateRequired = (cookies: Cookies) => {
    const session = cookies.get('password_update_required')

    if (session === 'true') {
        redirect(307, '/account/update-password');
    }
}

export const passwordUpdateRequired = (cookies: Cookies) => {
  cookies.set('password_update_required', 'true', { path: '/' });
}

export const clearPasswordUpdateCookie = (cookies: Cookies) => {
  cookies.delete('password_update_required', { path: '/' });
}
