import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

//Deixando variavel como let para poder modicar o valor dela
// Como por ex: fazendo refresh do token
let cookies = parseCookies();

export const api = axios.create({
  baseURL: "http://localhost:3333",
  // token para autenticar rotas
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

//Esperando a resposta do back-end
api.interceptors.response.use(
  (response) => {
    return response; //success
  },
  (error: AxiosError) => {
    // reponse deu error
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        //renovar token
        cookies = parseCookies();

        const { "nextauth.refreshToken": refreshToken } = cookies;

        api
          .post("/refresh", {
            refreshToken,
          })
          .then((response) => {
            const token = response.data.token;

            //ladoBrowser, nomeToken , valorToken
            setCookie(undefined, "nextauth.token", token, {
              maxAge: 60 * 60 * 24 * 30, // 300 days
              path: "/", // qualquer endereço para aplicação
            });
            setCookie(
              undefined,
              "nextauth.refreshToken",
              response.data.refresToken,
              {
                maxAge: 60 * 60 * 24 * 30, // 300 days
                path: "/", // qualquer endereço para aplicação
              }
            );

            // api.defaults.headers["Authorization"] = `Bearer ${token}`;
          });
      } else {
        // deslogar o usuário
      }
    }
  }
);
