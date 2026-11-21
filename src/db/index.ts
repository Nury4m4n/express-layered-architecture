import { config } from "@/config/index.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = config.db.url;

const adapter = new PrismaPg({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({ adapter });

if (!config.app.isProd) {
  globalThis.prisma = prisma;
}

export default prisma;
