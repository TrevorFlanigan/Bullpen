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
const User_1 = __importDefault(require("../schemas/User"));
const testAccessToken_1 = __importDefault(require("./testAccessToken"));
const spotify_1 = require("../util/spotify");
/**
 *
 * @param req must have req.query.uid,
 * @param res sends response errors if theres an error
 */
const getUserAndRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findOne({ id: req.query.uid });
    if (!user) {
        console.log("User not found error");
        res.status(404).json({ error: "User not found" });
        // throw new Error("User not found");
        console.log("User not found");
        return { user: null, accessToken: null };
    }
    let accessToken = user.access_token;
    if (!(yield testAccessToken_1.default(accessToken, req, res))) {
        console.log("HAVE TO REFRESH TOKEN");
        yield spotify_1.refreshAccessToken(user.id);
    }
    return { user, accessToken };
});
exports.default = getUserAndRefreshToken;
