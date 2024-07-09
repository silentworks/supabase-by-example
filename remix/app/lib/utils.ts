import type { ZodError } from "zod";

export const formatError = (zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {};
  zodError.errors.forEach((err) => {
    const k = err.path.pop() as string;
    if (formattedErrors[k] == null) {
      formattedErrors[k] = err.message;
    }
  });
  return formattedErrors;
};

type SuccessFault<T, R = true | false> = {
  success: R;
  message: string;
  errors?: Record<string, string>;
  data: T
};

interface SuccessFaultArgs<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export const success = <T extends Record<string, unknown> | undefined>({
  message = "",
  data
}: SuccessFaultArgs<T>) => ({
  success: true,
  message,
  errors: undefined,
  data,
}) as SuccessFault<T, true>;

export const fault = <T extends Record<string, unknown> | undefined>({
  message = "",
  errors,
  data
}: SuccessFaultArgs<T>) => ({
  success: false,
  message,
  errors,
  data,
}) as SuccessFault<T, false>;
