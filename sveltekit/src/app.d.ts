import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './lib/schema';
import { Cookies } from '@sveltejs/kit';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
			// cookies: Array<{ name: string; value: string }>;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
