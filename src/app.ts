import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "@/config/index";
import routes from "@/routes/index";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(
  cors({
    origin: config.cors.origin,
  }),
);

app.use(express.json());

app.get("/api", (_req: Request, res: Response) => {
  res.send(`Selamat datang di API akuhhh`);
});

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
