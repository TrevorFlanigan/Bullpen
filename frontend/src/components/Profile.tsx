import {
  Backdrop,
  CircularProgress,
  createStyles,
  Fade,
  IconButton,
  Modal,
  Slide,
  withStyles,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import * as React from "react";
import SettingsPage from "./SettingsPage";

interface IProfileProps {
  classes: any;
}

interface IProfileState {
  in: boolean;
}

const SettingsButton = withStyles({
  root: { zIndex: 11, color: "white", border: "1px solid black" },
})(IconButton);

const StyledBackdrop = withStyles({
  root: {
    // transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important",
    // opacity: "0.5 !important",
    color: "#fff",
    background:
      "linear-gradient(90deg, rgba(249,249,249,.5) 0%, rgba(146,239,238,.5) 100%)",
  },
})(Backdrop);
class Profile extends React.Component<IProfileProps, IProfileState> {
  state = {
    in: false,
  };

  toggleSettings = async () => {
    this.setState({ in: !this.state.in });
    console.log(this.state.in);
  };
  public render() {
    const { classes } = this.props;
    return (
      <section
        className="section parallax bg3 App-subtitle flexcolumn"
        style={{
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            margin: 0,
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "100%" }}>Your Profile </div>
          <div
            style={{ alignSelf: "flex-end", paddingLeft: 10, paddingRight: 10 }}
          >
            <SettingsButton size="medium" onClick={this.toggleSettings}>
              <Settings />
            </SettingsButton>
          </div>
        </h1>
        <p style={{ marginTop: 0, fontSize: "80%" }}>
          Choose settings for your new bullpen playlist.
        </p>
        <Modal
          disableAutoFocus={true}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.in}
          onClose={() => this.setState({ in: false })}
          closeAfterTransition
          BackdropComponent={StyledBackdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Slide in={this.state.in} direction="up">
            <SettingsPage />
          </Slide>
        </Modal>
      </section>
    );
  }
}

const muiStyles = createStyles({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
export default withStyles(muiStyles)(Profile);
