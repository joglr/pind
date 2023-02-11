import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user;
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
