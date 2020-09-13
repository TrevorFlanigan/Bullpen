import * as React from "react";
import Cookies from "js-cookie";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

interface IHomeProps {}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  public render() {
    return (
      <div className="wrapper App">
        <section className="section parallax bg1 flexcolumn">
          {Cookies.get("accessToken") && <LogoutButton />}
          <h1 className="App-title">The Bullpen</h1>
          {!Cookies.get("accessToken") && <LoginButton />}
        </section>
        <section className="section static">
          <h1>Your Discoveries</h1>
        </section>
        <section className="section parallax bg2">
          <h1>Fluffy Kitten</h1>
        </section>
      </div>
    );
  }
}
