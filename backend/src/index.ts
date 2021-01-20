import app from "./server";
import dotenv from "dotenv";
import sslRedirect from "heroku-ssl-redirect"
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(sslRedirect());

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on port ${PORT} ⚡️`);
});
