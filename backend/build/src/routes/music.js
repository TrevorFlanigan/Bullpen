"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../schemas/User"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const mapToSet_1 = __importDefault(require("../util/mapToSet"));
const testAccessToken_1 = __importDefault(require("../util/testAccessToken"));
const tracks_1 = require("../util/tracks");
const playlists_1 = require("../util/playlists");
const users_1 = __importDefault(require("../util/users"));
const router = express_1.default.Router();
/**
 * Returns the set L ∩ (R ∪ S)', where L is the long-term favorites,
 *  R is recents, and S is medium/short-term favorites
 * @param accessToken spotify accessToken
 * @param uid user id for current user.
 */
router.get("/forgotten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, accessToken } = yield users_1.default(req, res);
    let skippedIds = user.skipped.map((element) => element.id);
    let alreadyAdded = user.oldFavoritePlaylist.map((track) => track.id);
    let recentTrackIds = new Set();
    let mediumTrackIds = new Set();
    let longTrackIds = new Set();
    let shortTrackIds = new Set();
    let longHistory = tracks_1.longHistoryTracks(accessToken);
    let mediumHistory = tracks_1.mediumHistoryTracks(accessToken);
    let shortHistory = tracks_1.shortHistoryTracks(accessToken);
    let recentlyPlayed = tracks_1.recentlyPlayedTracks(accessToken);
    let [longRes, shortRes, recentRes, mediumRes] = yield Promise.all([
        longHistory,
        shortHistory,
        recentlyPlayed,
        mediumHistory,
    ]);
    let [longJson, shortJson, recentJson, mediumJson] = yield Promise.all([
        longRes.json(),
        shortRes.json(),
        recentRes.json(),
        mediumRes.json(),
    ]);
    let recentTracks = new Set();
    let longTracks = new Set();
    let mediumTracks = new Set();
    let shortTracks = new Set();
    [longTracks, shortTracks, recentTracks, mediumTracks] = yield Promise.all([
        mapToSet_1.default(longJson.items),
        mapToSet_1.default(shortJson.items),
        mapToSet_1.default(recentJson.items),
        mapToSet_1.default(mediumJson.items),
    ]);
    let shortNext = shortJson.next;
    let longNext = longJson.next;
    let recentNext = recentJson.next;
    let mediumNext = mediumJson.next;
    let shortPromise = playlists_1.getAllFromNext(accessToken, shortNext, shortTracks);
    let longPromise = playlists_1.getAllFromNext(accessToken, longNext, longTracks);
    let mediumPromise = playlists_1.getAllFromNext(accessToken, mediumNext, mediumTracks);
    let recentPromise = playlists_1.getAllFromNext(accessToken, recentNext, recentTracks);
    [shortTracks, longTracks, recentTracks, mediumTracks] = yield Promise.all([
        shortPromise,
        longPromise,
        recentPromise,
        mediumPromise,
    ]);
    if (user)
        user.recentlyPlayed = Array.from(recentTracks);
    for (let track of recentTracks) {
        console.log(track.name);
        recentTrackIds.add(track.id);
    }
    for (let track of shortTracks) {
        shortTrackIds.add(track.id);
    }
    for (let track of longTracks) {
        if (shortTrackIds.has(track.id) ||
            recentTrackIds.has(track.id) ||
            skippedIds.includes(track.id) ||
            alreadyAdded.includes(track.id)) {
            longTracks.delete(track);
        }
    }
    for (let track of mediumTracks) {
        if (shortTrackIds.has(track.id) ||
            recentTrackIds.has(track.id) ||
            skippedIds.includes(track.id) ||
            alreadyAdded.includes(track.id)) {
            mediumTracks.delete(track);
        }
    }
    let final = Array.from(longTracks.values());
    if (!final.length)
        final = Array.from(mediumTracks.values());
    if (user)
        user.oldFavorites = final;
    yield user.save();
    res.status(200).json(final);
}));
/**
 * Endpoint for testing
 */
router.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendStatus(200);
}));
/**
 * Returns the user's recent tracks
 * @param uid spotify user id
 */
router.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Recent getuser");
    let { user, accessToken } = yield users_1.default(req, res);
    let recentlyPlayed = tracks_1.recentlyPlayedTracks(accessToken);
    let [recentRes] = yield Promise.all([recentlyPlayed]);
    let [recentJson] = yield Promise.all([recentRes.json()]);
    let recentNext = recentJson.next;
    let recentTracks = new Set();
    let recentPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        let promises = [new Promise((res) => res())];
        do {
            let promise = new Promise((res) => {
                for (const track of recentJson.items) {
                    recentTracks.add(track.track);
                }
                res();
            });
            recentRes = yield node_fetch_1.default(recentNext, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            recentJson = yield recentRes.json();
            promises.push(promise);
            recentNext = recentJson.next;
        } while (recentNext);
        yield Promise.all(promises);
        console.log("done /recent");
        res();
    }));
    yield Promise.all([recentPromise]);
    res.status(200).json(Array.from(recentTracks.values()));
}));
/**
 * Removes the set L ∩ D, L is long term, D is req.body.delete
 *
 * @param uid user id for current user.
 * @param {String[] | String} body.deleteIds the ids of the songs to delete from old favorites
 */
