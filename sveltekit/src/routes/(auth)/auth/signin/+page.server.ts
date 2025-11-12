import { fault, formatError, success } from '$lib/utils';
import { AuthUserSchema, ForgotPasswordSchema } from '$lib/validationSchema';
import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const authType = url.searchParams.get('auth_type') as string;

	return {
		authType
	}
};

export const actions = {
  email_password: async (event) => {
    const {
      request,
      locals: { supabase }
    } = event;

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return fail(400, fault('Email or Password is incorrect.', { email }));
      }

      return fail(500, fault('Server error. Try again later.', { email }));
    }

    redirect(303, '/');
  },
  magic_link: async (event) => {
    const {
      request,
      locals: { supabase }
    } = event;

    const formData = await request.formData();
    const email = formData.get('email') as string;

    try {
      ForgotPasswordSchema.parse({ email });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err);
        return fail(400, { errors, email });
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) {
      return fail(500, fault('Server error. Try again later.', { email }));
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
