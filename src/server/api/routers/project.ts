import type { Project } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        ownerId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          pindCount: 0,
          omgangCount: 0,
          ownerId: input.ownerId,
        },
      });
    }),

  archiveProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          archived: true,
        },
      });
    }),

  restoreProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          archived: false,
        },
      });
    }),

  permanentlyDeleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          owner: true,
        },
      });
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      return {
        projects: null,
        archivedProjects: null,
      };
    }
    const [projects, archivedProjects] = (await Promise.all([
      ctx.prisma.project.findMany({
        where: { ownerId: ctx.session.user.id, archived: false },
        orderBy: { updatedAt: "desc" },
      }),
      ctx.prisma.project.findMany({
        where: { ownerId: ctx.session.user.id, archived: true },
        orderBy: { updatedAt: "desc" },
      }),
    ])) as [Project[], Project[]];
    return {
      projects,
      archivedProjects,
    };
  }),

  getAllProjects: publicProcedure.query(({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }
    return ctx.prisma.project.findMany({
      where: {
        ownerId: ctx.session.user.id,
        archived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getArchivedProjects: publicProcedure.query(({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }
    return ctx.prisma.project.findMany({
      where: {
        ownerId: ctx.session.user.id,
        archived: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  updateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
        },
      });
    }),

  increasePindCount: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          pindCount: {
            increment: 1,
          },
        },
      });
    }),
  decreasePindCount: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentValue = await ctx.prisma.project.findFirst({
        where: { id: input.projectId },
      });
      if (currentValue?.pindCount === 0) return currentValue;
      return ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          pindCount: {
            decrement: 1,
          },
        },
      });
    }),

  increaseOmgangCount: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          omgangCount: {
            increment: 1,
          },
        },
      });
    }),

  decreaseOmgangCount: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentValue = await ctx.prisma.project.findFirst({
        where: { id: input.projectId },
      });
      if (currentValue?.omgangCount === 0) return;
      return ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          omgangCount: {
            decrement: 1,
          },
        },
      });
    }),
});
