import * as React from "react";
import Cookies from "js-cookie";
interface ILoginButtonProps {}

interface ILoginButtonState {}

export default class LoginButton extends React.Component<
  ILoginButtonProps,
  ILoginButtonState
> {
  public render() {
    return (
      <button
        style={{ alignSelf: "flex-end", marginRight: 10 }}
        onClick={async () => {
          const url = "https://www.spotify.com/logout/";
          const spotifyLogoutWindow = await window.open(
            url,
            "Spotify Logout",
            "width=700,height=500,top=40,left=40"
          );
          setTimeout(() => spotifyLogoutWindow?.close(), 1);
          Cookies.remove("user");
          Cookies.remove("accessToken");
          window.location.reload();
        }}
      >
        Log Out
      </button>
    );
  }
}
