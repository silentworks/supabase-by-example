"use client";
import { formatError } from "@/lib/utils";
import { AuthUserSchema, ValidateEmailSchema } from "@/lib/validationSchema";
import { AuthApiError } from "@supabase/supabase-js";
import { useState, FormEvent } from "react";
import { z, ZodError } from "zod";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type FormData = z.infer<typeof AuthUserSchema>;

interface PasswordFieldType {
  password: string; 
  passwordError?: string; 
  onUpdate: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

const PasswordField = ({password, passwordError, onUpdate}: PasswordFieldType) => {
  return <>
    <div className="form-control">
      <label htmlFor="password" className="label">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        value={password ?? ""}
        onChange={onUpdate}
        className="input input-bordered"
      />
    </div>
    {passwordError ? (
      <InputErrorMessage>{passwordError}</InputErrorMessage>
    ) : null}
  </>
}

export default function SignInForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [errors, setErrors] = useState<FormData>();
  const [message, setMessage] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [magicLink, setMagicLink] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // reset all states
    setFormSuccess(false);
    setErrors(undefined);
    setMessage("");

    const email = formData.email;
    if (!magicLink) {
      // email/password sign in
      const password = formData.password;

      try {
        AuthUserSchema.parse({ email, password });
      } catch (err) {
        if (err instanceof ZodError) {
          const errs = formatError(err) as FormData;
          setErrors(errs);
          return;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error instanceof AuthApiError && error.status === 400) {
          setMessage("Invalid credentials.");
          return;
        }
        setMessage(error.message);
        return;
      }
    } else {
      // magic link sign in
      try {
        ValidateEmailSchema.parse({ email });
      } catch (err) {
        if (err instanceof ZodError) {
          const errs = formatError(err) as FormData;
          setErrors(errs);
          return;
        }
      }

      const { error } = await supabase.auth.signInWithOtp({
        email
      })

      if (error) {
        if (error instanceof AuthApiError && error.status === 400) {
          setMessage("Invalid credentials.");
          return;
        }
        setMessage(error.message);
        return;
      }

      setMessage(
        "Please check your email for a magic link to log into the website."
      );
    }

    // reset form
    setFormData({ email: "", password: "" });
    setFormSuccess(true);
    router.push("/");
  };
  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {message ? (
        <Alert
          className={`${formSuccess ? "alert-info" : "alert-error"} mb-10`}
        >
          {message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Sign in</h2>
      <p className="font-medium mb-4">Hi, Welcome back</p>
      <div className="space-y-2">
        <a
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          href="/auth/github"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-github"></use>
          </svg>
          Continue with GitHub
        </a>
        <a
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          href="/auth/google"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-google"></use>
          </svg>
          Continue with Google
        </a>
      </div>
      <div className="divider text-gray-400 text-sm">or continue with Email</div>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData?.email ?? ""}
            onChange={(ev) =>
              setFormData({ ...formData, email: ev.target.value })
            }
            className="input input-bordered"
          />
        </div>
        {errors?.email ? (
          <InputErrorMessage>{errors?.email}</InputErrorMessage>
        ) : null}
        {!magicLink ? (
          <PasswordField password={formData.password} passwordError={errors?.password} onUpdate={(ev) => {
            setFormData({ ...formData, password: ev.target.value })}} />
        ) : null}
        <div className="form-control flex-row justify-between pt-4">
          <label className="label justify-start cursor-pointer gap-2 text-gray-500">
            <input
              type="checkbox"
              className="toggle toggle-xs"
              onChange={(ev) =>
                setMagicLink(!magicLink)
              }
            />
            Magic link login
          </label>
          {!magicLink ? (
            <Link
              className="block py-2 text-blue-500"
              href="/auth/forgotpassword"
            >
              Forgot Password?
            </Link>
          ) : null}
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Sign in</button>
        </div>
      </form>
      {!magicLink ? (
        <div className="pt-4 text-center">
          Not registered yet?{" "}
          <Link href="/auth/signup" className="underline text-blue-500">
            Create an account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
