import mongoose from "mongoose";
import express from "express";
import User from "../schemas/User";
import fetch from "node-fetch";
import mapToSet from "../util/mapToSet";
import testAccessToken from "../util/testAccessToken";
import {
  longHistoryTracks,
  shortHistoryTracks,
  recentlyPlayedTracks,
  mediumHistoryTracks,
} from "../util/tracks";
import { addToPlaylist, getAllFromNext } from "../util/playlists";
import { refreshAccessToken } from "../util/spotify";
import getUserAndRefreshToken from "../util/users";
import { json } from "body-parser";
const router = express.Router();

/**
 * Returns the set L ∩ (R ∪ S)', where L is the long-term favorites,
 *  R is recents, and S is medium/short-term favorites
 * @param accessToken spotify accessToken
 * @param uid user id for current user.
 */
router.get("/forgotten", async (req, res) => {
  let { user, accessToken } = await getUserAndRefreshToken(req, res);

  let skippedIds = user.skipped.map((element) => element.id);
  let alreadyAdded = user.oldFavoritePlaylist.map((track) => track.id);

  let recentTrackIds = new Set<any>();
  let mediumTrackIds = new Set<any>();
  let longTrackIds = new Set<any>();
  let shortTrackIds = new Set<any>();

  let longHistory = longHistoryTracks(accessToken);
  let mediumHistory = mediumHistoryTracks(accessToken);

  let shortHistory = shortHistoryTracks(accessToken);
  let recentlyPlayed = recentlyPlayedTracks(accessToken);
  let [longRes, shortRes, recentRes, mediumRes] = await Promise.all([
    longHistory,
    shortHistory,
    recentlyPlayed,
    mediumHistory,
  ]);
  let [longJson, shortJson, recentJson, mediumJson] = await Promise.all([
    longRes.json(),
    shortRes.json(),
    recentRes.json(),
    mediumRes.json(),
  ]);

  let recentTracks = new Set<any>();
  let longTracks = new Set<any>();
  let mediumTracks = new Set<any>();
  let shortTracks = new Set<any>();
  [longTracks, shortTracks, recentTracks, mediumTracks] = await Promise.all([
    mapToSet(longJson.items),
    mapToSet(shortJson.items),
    mapToSet(recentJson.items),
    mapToSet(mediumJson.items),
  ]);

  let shortNext = shortJson.next;
  let longNext = longJson.next;
  let recentNext = recentJson.next;
  let mediumNext = mediumJson.next;

  let shortPromise = getAllFromNext(accessToken, shortNext, shortTracks);
  let longPromise = getAllFromNext(accessToken, longNext, longTracks);
  let mediumPromise = getAllFromNext(accessToken, mediumNext, mediumTracks);
  let recentPromise = getAllFromNext(accessToken, recentNext, recentTracks);

  [shortTracks, longTracks, recentTracks, mediumTracks] = await Promise.all([
    shortPromise,
    longPromise,
    recentPromise,
    mediumPromise,
  ]);

  if (user) user.recentlyPlayed = Array.from(recentTracks);
  for (let track of recentTracks) {
    // console.log(track.name);
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
      longTracks.delete(track);
    }
  }

  for (let track of mediumTracks) {
    if (
      shortTrackIds.has(track.id) ||
      recentTrackIds.has(track.id) ||
      skippedIds.includes(track.id) ||
      alreadyAdded.includes(track.id)
    ) {
      mediumTracks.delete(track);
    }
  }

  let final = Array.from(longTracks.values());

  if (!final.length) final = Array.from(mediumTracks.values());
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
 * @param uid spotify user id
 */
router.get("/recent", async (req, res) => {
  console.log("Recent getuser");

  let { user, accessToken } = await getUserAndRefreshToken(req, res);

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
    console.log("done /recent");

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

  let { user } = await getUserAndRefreshToken(req, res);
  // let user = await User.findOne({ id: req.query.uid });
  // if (!user) {
  //   res.status(500).send({ error: "user not found" });
  //   return
  // }

  res.status(200).json(user.oldFavorites);
});

/**
 * @param uid user id
 */
router.put("/forgotten", async (req, res) => {
  let { user, accessToken } = await getUserAndRefreshToken(req, res);

  let ids = new Set<string>(req.body.tracks);

  let oldFavoritesToAdd = user.oldFavorites.filter((track) =>
    ids.has(track.id)
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

  let songUris = final.map((track) => track.uri);
  addToPlaylist(accessToken, user.oldFavoritePlaylistId, songUris);
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

/**
 * Query: @param uid user id
 *        @param length does nothing atm. Should limit the length of the discover playlist
 */
router.get("/discover", async (req, res) => {
  let { user, accessToken } = await getUserAndRefreshToken(req, res);

  let unique = new Set<any>();
  user.shortHistory.forEach((track) => unique.add(track.id));
  user.mediumHistory.forEach((track) => unique.add(track.id));
  user.recentlyPlayed.forEach((track) => unique.add(track.id));
  let seeds = Array.from(unique.values());
  // let seeds = req.body.seed_tracks as string[];
  let length = Number.parseInt(req.query.length as string);

  if (!length) {
    res.status(400).json({ error: "no length specified" });
    return;
  }

  if (!seeds?.length) {
    res.status(500).json({ error: "no seeds found" });
    return;
  }



  let numRequests = Math.ceil(seeds.length / 5);
  let limitPerRequest = 10  /* || Math.floor(length / numRequests)*/;


  let promises = [];
  let formatSeeds = (seeds: string[], start: number, end: number) => {
    let seedSubset = seeds.slice(start, end);
    return seedSubset.join(",")
  }



  console.log(formatSeeds(seeds, 0, 5));


  for (let i = 0; i < 50; i += 5) {

    let requestUrl = `https://api.spotify.com/v1/recommendations?limit=${limitPerRequest}&seed_tracks=${formatSeeds(seeds, i, i + 5)}`;
    let res = fetch(requestUrl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }).catch(e => { throw e });

    // if (!res.ok) throw new Error("something went wrong");
    // let json = res.json();
    promises.push(res);
  }


  let results = await Promise.all(promises);
  let jsonPromises = results.map(res => res.json());
  let jsons = await Promise.all(jsonPromises);

  if (!jsons) {
    return res.sendStatus(500);
  }

  let { skipped, recentlyPlayed, oldFavoritePlaylist, discoverPlaylist } = user;

  let skippedIds = skipped.map(track => track.id);
  let recentlyPlayedIds = recentlyPlayed.map(track => track.id);
  let oldFavoritePlaylistIds = oldFavoritePlaylist.map(track => track.id);
  let discoverPlaylistIds = discoverPlaylist;

  let uniqueIds = new Set<string>([...skippedIds, ...recentlyPlayedIds, ...oldFavoritePlaylistIds, ...discoverPlaylistIds]);
  let uniqueSongs = new Set<any>();

  console.log("size");
  console.log(uniqueIds.size);


  jsons.forEach(object => {
    object.tracks.forEach((track: any) => {
      if (!uniqueIds.has(track.id)) {
        uniqueIds.add(track.id);
        uniqueSongs.add(track);
      }
      else {
        // console.log(`skipped a track: ${track.name}`);
      }
    })
  });
  let final = Array.from(uniqueSongs.values())
  res.status(200).json(final);


})

/**
 * Body: @param {String[]} tracks track ids to add to discover playlist
 */
router.put("/discover", async (req, res) => {
  try {
    let { user, accessToken } = await getUserAndRefreshToken(req, res);
    let discoverId = user.discoverPlaylistId;
    let tracksToAdd = req.body.tracks;
    let uniqueTracksToAdd = new Set<string>(tracksToAdd);
    let alreadyAdded = new Set<string>();
    user.discoverPlaylist.forEach((track) => {
      alreadyAdded.add(track);
      uniqueTracksToAdd.delete(track);
    });
    let toAddArray: string[] = Array.from(uniqueTracksToAdd.values());


    addToPlaylist(accessToken, discoverId, toAddArray);

    let arr = user.discoverPlaylist;
    arr = arr.concat(req.body.tracks);
    let final = Array.from(new Set<any>(arr).values());

    user.discoverPlaylist = final;

    await user.save();
    res.sendStatus(200);
  }
  catch (e) {
    res.sendStatus(500);
  }
})


export default router;
