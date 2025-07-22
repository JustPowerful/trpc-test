// Create a trpc context
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
// this function will create a user context based on the returned value
export async function createContext({ req }: FetchCreateContextFnOptions) {
  async function getUserFromHeader() {
    if (req.headers.get("authorization")) {
      // const user = {
      //   id: 1,
      //   firstname: "Foulen",
      //   lastname: "Ben Foulen",
      //   email: "test@gmail.com",
      // };
      // return user;
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) {
        return null;
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
          email: string;
        };
        const userData = await db
          .select()
          .from(user)
          .where(eq(user.id, decoded.id));
        if (userData.length < 1) {
          return null;
        }
        // pick only the fields we need
        return {
          id: userData[0].id,
          email: userData[0].email,
          firstname: userData[0].firstname,
          lastname: userData[0].lastname,
        };
      } catch (error) {
        console.error("Error verifying token:", error);
        return null;
      }
    }

    return null;
  }
  const userData = await getUserFromHeader();

  // needs to be returned as an object
  return {
    user: userData,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
