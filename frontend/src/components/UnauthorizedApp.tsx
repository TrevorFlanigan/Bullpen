import * as React from "react";
import Cookies from "js-cookie";
import LoginButton from "./LoginButton";
import { inherits } from "util";
interface IUnauthorizedAppProps {}

interface IUnauthorizedAppState {}

export default class UnauthorizedApp extends React.Component<
  IUnauthorizedAppProps,
  IUnauthorizedAppState
> {
  public render() {
    return (
      <div className="wrapper App">
        <section className="section parallax bg1 flexcolumn">
          <h1 className="App-title">The Bullpen</h1>
          {<LoginButton />}
        </section>
        <section className="section static1 App-subtitle flexcolumn">
          <h1>What is the Bullpen?</h1>
          <p style={{ marginTop: 0, fontSize: "80%" }}>
            The bullpen is an interface for users to discover, rate, and add new
            songs to their Spotify libary.
          </p>
        </section>
        <section className="section parallax bg2 App-subtitle flexcolumn">
          <h1>Your Suggestions</h1>
          <p style={{ marginTop: 0, fontSize: "80%" }}>
            Here you'll find the next songs that you play on repeat!
          </p>
        </section>
        <section className="section static2 App-subtitle flexcolumn">
          <h1>Your Ratings</h1>
          <p style={{ marginTop: 0, fontSize: "80%" }}>
            Decide which songs make it to the show and which ones don't
          </p>
        </section>
        <section className="section parallax bg3 App-subtitle flexcolumn">
          <h1>Your Profile</h1>
          <p style={{ marginTop: 0, fontSize: "80%" }}>
            Choose settings for your new bullpen playlist!
          </p>
          {<LoginButton />}
        </section>
      </div>
    );
  }
}
