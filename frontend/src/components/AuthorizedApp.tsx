import * as React from "react";
import Cookies from "js-cookie";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import Forgotten from "./Forgotten";
import Ratings from "./Ratings";
import Profile from "./Profile";

interface IHomeProps {}

interface IHomeState {}

const testAccessToken = async (accessToken: string) => {
  let response = await fetch("https://api.spotify.com/v1/me/", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  let json = await response.json();

  if (json.error?.status === 401) {
    return false;
  }
  return true;
};

export default class Home extends React.Component<IHomeProps, IHomeState> {
  componentDidMount() {
    let interval = setInterval(async () => {
      if (!(await testAccessToken(Cookies.get("accessToken") || ""))) {
        console.log("loggin");

        const url = "https://www.spotify.com/logout/";
        const spotifyLogoutWindow = await window.open(
          url,
          "Spotify Logout",
          "width=700,height=500,top=40,left=40"
        );
        spotifyLogoutWindow?.close();
        Cookies.remove("accessToken");
        Cookies.remove("user");
        window.location.reload();
        clearInterval(interval);
      }
    }, 5000);
  }

  public render() {
    let user = Cookies.get("user") || "{}";
    console.log(JSON.parse(user));

    return (
      <div className="wrapper App">
        <section className="section parallax bg1 flexcolumn">
          {Cookies.get("accessToken") && <LogoutButton />}
          <h1 className="App-title">The Bullpen</h1>
          {!Cookies.get("accessToken") && <LoginButton />}
        </section>
        <section className="section static1 App-subtitle flexcolumn">
          <h1>What is the Bullpen?</h1>
          <p style={{ marginTop: 0, fontSize: "80%" }}>
            The bullpen is an interface for users to discover, rate, and add new
            songs to their Spotify libary.
          </p>
        </section>
        <Forgotten />
        <Ratings />
        <Profile />
      </div>
    );
  }
}
