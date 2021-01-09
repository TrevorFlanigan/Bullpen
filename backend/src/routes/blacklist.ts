import express from "express";
import getUserAndRefreshToken from "../util/users";

const router = express.Router();


router.post("/", async (req, res) => {

  let { user, accessToken } = await getUserAndRefreshToken(req, res);
  if (!user || !accessToken) {
    return;
  }

  let { playlistIds } = req.body;

  if (!playlistIds) return res.sendStatus(204);
  if (!Array.isArray(playlistIds)) return res.sendStatus(400);

});