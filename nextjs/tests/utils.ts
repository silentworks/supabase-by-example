import type {
  AuthUserSchema,
  ValidateEmailSchema,
} from "@/lib/validationSchema";
import { expect, type Page } from "@playwright/test";
import type { z } from "zod";
import { faker } from "@faker-js/faker";
import { execSync } from "child_process";
import tcpPortUsed from "tcp-port-used";

type AuthUser = z.infer<typeof AuthUserSchema>;
type ForgotPasswordUser = z.infer<typeof ValidateEmailSchema>;
type Auth = AuthUser & { page: Page; prefix?: string };
type ForgotPassword = ForgotPasswordUser & { page: Page; prefix?: string };

export const generateRandomEmail = (prefix = "test") =>
  `${prefix}+${faker.internet.exampleEmail()}`.toLocaleLowerCase();

export const generateRandomDob = () => {
  const dob = faker.date.birthdate({ min: 18, max: 30, mode: "age" });
  return dob.toISOString().split("T")[0];
};

export const generateRandomLocation = () =>
  `${faker.location.city()}, ${faker.location.country()}`;

export async function startSupabase() {
  const inUse = await tcpPortUsed.check(54321);
  if (inUse) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("npx supabase start", { stdio: "ignore" });
}

export async function signUp({ page, email, password, prefix }: Auth) {
  await page.getByRole("link", { name: "Create an account" }).click();
  await page.getByLabel("Email").fill(email);
  await page.keyboard.press("Tab");
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  const successNotice = page.getByText(
    "Please check your email for a magic link to log into the website."
  );
  await expect(successNotice).toHaveCount(1);
  await checkConfirmationEmail(page, prefix);
  const welcomeNotice = page.getByRole("heading", {
    name: `Please complete your profile`,
  });
  await expect(welcomeNotice).toHaveText(`Please complete your profile`);
  const logoutButton = page.getByRole("button", { name: "Sign out" });
  await expect(logoutButton).toHaveCount(1);
}

export async function signIn({ page, email, password }: Auth) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.keyboard.press("Enter");
  const logoutButton = page.getByRole("button", { name: "Sign out" });
  await expect(logoutButton).toHaveText("Sign out");
}

export async function signOut(page: Page) {
  const logoutButton = page.getByRole("button", { name: "Sign out" });
  await expect(logoutButton).toHaveText("Sign out");
  await logoutButton.click();
  await page.waitForURL("/auth/signin");
}

export async function forgotPassword({ page, email, prefix }: ForgotPassword) {
  await page.getByRole("link", { name: "Forgot Password?" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send" }).click();
  const successNotice = page.getByText(
    "Please check your email for a password reset link to log into the website."
  );
  await expect(successNotice).toHaveCount(1);
  await checkResetPasswordEmail(page, prefix);
  await page.waitForURL("/account/update-password");
  const updatePasswordTitle = page
    .locator("h2")
    .filter({
      hasText: "Update Password",
    })
    .first();
  await expect(updatePasswordTitle).toHaveCount(1);
  const logoutButton = page.getByRole("button", { name: "Sign out" });
  await expect(logoutButton).toHaveText("Sign out");
}

async function checkConfirmationEmail(page: Page, prefix = "test") {
  await page.goto(`http://localhost:54324/m/${prefix}`);
  await page.locator(".message-list > :first-child").click();
  await page.getByRole("link", { name: "Confirm your email address" }).click();
}

async function checkResetPasswordEmail(page: Page, prefix = "test") {
  await page.goto(`http://localhost:54324/m/${prefix}`);
  await page.locator(".message-list > :first-child").click();
  await page.getByRole("link", { name: "Reset password" }).click();
}
