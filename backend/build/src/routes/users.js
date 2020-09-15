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
exports.default = router;
