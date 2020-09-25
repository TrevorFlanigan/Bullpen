import fetch from "node-fetch";
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
    return;
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

router.get("/artists", async (req, res) => {
  const accessToken = req.query.accessToken;
  let userID = req.query.uid;

  let user = await User.findOne({ id: userID });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  let artists = new Set<any>();
  console.log("/artists");

  let longHistory = fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  let shortHistory = fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=short_term",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  let [longRes, shortRes] = await Promise.all([longHistory, shortHistory]);
  let [longJson, shortJson] = await Promise.all([
    longRes.json(),
    shortRes.json(),
  ]);

  let longNext = longJson.next;
  let shortNext = shortJson.next;

  for (const artist of longJson.items) {
    artists.add(artist);
  }
  for (const artist of shortJson.items) {
    artists.add(artist);
  }

  let longPromise = new Promise(async (res, rej) => {
    let promises: [Promise<any>] = [new Promise((res) => res())];
    while (longNext) {
      let longRes = await fetch(longNext, {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      let longJson = await longRes.json();
      let promise = new Promise((res) => {
        for (const artist of longJson.items) {
          artists.add(artist);
        }
        res();
      });

      promises.push(promise);

      longNext = longJson.next;
    }
    await Promise.all(promises);
    res();
  });

  let shortPromise = new Promise(async (res, rej) => {
    let promises: [Promise<any>] = [new Promise((res) => res())];
    while (shortNext) {
      let shortRes = await fetch(shortNext, {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      let shortJson = await shortRes.json();
      let promise = new Promise((res) => {
        for (const artist of shortJson.items) {
          artists.add(artist);
        }
        res();
      });

      promises.push(promise);
      shortNext = shortJson.next;
    }
    await Promise.all(promises);
    res();
  });

  await Promise.all([shortPromise, longPromise]);

  let faveArtists = Array.from(artists.values());
  user.favoriteArtists = faveArtists;
  user.favoriteGenres = await getGenres(faveArtists);
  await user.save();

  res.status(200).json(faveArtists);
});

router.get("/discoverPlaylistName", async (req, res) => {
  let userID = req.query.uid;
  let user = await User.findOne({ id: userID });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  let discoverPlaylistName = user.discoverPlaylistName;

  res.status(200).json({ name: discoverPlaylistName });
});
const getGenres = async (artists: any[]) => {
  let genres = new Map<string, number>();
  artists.forEach((artist) => {
    artist.genres.forEach((genre: string) => {
      let currNum = genres.get(genre) || 0;
      genres.set(genre, currNum + 1);
    });
  });

  const sorted = new Map([...genres.entries()].sort((a, b) => b[1] - a[1]));

  return Array.from(sorted.keys());
};
export default router;
