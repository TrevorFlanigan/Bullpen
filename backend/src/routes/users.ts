import fetch from "node-fetch";
import mongoose from "mongoose";
import express from "express";
import User from "../schemas/User";
import testAccessToken from "../testAccessToken";
import mapToSet from "../mapToSet";
import {
  longHistoryTracks,
  recentlyPlayedTracks,
  shortHistoryTracks,
} from "../util/tracks";
import { getLongHistoryArtists, getShortHistoryArtists } from "../util/artists";
import { json } from "body-parser";
import { makePlaylist } from "../util/playlists";
const router = express.Router();

/**
 * @param accessToken Spotify access token
 */
router.post("/createUser", async (req, res) => {
  console.log("/createUser");

  const accessToken: string = req.query.accessToken as string;
  let body = req.body;

  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }

  const user = await User.findOne({ uri: body.uri });

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
        favoriteArtists: [],
        favoriteGenres: [],
        skipped: [],
        oldFavorites: [],
        oldFavoritePlaylist: [],
        discoverPlaylistName: "The Bullpen",
      });
      let artists = new Set<any>();
      let artistIds = new Set<string>();
      let recentTracks = new Set<any>();
      let longTracks = new Set<any>();
      let shortTracks = new Set<any>();
      let recentTrackIds = new Set<any>();
      let longTrackIds = new Set<any>();
      let shortTrackIds = new Set<any>();
      let skippedIds: any[] = [];
      let alreadyAdded: any[] = [];
      let longHistoryArtists = getLongHistoryArtists(accessToken);
      let shortHistoryArtists = getShortHistoryArtists(accessToken);
      let [longResArtists, shortResArtists] = await Promise.all([
        longHistoryArtists,
        shortHistoryArtists,
      ]);
      let [longJsonArtists, shortJsonArtists] = await Promise.all([
        longResArtists.json(),
        shortResArtists.json(),
      ]);

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

      let shortNextTracks = shortJson.next;
      let longNextTracks = longJson.next;
      let recentNext = recentJson.next;

      let shortPromise = new Promise(async (res, rej) => {
        let promises: [Promise<any>] = [new Promise((res) => res())];
        while (shortNextTracks) {
          let shortRes = await fetch(shortNextTracks, {
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
          shortNextTracks = shortJson.next;
        }
        await Promise.all(promises);
        res();
      });
      let longPromise = new Promise(async (res, rej) => {
        let promises: [Promise<any>] = [new Promise((res) => res())];
        while (longNextTracks) {
          let longRes = await fetch(longNextTracks, {
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
          longNextTracks = longJson.next;
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
      let longNext = longJsonArtists.next;
      let shortNext = shortJsonArtists.next;

      for (const artist of longJsonArtists.items) {
        artists.add(artist);
        artistIds.add(artist.id);
      }
      for (const artist of shortJsonArtists.items) {
        if (!artistIds.has(artist.id)) artists.add(artist);
      }
      let longPromiseArtists = new Promise(async (res, rej) => {
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
              artistIds.add(artist.id);
            }
            res();
          });

          promises.push(promise);

          longNext = longJson.next;
        }
        await Promise.all(promises);
        res();
      });
      let shortPromiseArtists = new Promise(async (res, rej) => {
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
              if (!artistIds.has(artist.id)) artists.add(artist);
            }
            res();
          });

          promises.push(promise);
          shortNext = shortJson.next;
        }
        await Promise.all(promises);
        res();
      });

      await Promise.all([
        shortPromiseArtists,
        longPromiseArtists,
        shortPromise,
        longPromise,
        recentPromise,
      ]);

      let faveArtists = Array.from(artists.values());
      newUser.favoriteArtists = faveArtists;
      newUser.favoriteGenres = await getGenres(faveArtists);

      newUser.recentlyPlayed = Array.from(recentTracks);
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
      newUser.oldFavorites = final;

      console.log("working Here");

      let newDiscoverPlaylistRes = await makePlaylist(
        accessToken,
        body.id,
        "The Bullpen"
      );
      console.log(newDiscoverPlaylistRes);

      let newDiscoverPlaylistJson = await newDiscoverPlaylistRes.json();
      newUser.discoverPlaylistId = newDiscoverPlaylistJson.id;

      console.log(body.id);

      let oldFavoriteRes = await makePlaylist(
        accessToken,
        body.id,
        "Old Flames"
      );
      let oldFavoriteJson = await oldFavoriteRes.json();
      console.log("working Here");
      console.log(oldFavoriteJson);


      newUser.oldFavoritePlaylistId = oldFavoriteJson.id;
      console.log("saving");

      await newUser.save();
      res.json(body.id);
    } catch (e) {
      res.status(500).send("Failed to create user, please try again");
    }
  }
});

/**
 * @param accessToken current Spotify access token
 * @param uid user id for current user.
 */
router.get("/artists", async (req, res) => {
  const accessToken: string = req.query.accessToken as string;

  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }

  let userID = req.query.uid;

  let user = await User.findOne({ id: userID });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  let artists = new Set<any>();

  let longHistory = getLongHistoryArtists(accessToken);

  let shortHistory = getShortHistoryArtists(accessToken);

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

/**
 * @param uid user id for current user.
 */
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

/**
 * @param playlistName name to rename discoverPlaylistName to
 * @param uid user id for current user.
 */
router.put("/discoverPlaylistName", async (req, res) => {
  let userID = req.query.uid;
  let user = await User.findOne({ id: userID });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  if (!req.query.playlistName) {
    res.sendStatus(400);
    return;
  }
  user.discoverPlaylistName = req.query.playlistName as string;

  res.sendStatus(200);
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
