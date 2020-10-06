import * as React from "react";
import {
  Backdrop,
  Icon,
  Paper,
  TextField,
  withStyles,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import SettingTextInput from "./SettingTextInput";
import Cookies from "js-cookie";
interface ISettingsPageProps {}

interface ISettingsPageState {
  discoverName: string;
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
  };
  async componentDidMount() {
    let user = JSON.parse(Cookies.get("user") || "");
    let res = await fetch(
      `http://localhost:4000/api/users/discoverPlaylistName?uid=${user.id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let json = await res.json();
    console.log(json.name);
    this.setState({ discoverName: json.name });
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
              <SettingTextInput
                onChange={(e) =>
                  this.setState({ discoverName: e.target.value })
                }
                icon={SearchIcon}
                value={this.state.discoverName}
                label="Discover Playlist Name"
              />
            </div>
          </div>
        </SettingsTab>
      </div>
    );
  }
}
