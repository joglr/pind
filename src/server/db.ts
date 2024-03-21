import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { env } from "../env/server.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// // Use the hashPassword middleware for all Prisma queries
// prisma.$use(async (params, next) => {
//   // If the operation is a "create" operation for the "User" model
//   if (params.action === "create" && params.model === "User") {
//     console.log("🚀 Creating user");
//     console.log("💩", params.args.data.password);
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     const pw = params.args.data.password as string;
//     // Hash the password with bcrypt
//     // params.args.data.password = await bcrypt.hash(pw, 10);

//     console.log("Hashed", pw, "to", params.args.data.password);
//   }

//   // Call the next middleware or the Prisma client's query method
//   return next(params);
// });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
