export class AuthTokenError extends Error {
  constructor() {
    //Super chamado a class PAI que é o error
    super("Error with authentication token.");
  }
}
