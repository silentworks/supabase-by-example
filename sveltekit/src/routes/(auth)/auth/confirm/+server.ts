import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { passwordUpdateRequired } from '$lib/session';

export const GET = async (event) => {
	const {
		url,
		cookies,
		locals: { supabase }
	} = event;
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as EmailOtpType;
	const next = url.searchParams.get('next') ?? '/';

	const redirectTo = url
	redirectTo.pathname = next
	redirectTo.searchParams.delete('token_hash')
	redirectTo.searchParams.delete('type')

	if (token_hash && type) {
	  if (type === 'recovery') {
      passwordUpdateRequired(cookies);
    }
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (!error) {
			redirectTo.searchParams.delete('next')
		}
	}

	redirect(303, redirectTo);
};
