const { createServerClient, parseCookieHeader, serializeCookieHeader } = require("@supabase/ssr");

exports.createClient = (
  context,
  {
    supabaseUrl = process.env.SUPABASE_URL,
    supabaseKey = process.env.SUPABASE_ANON_KEY,
  } = {}
) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.req.headers.cookie ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
        )
      },
    },
  });
};
