import { GetServerSideProps } from "next";
import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  // Permissão
  const userCanSeeMetrics = useCan({
    permissions: ["metrics.list"],
  });

  useEffect(() => {
    // api
    //   .get("/auth/me")
    //   .then((response) => console.log(response))
    //   .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h1>Dashboard: {user?.codigoRubeus}</h1>
      {userCanSeeMetrics && <div>Métricas</div>}

      <button onClick={signOut}>Sign out</button>
    </>
  );
}
// Criando rotas para usuário autenticados
export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    // const response = await apiClient.get("/auth/me");

    return {
      props: {},
    };
  }
);
