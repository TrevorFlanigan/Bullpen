"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    display_name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    followers: {
        type: Object,
    },
    href: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    images: {
        type: [Object],
    },
    uri: {
        type: String,
        required: true,
    },
    recentlyPlayed: {
        type: [Object],
    },
    shortHistory: {
        type: [Object],
    },
    mediumHistory: {
        type: [Object],
    },
    longHistory: {
        type: [Object],
    },
    favoriteArtists: {
        type: [Object],
    },
    favoriteGenres: {
        type: [Object],
    },
    skipped: {
        type: [Object],
    },
    oldFavorites: {
        type: [Object],
    },
    oldFavoritePlaylist: {
        type: [Object],
    },
    discoverPlaylistName: {
        type: String,
        default: "The Bullpen",
    },
    discoverPlaylistId: {
        type: String,
    },
    discoverPlaylist: {
        type: [Object],
    },
    oldFavoritePlaylistName: {
        type: String,
        default: "Old Flames",
    },
    oldFavoritePlaylistId: {
        type: String,
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    known_tracks: {
        type: [String]
    }
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
