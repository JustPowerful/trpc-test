import z from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        firstname: z.string({}).min(1, "First name is required"),
        lastname: z.string({}).min(1, "Last name is required"),
        email: z.email({ message: "Invalid email address" }),
        password: z.string({}).min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(
      async ({ ctx, input: { firstname, lastname, email, password } }) => {
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, email));
        if (existingUser.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email already exists",
          });
        }

        // Hash the password before storing it
        const hashedPassword = await argon2.hash(password);

        const newUser = await db
          .insert(user)
          .values({
            firstname,
            lastname,
            email,
            password: hashedPassword,
          })
          .returning();

        return {
          id: newUser[0].id,
          firstname: newUser[0].firstname,
          lastname: newUser[0].lastname,
          email: newUser[0].email,
          createdAt: newUser[0].createdAt,
          updatedAt: newUser[0].updatedAt,
        };
      }
    ),
  login: publicProcedure
    .input(
      z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ ctx, input: { email, password } }) => {
      const userRecord = await db
        .select()
        .from(user)
        .where(eq(user.email, email));
      if (userRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // In real case scenarios, you should hash the password and compare it
      const userData = userRecord[0];

      // Verify the password using argon2
      const isPasswordValid = await argon2.verify(userData.password, password);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: userData.id,
          emit: userData.email,
        },
        process.env.JWT_SECRET!
      );

      return {
        token,
        user: {
          id: userData.id,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
      };
    }),
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const { token } = input;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
          email: string;
        };

        const userRecord = await db
          .select({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })
          .from(user)
          .where(eq(user.id, decoded.id));

        if (userRecord.length === 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid token",
          });
        }

        return {
          user: userRecord[0],
        };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }
    }),
});
