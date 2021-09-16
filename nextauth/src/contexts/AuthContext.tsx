import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

import { api } from "../services/apiClient";

type User = {
  codigoRubeus: number;
  permissions: string[];
  roles: string[];
};

type SignCredentials = {
  codigoRubeus: number;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  authChannel.postMessage("signOut"); // Menssagem de deslogar usuário

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth"); // iniciando canal de comunicação para outras páginas do navegadores ouvir

    //Chamaar a funcção de acordo  a menssagem
    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;

        case "signIn":
          window.location.replace("http://localhost:3000/dashboard");
          break;

        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    //  Não é possível desestruturar algo que tem o caractere . por isso colocamos entre aspas e atribuímos a uma variável.
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("auth/me")
        .then((response) => {
          
          const { codigoRubeus } = response.data;

          setUser({
            codigoRubeus,
            permissions: ["metrics.list"],
            roles: ['administrator'],
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ codigoRubeus, password }: SignCredentials) {
    try {
      const response = await api.post("/auth/login", {
        codigoRubeus,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      setCookie(undefined, "nextauth.token", accessToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 day
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      setUser({
        codigoRubeus,
        permissions: ["metrics.list"],
        roles: ['administrator'],
      });

      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

      Router.push("/dashboard");
      authChannel.postMessage("signIn"); // menssagem de logar usuário
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}
