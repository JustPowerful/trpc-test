import { protectedProcedure, router } from "../trpc";

export const testRouter = router({
  hello: protectedProcedure.query(({ ctx: { user } }) => {
    // return a "Hello World!" message
    return `Hello, ${user.firstname}`;
  }),
});
