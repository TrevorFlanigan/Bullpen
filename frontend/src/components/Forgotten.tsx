import * as React from "react";
import Cookies from "js-cookie";
import SongCard from "./SongCard";
import WithWidth, { isWidthDown, isWidthUp } from "@material-ui/core/withWidth";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { withTheme } from "@material-ui/core";
import Theme from "./Theme";
interface IForgottenProps {
  width: Breakpoint;
}

interface IForgottenState {
  tracks: [any];
  index: Number;
  index1: Number;
  index2: Number;
}

class Forgotten extends React.Component<IForgottenProps, IForgottenState> {
  state = {
    tracks: [] as any,
    index: 0,
    index1: 1,
    index2: 2,
  };
  async componentDidMount() {
    let items = this.getForgottenFromDB();

    let [tracks] = await Promise.all([items]);
    this.setState(() => ({ tracks: tracks }));
    console.log(this.state.tracks);
  }

  getForgottenFromDB = async () => {
    let user = JSON.parse(Cookies.get("user") || "");

    console.log(Cookies.get("accessToken"));

    let res = await fetch(
      `http://localhost:4000/api/music/forgottenDB?uid=${user.id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let json = await res.json();
    this.setState(() => ({ tracks: json }));
    console.log(json[0]);

    return json;
  };

  incrementIndex = async (index: Number) => {
    let nextIndex =
      Math.max(this.state.index, this.state.index1, this.state.index2) + 1;
    if (index == 0) {
      this.setState({
        index: nextIndex,
      });
    }
    if (index == 1) {
      this.setState({
        index1: nextIndex,
      });
    }
    if (index == 2) {
      this.setState({
        index2: nextIndex,
      });
    }
  };

  removeSong = async (id: string, index: Number) => {
    let user = JSON.parse(Cookies.get("user") || "");
    if (!user.id) return;
    this.incrementIndex(index);

    let res = await fetch(
      `http://localhost:4000/api/music/forgotten?uid=${user.id}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deleteIds: [id],
        }),
      }
    );

    let json = await res.json();
  };

  heart = async (id: string, index: number) => {
    console.log(id);

    let user = JSON.parse(Cookies.get("user") || "");
    if (!user.id) return;
    this.incrementIndex(index);

    let res = await fetch(
      `http://localhost:4000/api/music/addforgotten?uid=${user.id}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toAdd: [id],
        }),
      }
    );

    console.log(await res.json());

    console.log("done");
  };

  public render() {
    let width = this.props.width;
    let big = isWidthUp("xl", width);
    let large = isWidthUp("lg", width);
    if (!this.state.tracks.length)
      return (
        <section
          className="section parallax bg2 App-subtitle flexcolumn App-subtitle"
          style={{ justifyContent: "space-between", height: "100%" }}
        >
          <h1 style={{ margin: 0 }}>Your Old Flames</h1>
          <p>We are looking for more old flames to suggest! Come back later</p>
        </section>
      );
    if (this.state.tracks.length) {
      return (
        <section
          className="section parallax bg2 App-subtitle2 flexcolumn App-subtitle"
          style={{ justifyContent: "center", height: "100%" }}
        >
          <h1 style={{ margin: 0 }}>Your Old Flames</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <div className="parallax songCard">
              {this.state.tracks.length > 0 && (
                <SongCard
                  track={this.state.tracks[this.state.index]}
                  heart={(e: any) => this.heart(e, 0)}
                  remove={(e: any) => this.removeSong(e, 0)}
                />
              )}
            </div>
            <div className="parallax songCard">
              {large && this.state.tracks.length > 1 && (
                <SongCard
                  track={this.state.tracks[this.state.index1]}
                  heart={(e: any) => this.heart(e, 1)}
                  remove={(e: any) => this.removeSong(e, 1)}
                />
              )}
            </div>
            <div className="songCard parallax">
              {big && this.state.tracks.length > 2 && (
                <SongCard
                  track={this.state.tracks[this.state.index2]}
                  heart={(e: any) => this.heart(e, 2)}
                  remove={(e: any) => this.removeSong(e, 2)}
                />
              )}
            </div>
          </div>
        </section>
      );
    }
  }
}

export default WithWidth()(withTheme(Forgotten));
