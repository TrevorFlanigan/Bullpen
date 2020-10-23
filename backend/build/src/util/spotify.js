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
exports.refreshAccessToken = exports.getLoginUrl = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const User_1 = __importDefault(require("../schemas/User"));
const scopes = "user-read-private user-top-read playlist-modify-public user-read-recently-played";
let getLoginUrl = (state) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield node_fetch_1.default(`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&state=${state}&scope=${encodeURIComponent(scopes)}&show_dialog=true`);
    return response.url;
});
exports.getLoginUrl = getLoginUrl;
let refreshAccessToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let b64 = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");
    let user = yield User_1.default.findOne({ id: id });
    if (!user) {
        throw new Error("Provided user id not in database");
    }
    console.log("user found");
    const refresh_token = user.refresh_token;
    let body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
    let response = yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${b64}`
        },
        body: body
    });
    if (response.ok) {
        let json = yield response.json();
        user.access_token = json.access_token;
        yield user.save();
    }
    else {
        throw new Error("Refresh Token Error");
    }
});
exports.refreshAccessToken = refreshAccessToken;
