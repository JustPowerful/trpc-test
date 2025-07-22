import { router } from "./trpc";

import { todoRouter } from "./routes/todo";
import { testRouter } from "./routes/test";
import { authRouter } from "./routes/auth";

export const appRouter = router({
  auth: authRouter,
  todo: todoRouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
