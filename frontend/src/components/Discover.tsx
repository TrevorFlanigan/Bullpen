import * as React from "react";
import {
  Button,
  isWidthUp,
  TextField,
  withTheme,
  withWidth,
  withStyles,
  IconButton,
} from "@material-ui/core";

import Cookies from "js-cookie";
import SongCard from "./SongCard";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Settings } from "@material-ui/icons";
import Blacklist from "./Blacklist";
interface IDiscoverPageProps {
  width: Breakpoint;
}

interface IDiscoverPageState {
  tracks: any[];
  index: Number;
  index1: Number;
  index2: Number;
  size: Number;
  disabled: boolean;
}

const BuildForMe = withStyles({
  root: {
    minWidth: "250px",
    color: "#0",
    backgroundColor: "#e29670",
    "&:hover": {
      backgroundColor: "#e29670",
      filter: "brightness(.8)",
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
    marginLeft: "5px",
    marginRight: "5px",
  },
})(Button);

const FromPlaylist = withStyles({
  root: {
    color: "black",
    backgroundColor: "#70e296",
    "&:hover": {
      backgroundColor: "#70e296",
    },
  },
})(BuildForMe);

class DiscoverPage extends React.Component<
  IDiscoverPageProps,
  IDiscoverPageState
> {
  state = {
    tracks: [],
    index: 0,
    index1: 1,
    index2: 2,
    size: 50,
    disabled: false,
  };

  songRefs = React.createRef();
  async componentDidMount() {
    await this.refresh();
  }

  refresh = async () => {
    this.setState(() => ({
      tracks: [],
      index: 0,
      index1: 1,
      index2: 2,
      disabled: false,
    }));
    let items = this.getDiscover();
    let [tracks] = await Promise.all([items]);
    this.setState(() => ({ tracks: tracks }));

    let repeated = new Set<any>();
    let once = new Set<any>();
    tracks.forEach((track: any) => {
      if (!once.has(track.id)) {
        console.log(track.id);
        once.add(track.id);
      } else {
        console.log(track);
        repeated.add(track);
      }
    });
    console.log(once.size);

    console.log(Array.from(repeated.values()));
  };

  handleAddAll = async () => {
    let user = JSON.parse(Cookies.get("user") as string);
    let tracksToSend = this.state.tracks;
    // let tracksToSend = this.state.tracks.slice(Math.min(this.state.index, this.state.index1, this.state.index2), this.state.tracks.length);
    let idsToSend = tracksToSend.map((track: any) => track.uri);
    let res = await fetch(`/api/music/discover?uid=${user.id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracks: idsToSend,
      }),
    });

    if (res.ok) {
      this.setState({
        index: this.state.tracks.length,
        index1: this.state.tracks.length,
        index2: this.state.tracks.length,
        disabled: true,
      });
    }
  };

  getDiscover = async () => {
    let user = JSON.parse(Cookies.get("user") || "");
    let res = await fetch(`/api/music/discover?uid=${user.id}&length=50`);
    let json = await res.json();
    return json;
  };

  removeSong = async (id: string, index: Number) => {
    let user = JSON.parse(Cookies.get("user") || "");
    if (!user.id) return;
    this.incrementIndex(index);
    this.setState({
      tracks: this.state.tracks.slice(
        index as number,
        this.state.tracks.length
      ),
    });

    // let res = await fetch(
    //   `/music/forgotten?uid=${user.id}`,
    //   {
    //     method: "delete",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       deleteIds: [id],
    //     }),
    //   }
    // );

    // let json = await res.json();
  };

  heart = async (id: string, index: number) => {
    console.log(id);

    let user = JSON.parse(Cookies.get("user") || "");
    if (!user.id) return;
    this.incrementIndex(index);
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
          className="section static3 App-subtitle flexcolumn"
          style={{ justifyContent: "space-between", height: "100%" }}
        >
          <h1 style={{ margin: 0 }}>Discover New Songs</h1>
          <span
            style={{
              height: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BuildForMe variant="contained" onClick={this.refresh}>
              Refresh
            </BuildForMe>
          </span>

          <p>We are looking for more songs to suggest! Come back later</p>
        </section>
      );
    return (
      <section className="section static3 App-subtitle flexcolumn">
        <h1 style={{ margin: 0 }}>Discover New Songs</h1>

        <span
          style={{
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <BuildForMe
              disabled={this.state.disabled}
              variant="contained"
              onClick={this.handleAddAll}
            >
              Add All {this.state.tracks.length} Songs
            </BuildForMe>
            {/* <span
                style={{
                  fontSize: "50px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  alignItems: "center",
                }}
              >
                {" "}
                or{" "}
              </span>
              <FromPlaylist
                disabled={this.state.disabled}
                variant="contained"
                onClick={(e) => {
                  return;
                }}
              >
                Make from playlist
              </FromPlaylist> */}
            <div>
              <Blacklist />
            </div>
          </div>
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

export default withWidth()(withTheme(DiscoverPage));
