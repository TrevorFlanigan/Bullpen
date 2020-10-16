import {v4 as uuidv4} from "uuid";
import fetch from "node-fetch"
const scopes =
          "user-read-private user-top-read playlist-modify-public user-read-recently-played";
let getLoginUrl = async (state:string) => {
    let response = await fetch(`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&state=${state}&scope=${encodeURIComponent(scopes)}`);
    return response.url;
}

let refreshAccessToken = async (refreshToken: string) => {
    let b64 = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");
    let response = await fetch("https://accounts.spotify.com/api/token", {
        method: "post",
        headers : {
            "Content-Type":"application/json",
            Authorization: `Bearer ${b64}`
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
      code: refreshToken,
      redirect_uri: process.env.REDIRECT_URI,
        })
    })
}


export {getLoginUrl, refreshAccessToken};