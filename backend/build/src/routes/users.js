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
const node_fetch_1 = __importDefault(require("node-fetch"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../schemas/User"));
const testAccessToken_1 = __importDefault(require("../util/testAccessToken"));
const mapToSet_1 = __importDefault(require("../util/mapToSet"));
const tracks_1 = require("../util/tracks");
const artists_1 = require("../util/artists");
const playlists_1 = require("../util/playlists");
const spotify_1 = require("../util/spotify");
const Transaction_1 = __importDefault(require("../schemas/Transaction"));
const uuid_1 = require("uuid");
const users_1 = __importDefault(require("../util/users"));
const router = express_1.default.Router();
/**
 * @param accessToken Spotify access token
 */
router.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/createUser");
    const accessToken = req.query.accessToken;
    const refreshToken = req.query.refreshToken;
    let body = req.body;
    if (!(yield testAccessToken_1.default(accessToken, req, res))) {
        return;
    }
    let user = yield User_1.default.findOne({ uri: body.uri });
    if (user) {
        console.log("user already exists");
        user.access_token = accessToken;
        user.refresh_token = refreshToken;
        console.log(user.access_token);
        let mediumTracks = yield tracks_1.getAllTracksFromTimeFrame(accessToken, "medium_term");
        let shortTracks = yield tracks_1.getAllTracksFromTimeFrame(accessToken, "short_term");
        let recentTracks = yield tracks_1.getAllRecentlyPlayed(accessToken);
        let short = Array.from(shortTracks.values());
        let medium = Array.from(mediumTracks.values());
        let recent = Array.from(recentTracks.values());
        user.recentlyPlayed = recent;
        user.shortHistory = short;
        user.mediumHistory = medium;
        yield user.save();
        res.status(302).send("User already exists");
        return;
    }
    else {
        try {
            console.log("Creating new User");
            let newUser = new User_1.default({
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
            yield newUser.save();
            let artists = new Set();
            let artistIds = new Set();
            let recentTracks = new Set();
            let longTracks = new Set();
            let shortTracks = new Set();
            let recentTrackIds = new Set();
            let longTrackIds = new Set();
            let shortTrackIds = new Set();
            let skippedIds = [];
            let alreadyAdded = [];
            let longHistoryArtists = artists_1.getLongHistoryArtists(accessToken);
            let shortHistoryArtists = artists_1.getShortHistoryArtists(accessToken);
            let [longResArtists, shortResArtists] = yield Promise.all([
                longHistoryArtists,
                shortHistoryArtists,
            ]);
            let [longJsonArtists, shortJsonArtists] = yield Promise.all([
                longResArtists.json(),
                shortResArtists.json(),
            ]);
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
            let shortNextTracks = shortJson.next;
            let longNextTracks = longJson.next;
            let recentNext = recentJson.next;
            let shortPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
                let promises = [new Promise((res) => res())];
                while (shortNextTracks) {
                    let shortRes = yield node_fetch_1.default(shortNextTracks, {
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
                    shortNextTracks = shortJson.next;
                }
                yield Promise.all(promises);
                res();
            }));
            let longPromise = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
                let promises = [new Promise((res) => res())];
                while (longNextTracks) {
                    let longRes = yield node_fetch_1.default(longNextTracks, {
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
                    longNextTracks = longJson.next;
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
            let longNext = longJsonArtists.next;
            let shortNext = shortJsonArtists.next;
            for (const artist of longJsonArtists.items) {
                artists.add(artist);
                artistIds.add(artist.id);
            }
            for (const artist of shortJsonArtists.items) {
                if (!artistIds.has(artist.id))
                    artists.add(artist);
            }
            let longPromiseArtists = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
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
                        for (const artist of longJson.items) {
                            artists.add(artist);
                            artistIds.add(artist.id);
                        }
                        res();
                    });
                    promises.push(promise);
                    longNext = longJson.next;
                }
                yield Promise.all(promises);
                res();
            }));
            let shortPromiseArtists = new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
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
                        for (const artist of shortJson.items) {
                            if (!artistIds.has(artist.id))
                                artists.add(artist);
                        }
                        res();
                    });
                    promises.push(promise);
                    shortNext = shortJson.next;
                }
                yield Promise.all(promises);
                res();
            }));
            yield Promise.all([
                shortPromiseArtists,
                longPromiseArtists,
                shortPromise,
                longPromise,
                recentPromise,
            ]);
            let faveArtists = Array.from(artists.values());
            newUser.favoriteArtists = faveArtists;
            newUser.favoriteGenres = yield getGenres(faveArtists);
            newUser.recentlyPlayed = Array.from(recentTracks);
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
                    // console.log("removed track: " + track.name);
                    longTracks.delete(track);
                }
            }
            let final = Array.from(longTracks.values());
            newUser.oldFavorites = final;
            let newDiscoverPlaylistJson = yield playlists_1.makePlaylist(accessToken, body.id, "The Bullpen");
            newUser.discoverPlaylistId = newDiscoverPlaylistJson.id;
            console.log(body.id);
            let oldFavoriteJson = yield playlists_1.makePlaylist(accessToken, body.id, "Old Flames");
            newUser.oldFavoritePlaylistId = oldFavoriteJson.id;
            yield newUser.save();
            res.json(body.id);
        }
        catch (e) {
            res.status(500).send("Failed to create user, please try again");
        }
    }
}));
/**
 * @param accessToken current Spotify access token
 * @param uid user id for current user.
 */
