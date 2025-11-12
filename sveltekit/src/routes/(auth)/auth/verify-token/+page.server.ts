import { fault, formatError } from '$lib/utils';
import { AuthUserWithTokenSchema } from '$lib/validationSchema';
import type { EmailOtpType } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { Actions } from './$types';

export const load = async (event) => {
	const { url } = event;
	const type = (url.searchParams.get('type')  ?? "email") as EmailOtpType;

	return {
		type
	}
};

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const token = formData.get('token') as string;
    const type = (formData.get('type') ?? "email") as EmailOtpType;

    try {
      AuthUserWithTokenSchema.parse({ email, token });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err);
        return fail(400, { errors, email });
      }
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });

    if (error) {
      return fail(500, fault(error.message, { email }));
    }

    redirect(307, '/');
  }
} satisfies Actions;
