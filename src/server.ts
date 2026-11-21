import app from "./app";
import { config } from "@/config/index";

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT} | Mode: ${config.app.env}`);
});
