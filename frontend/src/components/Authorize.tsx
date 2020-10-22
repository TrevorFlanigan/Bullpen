import * as React from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { CircularProgress } from "@material-ui/core";
import Spotify from "../util/Spotify";
interface IAuthorizeProps { }

interface IAuthorizeState {
  redirect: Boolean;
}

export default class Authorize extends React.Component<
  IAuthorizeProps,
  IAuthorizeState
  > {
  state = {
    redirect: Cookies.get("user") ? true : false,
  };

  async componentDidMount() {
    let user: any = {};
    let stateMatch = window.location.href.match(/state=([^&]*)/);
    let codeMatch = window.location.href.match(/code=([^&]*)/);

    if (!stateMatch || !codeMatch) return

    let userInfoRes = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/users/token?code=${codeMatch[1]}&state=${stateMatch[1]}`);
    let userInfo = await userInfoRes.json();
    let { access_token, expires_in, refresh_token } = userInfo;
    if (access_token && expires_in) {
      user = await Spotify.getUser(access_token);

      await fetch(
        `${process.env.REACT_APP_BACKEND_URI}/api/users/createUser?accessToken=${access_token}&refreshToken=${refresh_token}`,
        {
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
        }
      );

      console.log("Getting old flames");

      await fetch(
        `${process.env.REACT_APP_BACKEND_URI}/api/music/forgotten?&uid=${user.id}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      window.setTimeout(() => {
        access_token = "";
        Cookies.remove("user");
      }, Number.parseInt(expires_in) * 1000);
      window.history.pushState("Access Token", "", "/");
      if (Cookies.get("user")) {
        window.location.reload();
      }
    }
  }
  public render() {
    return (
      <section
        className="section parallax bg1 flexcolumn"
        style={{ placeItems: "center" }}
      >
        {this.state.redirect && <Redirect to="/" />}
        <h1 className="App-title">Authorizing...</h1>
        <div
          style={{
            display: "flex",
            placeItems: "center",
            placeContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      </section>
    );
  }
}
