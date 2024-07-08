// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL, 
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => {
					return event.cookies.getAll()
				},
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookies) => {
					cookies.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' })
					})
				},
			}
		}
	);

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}
	
		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			// JWT validation has failed
			return { session: null, user: null }
		}
	
		return { session, user }
	};

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.getSession();
	event.locals.session = session;
	event.locals.user = user;
  
	if (!event.locals.session && (event.url.pathname === '/' || event.url.pathname.startsWith('/account'))) {
	  redirect(303, '/auth');
	}
  
	if (event.locals.session && event.url.pathname === '/auth') {
	  redirect(303, '/');
	}
  
	return resolve(event);
}

export const handle: Handle = sequence(supabase, authGuard);
