import express from "express";
import { Playlist } from "../types";
import { getAllPlaylists } from "../util/playlists";
import getUserAndRefreshToken from "../util/users";

const router = express.Router();
/**
 * @route /playlists
 */
router.get("/", async (req, res) => {
  let { user, accessToken } = await getUserAndRefreshToken(req, res);
  if (!user || !accessToken) {
    return;
  }

  let offset = Number.parseInt(req.query.offset as string);
  let limit = Number.parseInt(req.query.limit as string);

  let response = await getAllPlaylists(
    accessToken,
    offset || undefined,
    limit || undefined
  );

  if (response.ok) {
    let playlists: Playlist[] = await response.json();
    console.log(playlists);
    return res.send(playlists);
  }

  console.log(await response.text());

  return res.sendStatus(500);
});

export default router;
