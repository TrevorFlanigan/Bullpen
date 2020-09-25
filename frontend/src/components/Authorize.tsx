import * as React from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { CircularProgress } from "@material-ui/core";
import Spotify from "../util/Spotify";
interface IAuthorizeProps {}

interface IAuthorizeState {
  redirect: Boolean;
}

export default class Authorize extends React.Component<
  IAuthorizeProps,
  IAuthorizeState
> {
  state = {
    redirect: Cookies.get("user") && Cookies.get("accessToken") ? true : false,
  };

  createUser = async (user: any) => {
    console.log("res");

    const res = await fetch("http://localhost:4000/api/users/createUser", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: user.display_name,
        followers: user.followers,
        href: user.href,
        id: user.id,
        images: user.images,
        uri: user.uri,
      }),
    });
  };

  async componentDidMount() {
    let user: string = "";
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      let accessToken = accessTokenMatch[1];
      let expiresIn = expiresInMatch[1];
      Cookies.set("accessToken", accessToken);
      user = await Spotify.getUser(accessToken);
      console.log(user);

      window.setTimeout(() => {
        accessToken = "";
        Cookies.remove("accessToken");
        Cookies.remove("user");
      }, Number.parseInt(expiresIn) * 1000);
      window.history.pushState("Access Token", "", "/");
      if (Cookies.get("user") && Cookies.get("accessToken")) {
        await this.createUser(user);
        window.location.reload();
      }
    }
  }
  public render() {
    return (
      <section className="section parallax bg1 flexcolumn">
        {this.state.redirect && <Redirect to="/" />}
        <h1 className="App-title">Authorizing...</h1>
        <CircularProgress />
      </section>
    );
  }
}
