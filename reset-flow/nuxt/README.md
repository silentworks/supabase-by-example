# Reset Password and Change Email flow

This is a Nuxt/Supabase project showing how to do password reset and email change.

This project makes use of:

- [Zod](https://zod.dev/) Schema Validation library
- [Nuxt Supabase](https://supabase.nuxtjs.org/)
- [DaisyUI](https://daisyui.com/)
- [tailwindcss](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) e2e testing

## Getting Started

You can get started with this locally by using the Supabase CLI. Make sure you have the CLI installed before continuing. You can find installation instructions [here](https://supabase.com/docs/guides/cli).

Create a copy of this project using the commands below:

```bash
npx degit supabase-community/supabase-by-example/reset-flow/nuxt project-name
cd project-name
npm install # or pnpm install or yarn install
```

Run the command below to start your local Supabase docker instance

```bash
npx supabase start
```

Copy `.env.example` file and rename it `.env`. Now copy the credentials you were given when you ran `supabase start` into this file.

Now we can start the project dev server:

```bash
npm run dev # or yarn dev or pnpm dev
```

We can now navigate to the `/auth/signup` url to create an account.

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.