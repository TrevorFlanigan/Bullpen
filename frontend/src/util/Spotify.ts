import Cookies from "js-cookie";
let accessToken: string;
let expiresIn: string;
const clientId = "ca1cbc4582c8437d9322b5098114f980";
const redirectURI = "http://localhost:3000/authorize/";

let Spotify = {
  //retrieves the user's access token from the Spotify API
  getAccessToken(testLogin?: Boolean) {
    if (accessToken) {
      this.getUser(accessToken);
      return accessToken;
    } else {
      //gets the access token and expiry time as objects from the spotify link
      let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        expiresIn = expiresInMatch[1];
        Cookies.set("accessToken", accessToken);
        window.setTimeout(async () => {
          alert("You are being logged out");
          accessToken = "";
          Cookies.remove("accessToken");
          Cookies.remove("user");
          const url = "https://www.spotify.com/logout/";
          const spotifyLogoutWindow = await window.open(
            url,
            "Spotify Logout",
            "width=100,height=100,top=0,left=0"
          );
          setTimeout(() => spotifyLogoutWindow?.close(), 1);
          window.location.reload();
        }, Number.parseInt(expiresIn) * 1000);
        window.history.pushState("Access Token", "", "/");
        this.getUser(accessToken);
        return accessToken;
      } else {
        if (testLogin) {
          return false;
        }
        let scopes =
          "user-read-private user-top-read playlist-modify-public user-read-recently-played";
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(
          scopes
        )}&redirect_uri=${redirectURI}`;
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

  async getUser(accessToken?: String) {
    console.log("Getting user...");
    let user = Cookies.get("user");
    if (user) {
      return user;
    }
    if (!Cookies.get("accessToken")) {
      return null;
    }

    let res = await fetch("https://api.spotify.com/v1/me", {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken || Spotify.getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });
    let json = await res.json();
    Cookies.set("user", json);
    return json;
  },
};

export default Spotify;
