"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortHistoryArtists = exports.getLongHistoryArtists = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const longArtists = (accessToken) => node_fetch_1.default("https://api.spotify.com/v1/me/top/artists?time_range=long_term", {
    method: "get",
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    },
});
exports.getLongHistoryArtists = longArtists;
const shortArtists = (accessToken) => node_fetch_1.default("https://api.spotify.com/v1/me/top/artists?time_range=short_term", {
    method: "get",
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    },
});
exports.getShortHistoryArtists = shortArtists;
