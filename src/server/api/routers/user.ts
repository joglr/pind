import { compare, hash } from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),
  createUser: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(`➕ "${input.password}"`);
        const hashedPassword = await hash(input.password, 10);
        console.log(`➕ ${hashedPassword}`);
        const compared = await compare(input.password, hashedPassword);
        console.log("🐦", compared);
        const user = await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
          },
        });
        return { success: true, user };
      } catch (error) {
        // $2b$10$G3edI.IJqDXXD69prEP12OJ6cPXzhA7pynzWCjk4rC.e.dFQHDPPG
        // $2b$10$OKXgEyeveD0BLiuQTqf3juCkCqwnJmYK3WJpCdqzQVCMGqjYKphOy
        return { success: false, error };
      }
    }),
  deleteUserData: publicProcedure.mutation(async ({ ctx }) => {
    try {
      console.log("deleteUserData", ctx.session?.user.id);
      await ctx.prisma.project.deleteMany({
        where: {
          ownerId: ctx.session?.user.id,
        },
      });
      await ctx.prisma.user.delete({
        where: {
          id: ctx.session?.user.id,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }),
});
