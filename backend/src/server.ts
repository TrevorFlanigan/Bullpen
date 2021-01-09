import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import users from "./routes/users";
import music from "./routes/music";
import playlists from "./routes/playlists";

import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/playlists", playlists);
app.use("/api/users", users);
app.use("/api/music", music);

const connectDB = async (url: string = process.env.MONGODB_URI as string) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
    console.log(process.env.NODE_ENV);
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

if (process.env.NODE_ENV === "production") {
  console.log(path.resolve(__dirname, "..", "public"));

  app.use(express.static(path.resolve(__dirname, "..", "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
  });
}
export default app;
