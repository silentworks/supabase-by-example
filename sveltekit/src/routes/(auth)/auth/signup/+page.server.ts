import { fault, formatError, success } from '$lib/utils';
import { AuthUserSchema } from '$lib/validationSchema';
import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { Actions } from './$types';

export const actions = {
  email_password: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      AuthUserSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err);
        return fail(400, { errors, email });
      }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback?next=/account/update`
      }
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return fail(400, fault('Invalid credentials.', { email }));
      }

      return fail(500, fault(error.message, { email }));
    }

    return success('Please check your email for a magic link to log into the website.');
  },
  oauth: async ({ url, request, locals: { supabase } }) => {
    const formData = await request.formData();
    const provider = formData.get('provider') as Provider;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${url.origin}/auth/callback`
      }
    });

    if (error) {
      return fail(500, fault('Server error. Try again later.'));
    }

    redirect(303, data.url);
  }
} satisfies Actions;
