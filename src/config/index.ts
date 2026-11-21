import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DATABASE_URL"];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    throw new Error(
      `FATAL: Environment variable '${envName}' is missing in .env file`,
    );
  }
}

export interface AppConfig {
  app: {
    port: number;
    env: string;
    isProd: boolean;
  };
  db: {
    url: string;
  };
  cors: {
    origin: string;
  };
}

export const config: AppConfig = {
  app: {
    port: Number(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production",
  },
  db: {
    url: process.env.DATABASE_URL as string,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

export default config;
