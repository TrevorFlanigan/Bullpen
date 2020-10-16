"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediumHistoryTracks = exports.recentlyPlayedTracks = exports.shortHistoryTracks = exports.longHistoryTracks = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
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
