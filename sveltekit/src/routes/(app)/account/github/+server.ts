import { fault } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;

	const { error } = await supabase.auth.linkIdentity({
		provider: "github",
		options: {
			redirectTo: `${url.origin}/auth/callback`
		}
	});

	if (error) {
		throw fail(500, fault('Server error. Try again later.'));
	}

	redirect(307, '/')
};
