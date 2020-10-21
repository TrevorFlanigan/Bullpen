import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import users from "./routes/users";
import music from "./routes/music";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

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
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

if (process.env.NODE_ENV === "test")
  connectDB("mongodb://localhost:27017/bullpen-test");
else {
  connectDB();
}
export default app;
