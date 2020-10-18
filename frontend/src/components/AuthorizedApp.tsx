import * as React from "react";
import Cookies from "js-cookie";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import Forgotten from "./Forgotten";
import Ratings from "./Ratings";
import Profile from "./Profile";
import Discover from "./Discover";
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
  public render() {
    let user = Cookies.get("user") || "{}";
    console.log(JSON.parse(user));

    return (
      <div className="wrapper App">
        <section className="section parallax bg1 flexcolumn">
          {Cookies.get("user") && <LogoutButton />}
          <h1 className="App-title">The Bullpen</h1>
          {!Cookies.get("user") && <LoginButton />}
        </section>
        <Discover/>
        <Forgotten />
        <Ratings />
        <Profile />
      </div>
    );
  }
}
