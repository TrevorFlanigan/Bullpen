import * as React from 'react';
import { Button, isWidthUp, TextField, withTheme, withWidth } from '@material-ui/core';

import Cookies from "js-cookie";
import SongCard from "./SongCard"
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
interface IDiscoverPageProps {
    width: Breakpoint;
}

interface IDiscoverPageState {
    tracks: any[];
    index: Number;
    index1: Number;
    index2: Number;
    size: Number;
}

class DiscoverPage extends React.Component<IDiscoverPageProps, IDiscoverPageState> {
    state = {
        tracks: [],
        index: 0,
        index1: 1,
        index2: 2,
        size: 50
    };
    async componentDidMount() {
        let items = this.getDiscover();

        let [tracks] = await Promise.all([items]);
        this.setState(() => ({ tracks: tracks }));
        console.log(this.state.tracks);
    }

    getDiscover = async () => {
        let user = JSON.parse(Cookies.get("user") || "");
        let res = await fetch(`http://localhost:4000/api/music/discover?uid=${user.id}&length=50`);
        let json = await res.json();
        return json;
    }


    removeSong = async (id: string, index: Number) => {
        let user = JSON.parse(Cookies.get("user") || "");
        if (!user.id) return;
        this.incrementIndex(index);

        // let res = await fetch(
        //   `http://localhost:4000/api/music/forgotten?uid=${user.id}`,
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

        // let res = await fetch(
        //   `http://localhost:4000/api/music/addforgotten?uid=${
        //     user.id
        //   }`,
        //   {
        //     method: "post",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       toAdd: [id],
        //     }),
        //   }
        // );

        // console.log(await res.json());

        // console.log("done heart");
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
                    <p>We are looking for more songs to suggest! Come back later</p>
                </section>
            );
        return (
            <section className="section static3 App-subtitle flexcolumn">
                <h1 style={{ margin: 0 }}>Discover New Songs</h1>
                <span style={{ height: "auto", display: "flex", justifyContent: "center" }}>

                    <Button variant="contained" onClick={async () => {
                        //   let user = JSON.parse(Cookies.get("user") as string);
                        //   console.log(user.id);
                        //  await fetch(`http://localhost:4000/api/music/discover?uid=${user.id}&length=50`); 
                    }}>Build for me</Button>
                    {/* <TextField label="Playlist Size" type="number" defaultValue={50} onChange={(e) => this.setState({ size: Number.parseInt(e.target.value) })} /> */}
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