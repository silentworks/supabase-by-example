import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;

	await supabase.auth.signInAnonymously();

	redirect(303, `/`);
};
