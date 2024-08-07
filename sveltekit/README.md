# SvelteKit example

This is a SvelteKit/Supabase project demonstrating how to create a user profile along with how to store sensitive data that only the user of that data should be able to view using a one-to-one relationship and row level security (RLS). This project also demonstrates how to use a Postgres function to update two tables (which is done in a transaction so that if one fails there should be a rollback) using a `.rpc` function call. We also demonstrate how to use a generated column for the slug inside the database by making use of a Postgres function we create.

Features:

- Social auth
- Email/Password auth
- Magic Link auth
- OTP auth
- Password reset
- User Profile

This project makes use of:

- [Zod](https://zod.dev/) Schema Validation library
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side)
- [DaisyUI](https://daisyui.com/)
- [tailwindcss](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) e2e testing
- [pgTAP](https://pgtap.org/) Postgres unit testing
- [Tailwind Profile from Codepen](https://codepen.io/ScottWindon/pen/XWdbPLm)

## Getting started

You can get started with this locally by using the Supabase CLI. Make sure you have the CLI installed before continuing. You can find installation instructions [here](https://supabase.com/docs/guides/cli).

Create a copy of this project using the commands below:

```bash
npx degit silentworks/supabase-by-example/sveltekit project-name
cd project-name
npm install # or pnpm install or yarn install
```

Run the command below to start your local Supabase docker instance

```bash
npx supabase start
```

Copy `.env.example` file and rename it `.env`. Now copy the credentials you were given when you ran `npx supabase start` into this file.

> Be sure to take a peek at the `.sql` files inside the `supabase/migrations` and `supabase/tests` directory. You can run the supabase tests by calling `npx supabase test db`.

Now we can start the project dev server:

```bash
npm run dev # or yarn dev or pnpm dev
```

We can now navigate to the `/auth/signup` url to create an account.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
