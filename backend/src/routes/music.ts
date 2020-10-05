import mongoose from "mongoose";
import express from "express";
import User from "../schemas/User";
import fetch from "node-fetch";
import mapToSet from "../mapToSet";
import testAccessToken from "../testAccessToken";
import {
  longHistoryTracks,
  shortHistoryTracks,
  recentlyPlayedTracks,
} from "../util/tracks";
import { access } from "fs";
const router = express.Router();
interface Track {
  name: string;
  id: string;
  uri: string;
}
/**
 * Returns the set L ∩ (R ∪ S)', where L is the long-term favorites,
 *  R is recents, and S is medium/short-term favorites
 * @param accessToken spotify accessToken
 * @param uid user id for current user.
 */
router.get("/forgotten", async (req, res) => {
  const accessToken = req.query.accessToken as string;
  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }
  let user = await User.findOne({ id: req.query.uid });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let skippedIds = user.skipped.map((element) => element.id);
  let alreadyAdded = user.oldFavoritePlaylist.map((track) => track.id);

  let recentTracks = new Set<any>();
  let longTracks = new Set<any>();
  let shortTracks = new Set<any>();

  let recentTrackIds = new Set<any>();
  let longTrackIds = new Set<any>();
  let shortTrackIds = new Set<any>();

  let longHistory = longHistoryTracks(accessToken);
  let shortHistory = shortHistoryTracks(accessToken);
  let recentlyPlayed = recentlyPlayedTracks(accessToken);
  let [longRes, shortRes, recentRes] = await Promise.all([
    longHistory,
    shortHistory,
    recentlyPlayed,
  ]);
  let [longJson, shortJson, recentJson] = await Promise.all([
    longRes.json(),
    shortRes.json(),
    recentRes.json(),
  ]);
  [longTracks, shortTracks, recentTracks] = await Promise.all([
    mapToSet(longJson.items),
    mapToSet(shortJson.items),
    mapToSet(recentJson.items),
  ]);

  let shortNext = shortJson.next;
  let longNext = longJson.next;
  let recentNext = recentJson.next;

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
        for (const track of shortJson.items) {
          shortTracks.add(track);
        }
        res();
      });

      promises.push(promise);
      shortNext = shortJson.next;
    }
    await Promise.all(promises);
    res();
  });
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
        for (const track of longJson.items) {
          longTracks.add(track);
        }
        res();
      });

      promises.push(promise);
      longNext = longJson.next;
    }
    await Promise.all(promises);
    res();
  });
  let recentPromise = new Promise(async (res, rej) => {
    let promises: [Promise<any>] = [new Promise((res) => res())];
    while (recentNext) {
      let recentRes = await fetch(recentNext, {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      let recentJson = await recentRes.json();
      let promise = new Promise((res) => {
        for (const track of recentJson.items) {
          recentTracks.add(track.track);
        }
        res();
      });

      promises.push(promise);
      recentNext = recentJson.next;
    }
    await Promise.all(promises);
    res();
  });

  await Promise.all([shortPromise, longPromise, recentPromise]);
  if (user) user.recentlyPlayed = Array.from(recentTracks);
  for (let track of recentTracks) {
    console.log(track.name);
    recentTrackIds.add(track.id);
  }

  for (let track of shortTracks) {
    shortTrackIds.add(track.id);
  }

  for (let track of longTracks) {
    if (
      shortTrackIds.has(track.id) ||
      recentTrackIds.has(track.id) ||
      skippedIds.includes(track.id) ||
      alreadyAdded.includes(track.id)
    ) {
      console.log("removed track: " + track.name);
      longTracks.delete(track);
    }
  }

  let final = Array.from(longTracks.values());
  if (user) user.oldFavorites = final;

  await user.save();

  res.status(200).json(final);
});

/**
 * Endpoint for testing
 */
router.get("/test", async (req, res) => {
  res.sendStatus(200);
});

/**
 * Returns the user's recent tracks
 * @param accessToken spotify accessToken
 */
