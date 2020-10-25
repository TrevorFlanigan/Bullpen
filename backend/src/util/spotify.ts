import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch"
import User from "../schemas/User";
const scopes =
    "user-read-private user-top-read playlist-modify-public user-read-recently-played";
let getLoginUrl = async (state: string) => {
    let response = await fetch(`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&state=${state}&scope=${encodeURIComponent(scopes)}&show_dialog=true`);
    return response.url;
}

let refreshAccessToken = async (id: string) => {
    let b64 = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");

    let user = await User.findOne({ id: id });
    if (!user) {
        // throw new Error("Provided user id not in database");
        console.log("Provided user id not in database");
        return;
    }

    console.log("user found");


    const refresh_token = user.refresh_token;

    let body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
    let response = await fetch("https://accounts.spotify.com/api/token", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${b64}`
        },
        body: body
    });

    if (response.ok) {
        let json = await response.json();
        user.access_token = json.access_token;
        await user.save();
    }
    else {
        // throw new Error("Refresh Token Error");
        console.log("refresh token error");

    }


}


export { getLoginUrl, refreshAccessToken };