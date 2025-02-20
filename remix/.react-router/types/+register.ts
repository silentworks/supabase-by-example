import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/u/:slug": {
    "slug": string;
  };
  "/account/update-password": {};
  "/account/update-email": {};
  "/account/update-phone": {};
  "/account": {};
  "/account/update": {};
  "/auth": {};
  "/auth/forgotpassword": {};
  "/auth/verify-token": {};
  "/auth/:provider": {
    "provider": string;
  };
  "/auth/callback": {};
  "/auth/confirm": {};
  "/auth/signout": {};
  "/auth/signin": {};
  "/auth/signup": {};
};