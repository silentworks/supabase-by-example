// src/routes/+layout.ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import type { Database } from '../lib/schema';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
      })
    : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        cookies: {
          getAll() {
            return data.cookies
          }
        }
      })


	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
