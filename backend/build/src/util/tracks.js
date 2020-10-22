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
const mapToSet_1 = __importDefault(require("./mapToSet"));
const playlists_1 = require("./playlists");
const longHistoryTracks = (accessToken) => {
    return node_fetch_1.default("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
exports.longHistoryTracks = longHistoryTracks;
const mediumHistoryTracks = (accessToken) => {
    return node_fetch_1.default("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
exports.mediumHistoryTracks = mediumHistoryTracks;
const shortHistoryTracks = (accessToken) => node_fetch_1.default("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
    method: "get",
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    },
});
exports.shortHistoryTracks = shortHistoryTracks;
const recentlyPlayedTracks = (accessToken) => node_fetch_1.default("https://api.spotify.com/v1/me/player/recently-played", {
    method: "get",
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    },
});
exports.recentlyPlayedTracks = recentlyPlayedTracks;
const getAllTracksFromTimeFrame = (accessToken, timeFrame) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield node_fetch_1.default(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeFrame}`, {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        let json = yield res.json();
        let tracks = yield mapToSet_1.default(json.items);
        let next = json.next;
        let allTracks = yield playlists_1.getAllFromNext(accessToken, next, tracks);
        return allTracks;
    }
    else {
        throw new Error("Failed to get tracks from time frame");
    }
});
exports.getAllTracksFromTimeFrame = getAllTracksFromTimeFrame;
const getAllRecentlyPlayed = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield node_fetch_1.default("https://api.spotify.com/v1/me/player/recently-played", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        let json = yield res.json();
        let tracks = yield mapToSet_1.default(json.items);
        let next = json.next;
        let allTracks = yield playlists_1.getAllFromNext(accessToken, next, tracks);
        return allTracks;
    }
    else {
        throw new Error("Failed to get all recent tracks");
    }
});
exports.getAllRecentlyPlayed = getAllRecentlyPlayed;
