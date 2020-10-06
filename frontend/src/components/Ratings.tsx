import * as React from "react";

interface IRatingsProps {}

interface IRatingsState {}

export default class Ratings extends React.Component<
  IRatingsProps,
  IRatingsState
> {
  public render() {
    return (
      <section className="section static2 App-subtitle flexcolumn">
        <h1>Your Ratings</h1>
        <p style={{ marginTop: 0, fontSize: "80%" }}>
          Decide which songs make it to the show and which ones don't
        </p>
      </section>
    );
  }
}
