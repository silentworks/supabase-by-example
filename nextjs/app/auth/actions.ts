'use server'

import { createClient } from "@/lib/supabase/server"
import { APP_URL, fault, fieldFault, formatError, success } from "@/lib/utils"
import { passwordUpdateRequired } from "@/lib/session";
import { AuthUserSchema, AuthUserWithTokenSchema, ValidateEmailSchema } from "@/lib/validationSchema"
import { AuthApiError, EmailOtpType } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export type FormDataAuthUser = z.infer<typeof AuthUserSchema>;
export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const magicLink = formData.get('magic_link') as string
    const email = formData.get('email') as string
    if (!magicLink) {
        const password = formData.get('password') as string

        const validationFields = AuthUserSchema.safeParse({ email, password });
        if (!validationFields.success) {
            const errs = formatError<FormDataAuthUser>(validationFields.error)
            return fieldFault(errs)
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return fault<FormDataAuthUser>(error.message)
        }
        revalidatePath('/', 'layout')
        redirect('/')
    } else {
        // magic link sign in
        const validationFields = ValidateEmailSchema.safeParse({ email });
        
        if (!validationFields.success) {
            const errs = formatError<FormDataAuthUser>(validationFields.error);
            return fieldFault(errs);
        }

        const { error } = await supabase.auth.signInWithOtp({
            email
        })

        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return fault<FormDataAuthUser>("Invalid credentials.")
            }
            return fault<FormDataAuthUser>(error.message)
        }

        return success<FormDataAuthUser>("Please check your email for a magic link to log into the website.")
    }
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validationFields = AuthUserSchema.safeParse({ email, password });
    if (!validationFields.success) {
        const errs = formatError<FormDataAuthUser>(validationFields.error)
        return fieldFault(errs);
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        if (error instanceof AuthApiError && error.status === 400) {
            return fault<FormDataAuthUser>("Invalid credentials.")
        }
        
        return fault<FormDataAuthUser>(error.message)
    }

    return success<FormDataAuthUser>("Please check your email for a magic link to log into the website.")
}
export type FormDataValidateEmail = z.infer<typeof ValidateEmailSchema>;
export async function forgot(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    const validationFields = ValidateEmailSchema.safeParse({ email });
    if (!validationFields.success) {
        const errs = formatError<FormDataValidateEmail>(validationFields.error)
        return fieldFault(errs)
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_URL}/account/update-password`
    });

    if (error) {
        return fault<FormDataValidateEmail>(error.message)
    }

    return success<FormDataValidateEmail>("Please check your email for a password reset link to log into the website.")
}

export type FormDataAuthUserWithToken = z.infer<typeof AuthUserWithTokenSchema>;
export async function verify(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const authType = formData.get('auth_type') as EmailOtpType
    const next = formData.get('next') as string
    const email = formData.get('email') as string
    const token = formData.get('token') as string

    const validationFields = AuthUserWithTokenSchema.safeParse({ email, token });
    if (!validationFields.success) {
        const errs = formatError<FormDataAuthUserWithToken>(validationFields.error)
        return fieldFault(errs)
    }

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: authType
    });

    if (error) {
        return fault<FormDataAuthUserWithToken>(error.message)
    }

    if (authType === 'recovery') {
      await passwordUpdateRequired()
    }


    revalidatePath('/', 'layout')
    redirect(next)
}
