import Cookies from "js-cookie";
let accessToken: string;
let expiresIn: string;
const clientId = "ca1cbc4582c8437d9322b5098114f980";
const redirectURI = "http://localhost:3000/authorize/";

let Spotify = {
  //retrieves the user's access token from the Spotify API
  getAccessToken(testLogin?: Boolean) {
    if (accessToken) {
      return accessToken;
    } else {
      //gets the access token and expiry time as objects from the spotify link
      let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        expiresIn = expiresInMatch[1];
        Cookies.set("accessToken", accessToken);
        window.setTimeout(() => {
          accessToken = "";
          Cookies.remove("accessToken");
          Cookies.remove("user");
        }, Number.parseInt(expiresIn) * 1000);
        window.history.pushState("Access Token", "", "/");
        return accessToken;
      } else {
        if (testLogin) {
          return false;
        }
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        Cookies.remove("accessToken");
        accessToken = "";
        expiresIn = "";
      }
    }
  },

  isLoggedIn() {
    const accessToken = Spotify.getAccessToken(true);
    if (accessToken) return true;
    return false;
  },

  async getUser() {
    console.log("Getting user...");

    if (!Cookies.get(accessToken)) {
      return false;
    }

    let res = await fetch("https://api.spotify.com/v1/me", {
      method: "get",
      headers: {
        Authorization: `Bearer ${Spotify.getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });
    let json = await res.json();
    Cookies.set("user", json);
    console.log(json);
  },
};

export default Spotify;