router.get("/recent", async (req, res) => {
  const accessToken: string = req.query.accessToken as string;

  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }

  let recentlyPlayed = recentlyPlayedTracks(accessToken);
  let [recentRes] = await Promise.all([recentlyPlayed]);
  let [recentJson] = await Promise.all([recentRes.json()]);

  let recentNext = recentJson.next;
  let recentTracks = new Set<any>();

  let recentPromise = new Promise(async (res, rej) => {
    let promises: [Promise<any>] = [new Promise((res) => res())];
    do {
      let promise = new Promise((res) => {
        for (const track of recentJson.items) {
          recentTracks.add(track.track);
          if (track.track.artists[0].name === "Jaden")
            console.log(track.track.name);
        }
        res();
      });
      recentRes = await fetch(recentNext, {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      recentJson = await recentRes.json();

      promises.push(promise);
      recentNext = recentJson.next;
    } while (recentNext);
    await Promise.all(promises);
    console.log("done");

    res();
  });

  await Promise.all([recentPromise]);

  res.status(200).json(Array.from(recentTracks.values()));
});

/**
 * Removes the set L ∩ D, L is long term, D is req.body.delete
 *
 * @param uid user id for current user.
 * @param {String[] | String} body.deleteIds the ids of the songs to delete from old favorites
 */
router.delete("/forgotten", async (req, res) => {
  console.log("delete /forgotten");

  let deleteIds = req.body.deleteIds;

  if (typeof deleteIds === "string") {
    deleteIds = [deleteIds];
  }
  if (!Array.isArray(deleteIds)) {
    res.status(400).json({
      error: "deleteIds must be a string (id), or an array of strings (ids)",
    });
  }
  let user = await User.findOne({ id: req.query.uid });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let longTracks = user.oldFavorites;
  let skippedIds = user.skipped.map((element) => element.id);

  console.log(deleteIds);

  let newLongTracks;

  let promise1 = new Promise((res, rej) => {
    newLongTracks = longTracks.filter((track) => {
      if (deleteIds.includes(track.id)) {
        console.log(`deleted ${track.name}`);
      } else {
        console.log(`skipped ${track.name}:${track.id}`);
      }
      return !deleteIds.includes(track.id);
    });
    if (user) user.oldFavorites = newLongTracks;

    res();
  });

  let final: any[] = [];

  let promise2 = new Promise((res, rej) => {
    let newSkipped = longTracks.filter((track) => {
      return deleteIds.includes(track.id) && !skippedIds.includes(track.id);
    });

    if (user) final = user.skipped.concat(newSkipped);
    if (user) user.skipped = final;
    res();
  });

  await Promise.all([promise1, promise2, user.save()]);
  res.status(200).json(final);
});

/**
 * Gets the old favorites from the Database.
 *
 * @param uid user id for current user.
 */
router.get("/forgottenDB", async (req, res) => {
  console.log("get forgotten from DB");

  let user = await User.findOne({ id: req.query.uid });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(404).json(user.oldFavorites);
});

/**
 *
 */
router.post("/addforgotten", async (req, res) => {
  console.log(req.query);

  let user = await User.findOne({ id: req.query.uid });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let ids = req.body.toAdd || [];

  let oldFavoritesToAdd = user.oldFavorites.filter((track) =>
    ids.includes(track.id)
  );

  let oldFavoritePlaylist = user.oldFavoritePlaylist || [];
  let oldFavoritePlaylistIds =
    oldFavoritePlaylist.map((element: any) => element.id) || [];

  let final = oldFavoritesToAdd.filter((track) => {
    console.log("adding " + track.name);
    return !oldFavoritePlaylistIds.includes(track.id);
  });

  let finalIds = final.map((track) => track.id);

  user.oldFavoritePlaylist = final.concat(oldFavoritePlaylist);
  user.oldFavorites = user.oldFavorites.filter((track) => {
    if (finalIds.includes(track.id)) {
      console.log(track.name);
    }
    return !finalIds.includes(track.id);
  });

  await user.save();

  res.status(200).json({ msg: "hello" });
});

/**
 *
 * Query: uid, accessToken
 * Body: Name of playlist
 */
router.post("/makePlaylist", async (req, res) => {
  const accessToken = req.query.accessToken as string;
  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }
  let user = await User.findOne({ id: req.query.uid });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.sendStatus(200);
});
export default router;
