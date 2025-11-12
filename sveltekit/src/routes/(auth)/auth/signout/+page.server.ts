import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clearPasswordUpdateCookie } from '$lib/session';

export const actions = {
  default: async ({ cookies, locals: { supabase, getSession } }) => {
    const { user } = await getSession();

    if (user) {
      await supabase.auth.signOut();
      clearPasswordUpdateCookie(cookies)
      redirect(303, '/auth/signin');
    }
  }
} satisfies Actions;
