import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";
import { setCookie, parseCookies } from "nookies";

type SignInCredentials = {
  email: string;
  password: string;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  // tipagem quando o compoente pode receber qualquer coisa dentro dele
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user; // Transformando váriavel em boollean

  //parseCookies => retorna uma lista de todos cookies salvo
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api.get("/me").then((response) => {
        console.log(response);
      });
    }
  }, []);

  //A função tem q ser async por causa que retorno uma promisse
  async function signIn({ email, password }: SignInCredentials) {
    //Tratamento de erro
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      //Desestruturação
      const { token, refreshToken, permissions, roles } = response.data;
      //ladoBrowser, nomeToken , valorToken
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 300 days
        path: "/", // qualquer endereço para aplicação
      });
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 300 days
        path: "/", // qualquer endereço para aplicação
      });

      //Salvando dados do usuário
      setUser({
        email,
        permissions,
        roles,
      });

      //Redirecionando usuário
      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    //Passando as informações do contexto globalmente por toda aplicação
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

//OBS:
// sessionsStorage => saiu da aplicação a sessão apaga
// localStorage => LocalStorage utiliado do lado do Browser, next é executado pelo lado do servidor
// cookies => Utiliza tanto pelo lado browser quanto pelo lado do servidor
