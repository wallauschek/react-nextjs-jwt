import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

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
    return response;
  },
  (error: AxiosError) => {
    // console.log(error.response.status);
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
          });
      } else {
        // deslogar o usuário
      }
    }
  }
);
