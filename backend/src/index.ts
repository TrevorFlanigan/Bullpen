import app from "./server";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT} ⚡️`);
});
