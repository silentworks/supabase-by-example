import { redirect } from "react-router";

export const loader = async () => {
  throw redirect('/auth/signin', 302);
};
  