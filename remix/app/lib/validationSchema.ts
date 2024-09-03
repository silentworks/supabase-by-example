import { z } from "zod";
import { email, password, phone, required } from "./validationRules";

export const AuthUserSchema = z.object({
  email: email(),
  password: password(6),
});

export const AuthUserWithTokenSchema = z.object({
  email: email(),
  token: required("Token"),
});

export const AuthPhoneUserWithTokenSchema = z.object({
  phone: phone(),
  token: required("Token"),
});

export const ValidateEmailSchema = z.object({
  email: email(),
});

export const ForgotPasswordSchema = z.object({
  email: email(),
});

export const UpdatePasswordSchema = z
  .object({
    password: password(6),
    passwordConfirm: password(6, "Confirm Password"),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Password does not match",
        path: ["passwordConfirm"],
      });
    }
  });

export const UpdateEmailSchema = z
  .object({
    email: email(),
    emailConfirm: email("Confirm Email"),
  })
  .superRefine(({ email, emailConfirm }, ctx) => {
    if (email !== emailConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Email Address does not match",
        path: ["emailConfirm"],
      });
    }
  });

export const UpdatePhoneSchema = z
  .object({
    phone: phone(),
    phoneConfirm: phone("Confirm Phone"),
  })
  .superRefine(({ phone, phoneConfirm }, ctx) => {
    if (phone !== phoneConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Phone number does not match",
        path: ["phoneConfirm"],
      });
    }
  });

export const UpdateProfileSchema = z.object({
  displayName: required("Display Name"),
  bio: z.string().optional(),
  firstName: required("First Name"),
  lastName: required("Last Name"),
  dob: required("Date of birth"),
  profileLocation: required("Location"),
});
