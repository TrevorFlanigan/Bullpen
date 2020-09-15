import { Server } from "http";
import app from "./src/server";
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT} ⚡️`);
});
