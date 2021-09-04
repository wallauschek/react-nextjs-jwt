import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

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

    return await fn(ctx);
  };
}
