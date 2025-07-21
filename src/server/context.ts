// Create a trpc context
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

// this function will create a user context based on the returned value
export async function createContext({ req }: FetchCreateContextFnOptions) {
  async function getUserFromHeader() {
    if (req.headers.get("authorization")) {
      const user = {
        id: 1,
        firstname: "Foulen",
        lastname: "Ben Foulen",
        email: "test@gmail.com",
      };
      return user;
    }

    return null;
  }
  const user = await getUserFromHeader();

  // needs to be returned as an object
  return {
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
