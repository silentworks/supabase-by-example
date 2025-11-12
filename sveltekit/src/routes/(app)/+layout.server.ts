import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import get from 'just-safe-get';
import type { Profile, ProfileInfo } from '$lib/utils';
import { isPasswordUpdateRequired } from '$lib/session';

export const load: LayoutServerLoad = async ({ cookies, url, locals: { supabase, getSession } }) => {
	const { session, user } = await getSession();

	if (!session) {
		redirect(307, '/auth/signin');
	}

	// get profile and profile_info
	const { data: profile } = await supabase
		.from('profiles')
		.select(`*, profiles_info(*)`)
		.match({ id: user?.id })
		.maybeSingle();

	// allow only update, update-password, update-email paths
	const allowedPaths = ['/account/update', '/account/update-email', '/account/update-password'];
	if (!allowedPaths.includes(url.pathname)) {
		if (url.pathname !== '/account/update' && profile && profile.display_name == null) {
			redirect(307, '/account/update');
		}
	}

	if (!url.pathname.startsWith('/account/update-password')) {
	  isPasswordUpdateRequired(cookies)
	}

	const profileInfo = get(profile as Profile, 'profiles_info') as ProfileInfo;

	return { profile, profileInfo, website: url.origin };
};
