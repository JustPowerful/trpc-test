import { publicProcedure, router } from "./trpc";
import { db } from "@/db/drizzle";
import { todoTask } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

import { z } from "zod";
import { todoRouter } from "./routes/todo";

export const appRouter = router({
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