router.get("/artists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("artists");
    let { user, accessToken } = yield users_1.default(req, res);
    if (!user || !accessToken) {
        return;
    }
    let artists = new Set();
    let longHistory = artists_1.getLongHistoryArtists(accessToken);
    let shortHistory = artists_1.getShortHistoryArtists(accessToken);
    let [longRes, shortRes] = yield Promise.all([longHistory, shortHistory]);
    let [longJson, shortJson] = yield Promise.all([
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
                for (const artist of longJson.items) {
                    artists.add(artist);
                }
                res();
            });
            promises.push(promise);
            longNext = longJson.next;
        }
        yield Promise.all(promises);
        res();
    }));
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
                for (const artist of shortJson.items) {
                    artists.add(artist);
                }
                res();
            });
            promises.push(promise);
            shortNext = shortJson.next;
        }
        yield Promise.all(promises);
        res();
    }));
    yield Promise.all([shortPromise, longPromise]);
    let faveArtists = Array.from(artists.values());
    user.favoriteArtists = faveArtists;
    user.favoriteGenres = yield getGenres(faveArtists);
    yield user.save();
    res.status(200).json(faveArtists);
}));
/**
 * @param uid user id for current user.
 * @param {"discover | old"} playlist
 */
router.get("/playlistName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, accessToken } = yield users_1.default(req, res);
    if (!user || !accessToken) {
        return;
    }
    let playlist = req.query.playlist;
    if (playlist == "old") {
        res.status(200).json({ name: user.oldFavoritePlaylistName });
        let response = yield node_fetch_1.default(`https://api.spotify.com/v1/playlists/${user.oldFavoritePlaylistId}?fields=name`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        let json = yield response.json();
        if (user.oldFavoritePlaylistName !== json.name) {
            user.oldFavoritePlaylistName = json.name;
            yield user.save();
        }
        return;
    }
    else if (playlist == "discover") {
        res.status(200).json({ name: user.discoverPlaylistName });
        let response = yield node_fetch_1.default(`https://api.spotify.com/v1/playlists/${user.discoverPlaylistId}?fields=name`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        let json = yield response.json();
        if (user.discoverPlaylistName !== json.name) {
            user.discoverPlaylistName = json.name;
            yield user.save();
        }
        return;
    }
    else {
        return res.status(404).json({ message: "invalid playlist option" });
    }
}));
/**
 * @param playlistName name to rename discoverPlaylistName to
 * @param {"discover | old"} playlist playlist to rename
 * @param uid user id for current user.
 */
router.put("/playlistName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("playlistname");
    let { user, accessToken } = yield users_1.default(req, res);
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
    }
    else if (playlist == "discover") {
        id = user.discoverPlaylistId;
    }
    else {
        return res.status(404).json({ message: "invalid playlist option" });
    }
    let result = yield node_fetch_1.default(`https://api.spotify.com/v1/playlists/${id}`, {
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
            user.oldFavoritePlaylistName = newName;
        }
        else if (playlist == "discover") {
            user.discoverPlaylistName = newName;
        }
    }
    yield user.save();
    res.sendStatus(result.status);
}));
router.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("token");
    let code = req.query.code;
    let state = req.query.state;
    let b64 = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");
    console.log(b64);
    let body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
    let response = yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${b64}`
        },
        body: body
    });
    let json;
    if (response.ok) {
        json = yield response.json();
        console.log(json);
        res.status(200).json(json);
    }
    else {
        res.status(500).send({ error: "something went wrong" });
    }
}));
router.get("/startToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("startToken");
    const state = uuid_1.v4();
    let url = yield spotify_1.getLoginUrl(state);
    res.json({ url: url });
    let transaction = new Transaction_1.default({
        state: state
    });
    yield transaction.save();
    console.log("end starttoken");
}));
router.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
const getGenres = (artists) => __awaiter(void 0, void 0, void 0, function* () {
    let genres = new Map();
    artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
            let currNum = genres.get(genre) || 0;
            genres.set(genre, currNum + 1);
        });
    });
    const sorted = new Map([...genres.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(sorted.keys());
});
exports.default = router;
