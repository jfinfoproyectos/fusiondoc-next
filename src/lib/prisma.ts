import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as {
  prisma_v3: PrismaClient;
};

// Use a versioned key (prisma_v3) to force a new instance when the schema changes in dev
// This ensures that new models like 'docProject' or fields like 'imageUrl' are correctly recognized
const prisma =
  globalForPrisma.prisma_v3 ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v3 = prisma;
}

export { prisma };
export default prisma;