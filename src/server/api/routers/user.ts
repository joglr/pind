import { createTRPCRouter, publicProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  })
})
