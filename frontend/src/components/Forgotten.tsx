import * as React from "react";
import Cookies from "js-cookie";
import SongCard from "./SongCard";
import WithWidth, { isWidthDown, isWidthUp } from "@material-ui/core/withWidth";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { withTheme, withStyles, Button } from "@material-ui/core";
import Theme from "./Theme";
interface IForgottenProps {
  width: Breakpoint;
}

interface IForgottenState {
  tracks: any[];
  index: Number;
  index1: Number;
  index2: Number;
  disabled: Boolean;
}

const BuildForMe = withStyles({
  root: {
    minWidth: "250px",
    color: "#fff",
    backgroundColor: "#e29670",
    "&:hover": {
      backgroundColor: "#e29670",
    },
    fontWeight: "bold",
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
})(Button)

class Forgotten extends React.Component<IForgottenProps, IForgottenState> {
  state = {
    tracks: [],
    index: 0,
    index1: 1,
    index2: 2,
    disabled: false
  };
  async componentDidMount() {
    let items = this.getForgottenFromDB();

    let [tracks] = await Promise.all([items]);
    this.setState(() => ({ tracks: tracks }));
    console.log(this.state.tracks);
  }
  handleAddAll = async () => {
    let user = JSON.parse(Cookies.get("user") as string);
    let tracksToSend = this.state.tracks.slice(Math.min(this.state.index, this.state.index1, this.state.index2), this.state.tracks.length);

    let idsToSend = tracksToSend.map((track: any) => track.id);
    console.log(idsToSend);

    let res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/music/forgotten?uid=${user.id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tracks: idsToSend
      })
    });

    if (res.ok) {
      this.setState({
        index: this.state.tracks.length,
        index1: this.state.tracks.length,
        index2: this.state.tracks.length,
        disabled: true,
      });
    }
  }

  getForgottenFromDB = async () => {
    let user = JSON.parse(Cookies.get("user") || "");
    let res = await fetch(
      `${process.env.REACT_APP_BACKEND_URI}/api/music/forgottenDB?uid=${user.id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let json = await res.json();

    this.setState(() => ({ tracks: json }));
    if (json.length == 0) {
      console.log("Getting medium term instead");

      let res = await fetch(
        `${process.env.REACT_APP_BACKEND_URI}/api/music/forgotten?uid=${user.id
        }`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      json = await res.json();
      this.setState({ tracks: json });
    }

    return json;
  };

  incrementIndex = (index: Number) => {
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
    this.setState({ tracks: this.state.tracks.slice(index as number, this.state.tracks.length) })


    let res = await fetch(
      `${process.env.REACT_APP_BACKEND_URI}/api/music/forgotten?uid=${user.id}`,
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
      `${process.env.REACT_APP_BACKEND_URI}/api/music/addforgotten?uid=${user.id
      }`,
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

    console.log("done heart");
  };

  public render() {
    let width = this.props.width;
    let big = isWidthUp("xl", width);
    let large = isWidthUp("lg", width);
    if (
      !this.state.tracks.length ||
      Math.min(this.state.index, this.state.index1, this.state.index2) >=
      this.state.tracks.length
    )
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
          <span style={{ height: "auto", display: "flex", justifyContent: "center" }}>
            <BuildForMe disabled={this.state.disabled} variant="contained" onClick={this.handleAddAll}>Add All {this.state.tracks.length - Math.min(this.state.index, this.state.index1, this.state.index2)} Songs</BuildForMe>
          </span>
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
