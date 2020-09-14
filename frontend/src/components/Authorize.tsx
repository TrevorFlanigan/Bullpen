import * as React from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
interface IAuthorizeProps {}

interface IAuthorizeState {}

export default class Authorize extends React.Component<
  IAuthorizeProps,
  IAuthorizeState
> {
  componentDidMount() {
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      let accessToken = accessTokenMatch[1];
      let expiresIn = expiresInMatch[1];
      Cookies.set("accessToken", accessToken);
      window.setTimeout(() => {
        accessToken = "";
        Cookies.remove("accessToken");
        Cookies.remove("user");
      }, Number.parseInt(expiresIn) * 1000);
      window.history.pushState("Access Token", "", "/");
    }
  }
  public render() {
    if (Cookies.get("accessToken")) return <Redirect to="/" />;
    else
      return (
        <div>
          <div style={{ display: "none" }}>hi</div>
          {window.location.reload()}
        </div>
      );
  }
}
