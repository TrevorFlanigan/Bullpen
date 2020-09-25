import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import users from "./routes/users";
import music from "./routes/music";
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.use("/api/users", users);
app.use("/api/music", music);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bullpen", {
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

connectDB();
export default app;
