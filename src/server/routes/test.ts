import { protectedProcedure, router } from "../trpc";

export const testRouter = router({
  hello: protectedProcedure.query(() => {
    // return a "Hello World!" message
    return "Hello World!";
  }),
});
