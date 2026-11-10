import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		locals: { supabase }
	} = event;

	await supabase.auth.signInAnonymously();

	redirect(303, `/`);
};
