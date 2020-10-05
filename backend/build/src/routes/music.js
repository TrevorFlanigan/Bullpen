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
const mapToSet_1 = __importDefault(require("../mapToSet"));
const testAccessToken_1 = __importDefault(require("../testAccessToken"));
const tracks_1 = require("../util/tracks");
const router = express_1.default.Router();
/**
 * Returns the set L ∩ (R ∪ S)', where L is the long-term favorites,
 *  R is recents, and S is medium/short-term favorites
 * @param accessToken spotify accessToken
 * @param uid user id for current user.
 */
router.get("/forgotten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.query.accessToken;
    if (!(yield testAccessToken_1.default(accessToken, req, res))) {
        return;
    }
    let user = yield User_1.default.findOne({ id: req.query.uid });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    let skippedIds = user.skipped.map((element) => element.id);
    let alreadyAdded = user.oldFavoritePlaylist.map((track) => track.id);
    let recentTracks = new Set();
    let longTracks = new Set();
    let shortTracks = new Set();
    let recentTrackIds = new Set();
    let longTrackIds = new Set();
    let shortTrackIds = new Set();
    let longHistory = tracks_1.longHistoryTracks(accessToken);
    let shortHistory = tracks_1.shortHistoryTracks(accessToken);
    let recentlyPlayed = tracks_1.recentlyPlayedTracks(accessToken);
    let [longRes, shortRes, recentRes] = yield Promise.all([
        longHistory,
        shortHistory,
        recentlyPlayed,
    ]);
    let [longJson, shortJson, recentJson] = yield Promise.all([
        longRes.json(),
        shortRes.json(),
        recentRes.json(),
    ]);
    [longTracks, shortTracks, recentTracks] = yield Promise.all([
        mapToSet_1.default(longJson.items),
        mapToSet_1.default(shortJson.items),
        mapToSet_1.default(recentJson.items),
    ]);
    let shortNext = shortJson.next;
    let longNext = longJson.next;
    let recentNext = recentJson.next;
    let shortPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        let promises = [new Promise((res) => res())];
        while (shortNext) {
            let shortRes = yield node_fetch_1.default(shortNext, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            let shortJson = yield shortRes.json();
            let promise = new Promise((res) => {
                for (const track of shortJson.items) {
                    shortTracks.add(track);
                }
                res();
            });
            promises.push(promise);
            shortNext = shortJson.next;
        }
        yield Promise.all(promises);
        res();
    }));
    let longPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        let promises = [new Promise((res) => res())];
        while (longNext) {
            let longRes = yield node_fetch_1.default(longNext, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            let longJson = yield longRes.json();
            let promise = new Promise((res) => {
                for (const track of longJson.items) {
                    longTracks.add(track);
                }
                res();
            });
            promises.push(promise);
            longNext = longJson.next;
        }
        yield Promise.all(promises);
        res();
    }));
    let recentPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        let promises = [new Promise((res) => res())];
        while (recentNext) {
            let recentRes = yield node_fetch_1.default(recentNext, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            let recentJson = yield recentRes.json();
            let promise = new Promise((res) => {
                for (const track of recentJson.items) {
                    recentTracks.add(track.track);
                }
                res();
            });
            promises.push(promise);
            recentNext = recentJson.next;
        }
        yield Promise.all(promises);
        res();
    }));
    yield Promise.all([shortPromise, longPromise, recentPromise]);
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
            console.log("removed track: " + track.name);
            longTracks.delete(track);
        }
    }
    let final = Array.from(longTracks.values());
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
 * @param accessToken spotify accessToken
 */
router.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.query.accessToken;
    if (!(yield testAccessToken_1.default(accessToken, req, res))) {
        return;
    }
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
                    if (track.track.artists[0].name === "Jaden")
                        console.log(track.track.name);
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
        console.log("done");
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
    let user = yield User_1.default.findOne({ id: req.query.uid });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.status(404).json(user.oldFavorites);
}));
/**
 *
 */
router.post("/addforgotten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    let user = yield User_1.default.findOne({ id: req.query.uid });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
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
exports.default = router;
