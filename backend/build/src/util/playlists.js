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
exports.makePlaylist = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const makePlaylist = (accessToken, uid, name) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("makePlaylist");
    try {
        let res = yield node_fetch_1.default(`https://api.spotify.com/v1/users/${uid}/playlists`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: name,
            }),
        });
        let json = yield res.json();
        console.log("done");
        return json;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.makePlaylist = makePlaylist;
