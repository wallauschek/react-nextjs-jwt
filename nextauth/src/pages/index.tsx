import { GetServerSideProps } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/Home.module.css";
import { withSSRGuest } from "../utils/withSSRGuest";

export default function Home() {
  const [codigoRubeus, setCodigoRubeus] = useState(0);
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      codigoRubeus,
      password,
    };

    await signIn(data);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="number"
        value={codigoRubeus}
        onChange={(e) => setCodigoRubeus(Number(e.target.value))}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

//Utilizando cookies token do lado do servidor
export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    };
  }
);
