import { db } from "@/db/drizzle";
import { todoTask } from "@/db/schema";
import { router, publicProcedure } from "@/server/trpc";
import { desc, eq } from "drizzle-orm";
import z from "zod";

export const todoRouter = router({
  getTodos: publicProcedure.query(async ({ ctx }) => {
    return await db.select().from(todoTask).orderBy(desc(todoTask.createdAt));
  }),
  addTodo: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        completed: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(todoTask).values({
        title: input.title,
        description: input.description,
        completed: input.completed ? 1 : 0,
      });
      return true;
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ input: { id, completed } }) => {
      await db
        .update(todoTask)
        .set({
          completed: completed ? 1 : 0,
        })
        .where(eq(todoTask.id, id));
    }),
});
