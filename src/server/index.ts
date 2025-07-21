import { router } from "./trpc";

import { todoRouter } from "./routes/todo";
import { testRouter } from "./routes/test";

export const appRouter = router({
  todo: todoRouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
