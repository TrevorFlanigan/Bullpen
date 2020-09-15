import mongoose from "mongoose";
import express from "express";
import User from "../schemas/User";
const router = express.Router();

router.post("/createUser", async (req, res) => {
  let body = req.body;
  const user = await User.findOne({ uri: body.uri });
  console.log("/createUser");

  console.log(body.images);

  if (user) {
    console.log("user already exists");
    console.log(user);
    res.status(302).send("User already exists");
  } else {
    try {
      console.log("Creating new User");

      let newUser = new User({
        display_name: body.display_name,
        followers: body.followers,
        href: body.href,
        id: body.id,
        images: body.images,
        uri: body.uri,
      });
      console.log(newUser);
      await newUser.save();
      res.json(body.id);
    } catch (e) {
      res.status(500).send("Failed to create user, please try again");
    }
  }
});
export default router;
