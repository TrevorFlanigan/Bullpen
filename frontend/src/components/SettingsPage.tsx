import * as React from "react";
import {
  Backdrop,
  Button,
  Icon,
  Paper,
  TextField,
  withStyles,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import SettingTextInput from "./SettingTextInput";
import Cookies from "js-cookie";
interface ISettingsPageProps {
  toggleSettings: Function;
}

interface ISettingsPageState {
  discoverName: string;
  oldName: string;
}

const SettingsTab = withStyles({
  root: {
    height: " 100%",
    pointerEvents: "all",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
})(Paper);

const Text = withStyles({
  root: {
    alignSelf: "center",
  },
})(TextField);
const SearchIcon = withStyles({
  root: {
    alignSelf: "center",
  },
})(Search);
export default class SettingsPage extends React.Component<
  ISettingsPageProps,
  ISettingsPageState
> {
  state = {
    discoverName: "",
    oldName: "",
  };

  enter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.updateSettings();
    }
  };

  updatePlaylist = (
    id: string,
    name: string,
    which: string
  ) => {
    return fetch(
      `http://localhost:4000/api/users/playlistName?uid=${id}&playlist=${which}&playlistName=${name}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  updateSettings = async () => {
    const { id } = JSON.parse(Cookies.get("user") as string);

    let oldPromise = this.updatePlaylist(
      id,
      this.state.oldName,
      "old"
    );
    let discoverPromise = this.updatePlaylist(
      id,
      this.state.discoverName,
      "discover"
    );

    this.props.toggleSettings();
  };
  async componentDidMount() {
    let user = JSON.parse(Cookies.get("user") || "");
    let discover = await (
      await fetch(
        `http://localhost:4000/api/users/playlistName?uid=${user.id}&playlist=discover`
      )
    ).json();
    let old = await (
      await fetch(
        `http://localhost:4000/api/users/playlistName?uid=${user.id}&playlist=old`
      )
    ).json();
    this.setState({
      discoverName: discover.name || "The Bullpen",
      oldName: old.name || "Old Flames",
    });
  }

  public render() {
    return (
      <div
        style={{
          width: "480px",
          minWidth: "480px",
          justifySelf: "center",
          alignSelf: "center",
          zIndex: 11,
          height: "75%",
          maxHeight: "700px",
          fontFamily: "Proxima Nova",
        }}
      >
        <SettingsTab>
          <h1>Settings</h1>
          <div
            style={{
              height: "95%",
              width: "95%",
              borderRadius: "5px",
              margin: "5%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "95%",
                width: "95%",
                border: "1px solid black",
                borderRadius: "5px",
                margin: "5%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <SettingTextInput
                  onChange={(e) =>
                    this.setState({ discoverName: e.target.value })
                  }
                  onKeyDown={this.enter}
                  icon={SearchIcon}
                  value={this.state.discoverName}
                  label="Discover Playlist Name"
                />
                <SettingTextInput
                  onChange={(e) => this.setState({ oldName: e.target.value })}
                  onKeyDown={this.enter}
                  icon={SearchIcon}
                  value={this.state.oldName}
                  label="Old Favorites Playlist Name"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  marginBottom: "10px",
                }}
              >
                <Button variant="contained" onClick={this.updateSettings}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </SettingsTab>
      </div>
    );
  }
}