router.delete("/forgotten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let user = yield User_1.default.findOne({ id: req.query.uid });
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
            }
            else {
                console.log(`skipped ${track.name}:${track.id}`);
            }
            return !deleteIds.includes(track.id);
        });
        if (user)
            user.oldFavorites = newLongTracks;
        res();
    });
    let final = [];
    let promise2 = new Promise((res, rej) => {
        let newSkipped = longTracks.filter((track) => {
            return deleteIds.includes(track.id) && !skippedIds.includes(track.id);
        });
        if (user)
            final = user.skipped.concat(newSkipped);
        if (user)
            user.skipped = final;
        res();
    });
    yield Promise.all([promise1, promise2, user.save()]);
    res.status(200).json(final);
}));
/**
 * Gets the old favorites from the Database.
 *
 * @param uid user id for current user.
 */
router.get("/forgottenDB", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get forgotten from DB");
    let { user } = yield users_1.default(req, res);
    // let user = await User.findOne({ id: req.query.uid });
    // if (!user) {
    //   res.status(500).send({ error: "user not found" });
    //   return
    // }
    res.status(200).json(user.oldFavorites);
}));
/**
 * @param uid user id
 */
router.post("/addforgotten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addforgotten");
    let { user, accessToken } = yield users_1.default(req, res);
    let ids = req.body.toAdd || [];
    let oldFavoritesToAdd = user.oldFavorites.filter((track) => ids.includes(track.id));
    let oldFavoritePlaylist = user.oldFavoritePlaylist || [];
    let oldFavoritePlaylistIds = oldFavoritePlaylist.map((element) => element.id) || [];
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
    playlists_1.addToPlaylist(accessToken, user.oldFavoritePlaylistId, songUris);
    yield user.save();
    res.status(200).json({ msg: "hello" });
}));
/**
 *
 * Query: uid, accessToken
 * Body: Name of playlist
 */
router.post("/makePlaylist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.query.accessToken;
    if (!(yield testAccessToken_1.default(accessToken, req, res))) {
        return;
    }
    let user = yield User_1.default.findOne({ id: req.query.uid });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.sendStatus(200);
}));
/**
 * Query: @param uid user id
 *        @param length does nothing atm. Should limit the length of the discover playlist
 */
router.get("/discover", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, accessToken } = yield users_1.default(req, res);
    let unique = new Set();
    user.shortHistory.forEach((track) => unique.add(track.id));
    user.mediumHistory.forEach((track) => unique.add(track.id));
    user.recentlyPlayed.forEach((track) => unique.add(track.id));
    let seeds = Array.from(unique.values());
    // let seeds = req.body.seed_tracks as string[];
    let length = Number.parseInt(req.query.length);
    if (!length) {
        res.status(400).json({ error: "no length specified" });
        return;
    }
    if (!(seeds === null || seeds === void 0 ? void 0 : seeds.length)) {
        res.status(500).json({ error: "no seeds found" });
        return;
    }
    let numRequests = Math.ceil(seeds.length / 5);
    let limitPerRequest = 10 /* || Math.floor(length / numRequests)*/;
    let promises = [];
    let formatSeeds = (seeds, start, end) => {
        let seedSubset = seeds.slice(start, end);
        return seedSubset.join(",");
    };
    console.log(formatSeeds(seeds, 0, 5));
    for (let i = 0; i < 50; i += 5) {
        let requestUrl = `https://api.spotify.com/v1/recommendations?limit=${limitPerRequest}&seed_tracks=${formatSeeds(seeds, i, i + 5)}`;
        let res = node_fetch_1.default(requestUrl, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        }).catch(e => { throw e; });
        // if (!res.ok) throw new Error("something went wrong");
        // let json = res.json();
        promises.push(res);
    }
    let uniqueIds = new Set();
    let uniqueSongs = new Set();
    let results = yield Promise.all(promises);
    let jsonPromises = results.map(res => res.json());
    let jsons = yield Promise.all(jsonPromises);
    jsons.forEach(object => {
        object.tracks.forEach((track) => {
            if (!uniqueIds.has(track.id)) {
                uniqueIds.add(track.id);
                uniqueSongs.add(track);
            }
        });
    });
    let final = Array.from(uniqueSongs.values());
    res.status(200).json(final);
}));
/**
 * Body: @param {String[]} tracks track ids to add to discover playlist
 */
router.put("/discover", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user, accessToken } = yield users_1.default(req, res);
        let discoverId = user.discoverPlaylistId;
        let tracksToAdd = req.body.tracks;
        let uniqueTracksToAdd = new Set(tracksToAdd);
        let alreadyAdded = new Set();
        user.discoverPlaylist.forEach((track) => {
            alreadyAdded.add(track.id);
            uniqueTracksToAdd.delete(track.id);
        });
        let toAddArray = Array.from(uniqueTracksToAdd.values());
        console.log(toAddArray);
        playlists_1.addToPlaylist(accessToken, discoverId, toAddArray);
        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
exports.default = router;
