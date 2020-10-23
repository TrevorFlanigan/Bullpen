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
const testAccessToken = (accessToken, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let response = yield node_fetch_1.default("https://api.spotify.com/v1/me/", {
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    let json = yield response.json();
    if (((_a = json.error) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // res.status(401).json({ error: "Expired access token" });
        return false;
    }
    return true;
});
exports.default = testAccessToken;
