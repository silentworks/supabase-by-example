import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { supabase, getSession } }) => {
		const { user } = await getSession();

		if (user) {
			await supabase.auth.signOut();
			redirect(303, '/auth/signin');
		}
	}
};
