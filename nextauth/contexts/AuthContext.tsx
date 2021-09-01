import { createContext, ReactNode } from "react";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  // tipagem quando o compoente pode receber qualquer coisa dentro dele
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  //A função tem q ser async por causa que retorno uma promisse
  async function signIn({ email, password }: SignInCredentials) {
    console.log(email, password);
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
