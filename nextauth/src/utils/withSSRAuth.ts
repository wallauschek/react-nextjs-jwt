import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

/**
 *
 * @function withSSRGuest uma função que recebe outra função
 * Programação funcional/ pesquisar depois
 * função para usuário não autenticados
 */

//Se não tiver token redirecionar para login
export function withSSRAuth<p>(fn: GetServerSideProps<p>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<p>> => {
    const cookies = parseCookies(ctx);

    if (!cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        // console.log(error instanceof AuthTokenError);
        destroyCookie(ctx, "nextauth.token");
        destroyCookie(ctx, "nextauth.refreshAuth");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  };
}
