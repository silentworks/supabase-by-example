'use server'

import { createClient } from "@/lib/supabase/server"
import { fault, fieldFault, formatError, success } from "@/lib/utils"
import { UpdateEmailSchema, UpdatePasswordSchema, UpdateProfileSchema } from "@/lib/validationSchema"
import { AuthWeakPasswordError } from "@supabase/supabase-js"
import { z } from "zod"

export type FormDataUpdate = z.infer<typeof UpdateProfileSchema>;
export async function update(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const displayName = formData.get('display_name') as string
  const bio = formData.get('bio') as string
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const dob = formData.get('dob') as string
  const profileLocation = formData.get('profile_location') as string

  const validationFields = UpdateProfileSchema.safeParse({ displayName, bio, firstName, lastName, dob, profileLocation });
  if (!validationFields.success) {
    const errs = formatError<FormDataUpdate>(validationFields.error)
    return fieldFault(errs)
  }

  const { error } = await supabase.rpc("update_profile", {
    display_name: displayName,
    bio,
    first_name: firstName,
    last_name: lastName,
    dob,
    profile_location: profileLocation,
  });

  if (error) {
    return fault<FormDataUpdate>(error.message)
  }

  return success<FormDataUpdate>("Your profile was updated successfully.")
}

export type FormDataUpdateEmail = z.infer<typeof UpdateEmailSchema>;
export async function emailUpdate(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const emailConfirm = formData.get('email_confirm') as string

  const validationFields = UpdateEmailSchema.safeParse({ email, emailConfirm });
  if (!validationFields.success) {
    const errs = formatError<FormDataUpdateEmail>(validationFields.error)
    return fieldFault(errs)
  }

  const { error } = await supabase.auth.updateUser({
    email
  });

  if (error) {
    return fault<FormDataUpdateEmail>(error.message)
  }

  return success<FormDataUpdateEmail>("Your email update was successfully initiated. Please check your email to confirm your email change.")
}

export type FormDataUpdatePassword = z.infer<typeof UpdatePasswordSchema>;
export async function passwordUpdate(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string

  const validationFields = UpdatePasswordSchema.safeParse({ password, passwordConfirm });
  if (!validationFields.success) {
    const errs = formatError<FormDataUpdatePassword>(validationFields.error)
    return fieldFault(errs)
  }

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    if (error instanceof AuthWeakPasswordError && error.status === 422) {
      let msg = "Password should contain letters and digits."
      if (error.reasons.includes('length')) {
        msg = error.message.split('.').shift() + " and should contain letters and digits."
      }
      return fault<FormDataUpdatePassword>(msg)
    }
    return fault<FormDataUpdatePassword>(error.message)
  }

  return success<FormDataUpdatePassword>("Your password was updated successfully.")
}
