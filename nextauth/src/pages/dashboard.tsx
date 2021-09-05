import { GetServerSideProps } from "next";
import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }, []);
  return <h1>Dashboard: {user?.email}</h1>;
}
//Criando rotas para usuário autenticados
export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    try {
      const response = await apiClient.get("/me");
    } catch (error) {
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
    return {
      props: {},
    };
  }
);
