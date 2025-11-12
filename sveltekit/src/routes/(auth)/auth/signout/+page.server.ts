import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ locals: { supabase, getSession } }) => {
    const { user } = await getSession();

    if (user) {
      await supabase.auth.signOut();
      redirect(303, '/auth/signin');
    }
  }
} satisfies Actions;
