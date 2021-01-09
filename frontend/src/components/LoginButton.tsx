import * as React from "react";
import Button from "@material-ui/core/Button";
import Spotify from "../util/Spotify";
import { withStyles } from "@material-ui/core";
import Cookies from "js-cookie";
import Colors from "./Colors";
interface ILoginButtonProps { }

interface ILoginButtonState { }

const SpotifyLoginButton = withStyles({
  root: {
    minWidth: "250px",
    color: "#fff",
    backgroundColor: Colors.green,
    "&:hover": {
      backgroundColor: Colors.greenHover,
    },
    fontSize: "14px",
    lineHeight: 1,
    borderRadius: "500px",
    transitionProperty: "background-color, box-shadow, filter",
    borderWidth: 0,
    letterSpacing: "2px",
    whiteSpace: "normal",
    padding: "16px 14px 18px",
    fontFamily: "Proxima Nova",
    alignSelf: "center",
  },
})(Button);
export default class LoginButton extends React.Component<
  ILoginButtonProps,
  ILoginButtonState
  > {
  public render() {
    return (
      <SpotifyLoginButton
        onClick={async () => {
          // const accessToken: string = Spotify.getAccessToken() || "";
          // if (accessToken) {
          //   Cookies.set("accessToken", accessToken);
          //   window.location.reload();
          // }

          let res = await fetch(`/api/users/startToken`);
          // let json = await res.json();
          // console.log(json);

          let json = await res.json();
          console.log(json);

          window.location.href = json.url;
        }}
      >
        Login
      </SpotifyLoginButton>
    );
  }
}
