import fetch from "node-fetch";
import mongoose from "mongoose";
import express from "express";
import User from "../schemas/User";
import testAccessToken from "../util/testAccessToken";
import mapToSet from "../util/mapToSet";
import {
  longHistoryTracks,
  recentlyPlayedTracks,
  shortHistoryTracks,
  getAllTracksFromTimeFrame,
  getAllRecentlyPlayed
} from "../util/tracks";
import { getLongHistoryArtists, getShortHistoryArtists } from "../util/artists";
import { makePlaylist } from "../util/playlists";
import { getLoginUrl, refreshAccessToken } from "../util/spotify";
import Transaction from "../schemas/Transaction";
import { v4 as uuidv4 } from "uuid";
import getUserAndRefreshToken from "../util/users";
const router = express.Router();

/**
 * @param accessToken Spotify access token
 */
router.post("/createUser", async (req, res) => {
  console.log("/createUser");

  const accessToken: string = req.query.accessToken as string;
  const refreshToken: string = req.query.refreshToken as string;
  let body = req.body;

  if (!(await testAccessToken(accessToken, req, res))) {
    return;
  }

  let user = await User.findOne({ uri: body.uri });


  if (user) {
    console.log("user already exists");
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    console.log(user.access_token);


    let mediumTracks = await getAllTracksFromTimeFrame(accessToken, "medium_term");
    let shortTracks = await getAllTracksFromTimeFrame(accessToken, "short_term");
    let recentTracks = await getAllRecentlyPlayed(accessToken);
    let short = Array.from(shortTracks.values());
    let medium = Array.from(mediumTracks.values());
    let recent = Array.from(recentTracks.values());

    user.recentlyPlayed = recent;
    user.shortHistory = short;
    user.mediumHistory = medium;

    await user.save();

    res.status(302).send("User already exists");
    return;
  } else {
    try {
      console.log("Creating new User");

      let newUser = new User({
        access_token: req.query.accessToken,
        refresh_token: req.query.refreshToken,
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

      await newUser.save();


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
          // console.log("removed track: " + track.name);
          longTracks.delete(track);
        }
      }

      let final = Array.from(longTracks.values());
      newUser.oldFavorites = final;

      let newDiscoverPlaylistJson = await makePlaylist(
        accessToken,
        body.id,
        "The Bullpen"
      );

      newUser.discoverPlaylistId = newDiscoverPlaylistJson.id;

      console.log(body.id);

      let oldFavoriteJson = await makePlaylist(
        accessToken,
        body.id,
        "Old Flames"
      );

      newUser.oldFavoritePlaylistId = oldFavoriteJson.id;

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
  console.log("artists");

  let { user, accessToken } = await getUserAndRefreshToken(req, res);
  if (!user || !accessToken) {
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
 * @param {"discover | old"} playlist
 */
router.get("/playlistName", async (req, res) => {
  let { user, accessToken } = await getUserAndRefreshToken(req, res);
  if (!user || !accessToken) {
    return;
  }
  let playlist = req.query.playlist;
  if (playlist == "old") {
    res.status(200).json({ name: user.oldFavoritePlaylistName });

    let response = await fetch(
      `https://api.spotify.com/v1/playlists/${user.oldFavoritePlaylistId}?fields=name`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    let json = await response.json();
    if (user.oldFavoritePlaylistName !== json.name) {
      user.oldFavoritePlaylistName = json.name;
      await user.save();
    }
    return;
  } else if (playlist == "discover") {
    res.status(200).json({ name: user.discoverPlaylistName });

    let response = await fetch(
      `https://api.spotify.com/v1/playlists/${user.discoverPlaylistId}?fields=name`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    let json = await response.json();
    if (user.discoverPlaylistName !== json.name) {
      user.discoverPlaylistName = json.name;
      await user.save();
    }
    return;
  } else {
    return res.status(404).json({ message: "invalid playlist option" });
  }
});

/**
 * @param playlistName name to rename discoverPlaylistName to
 * @param {"discover | old"} playlist playlist to rename
 * @param uid user id for current user.
 */
router.put("/playlistName", async (req, res) => {
  console.log("playlistname");

  let { user, accessToken } = await getUserAndRefreshToken(req, res);
  if (!user || !accessToken) {
    return;
  }

  if (!req.query.playlistName || !req.query.playlist) {
    console.log("No playlist or playlistname");

    res.sendStatus(400);
    return;
  }
  const { playlist } = req.query;
  console.log(playlist);

  const newName = req.query.playlistName;
  let id = "";
  if (playlist == "old") {
    id = user.oldFavoritePlaylistId;
  } else if (playlist == "discover") {
    id = user.discoverPlaylistId;
  } else {
    return res.status(404).json({ message: "invalid playlist option" });
  }

  let result = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: newName,
    }),
  });

  console.log(result.status);

  if (result.status === 200) {
    if (playlist == "old") {
      user.oldFavoritePlaylistName = newName as string;
    } else if (playlist == "discover") {
      user.discoverPlaylistName = newName as string;
    }
  }

  await user.save();
  res.sendStatus(result.status);
});

router.get("/token", async (req, res) => {
  console.log("token");
  let code = req.query.code;
  let state = req.query.state;
  let b64 = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");
  console.log(b64);

  let body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI as string)}`;
  let response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${b64}`
    },
    body: body
  });

  let json: any;
  if (response.ok) {
    json = await response.json();
    console.log(json);
    res.status(200).json(json);
  }
  else {
    res.status(500).send({ error: "something went wrong" })
  }

})

router.get("/startToken", async (req, res) => {
  console.log("startToken");
  const state = uuidv4();
  let url = await getLoginUrl(state);

  res.json({ url: url });
  let transaction = new Transaction({
    state: state
  });



  await transaction.save();
  console.log("end starttoken");

})

router.get("/test", async (req, res) => {
})
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
