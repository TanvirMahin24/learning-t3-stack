import { TRPCError } from "@trpc/server";
import { z } from "zod";
import slug from "slug";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const cardRouter = router({
  publishCard: protectedProcedure
    .input(z.object({ website: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { email, image, name } = ctx.session.user;
      const { title, website } = input;

      if (!email || !image || !name) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const card = await ctx.prisma.businessCard.upsert({
        create: {
          title,
          website,
          email,
          name,
          slug: slug(name),
          imgSrc: image,
        },
        update: {
          title,
          website,
          email,
          name,
          slug: slug(name),
          imgSrc: image,
        },
        where: {
          slug: slug(name),
        },
      });

      return card;
    }),

  getCard: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      const card = await ctx.prisma.businessCard.findUnique({
        where: { slug },
      });

      return card;
    }),
});
