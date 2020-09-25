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
const router = express_1.default.Router();
router.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const user = yield User_1.default.findOne({ uri: body.uri });
    console.log("/createUser");
    console.log(body.images);
    if (user) {
        console.log("user already exists");
        console.log(user);
        res.status(302).send("User already exists");
        return;
    }
    else {
        try {
            console.log("Creating new User");
            let newUser = new User_1.default({
                display_name: body.display_name,
                followers: body.followers,
                href: body.href,
                id: body.id,
                images: body.images,
                uri: body.uri,
            });
            console.log(newUser);
            yield newUser.save();
            res.json(body.id);
        }
        catch (e) {
            res.status(500).send("Failed to create user, please try again");
        }
    }
}));
router.get("/artists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.query.accessToken;
    let userID = req.query.uid;
    let user = yield User_1.default.findOne({ id: userID });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    let artists = new Set();
    console.log("/artists");
    let longHistory = node_fetch_1.default("https://api.spotify.com/v1/me/top/artists?time_range=long_term", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    let shortHistory = node_fetch_1.default("https://api.spotify.com/v1/me/top/artists?time_range=short_term", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
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
