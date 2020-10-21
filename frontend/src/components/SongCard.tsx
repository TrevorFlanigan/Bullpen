import { IconButton, Slide, withStyles } from "@material-ui/core";
import { Favorite, Remove } from "@material-ui/icons";
import { white } from "material-ui/styles/colors";
import * as React from "react";
import Colors from "./Colors";
interface ISongCardProps {
  track: any;
  heart: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  remove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  ref?: React.RefObject<any>
}

interface ISongCardState {
  translate: Number;
  color: string;
  opacity: number;
  disabled: boolean;
}

export default class SongCard extends React.Component<
  ISongCardProps,
  ISongCardState
  > {
  state = {
    translate: 0,
    color: "white",
    opacity: 1,
    disabled: false,
  };

  removeAnimation = (e: any, fn?: Function) => {
    this.setState({ color: "red", opacity: 0, disabled: true });
    setTimeout(() => {
      if (fn) fn();
      this.setState({
        color: "white",
        opacity: 1,
        disabled: false,
      });
    }, 500);
  }

  likeAnimation = (e: any, fn?: Function) => {
    this.setState({ color: "green", opacity: 0, disabled: true });
    setTimeout(() => {
      if (fn) fn();
      this.setState({
        color: "white",
        opacity: 1,
        disabled: false,
      });
    }, 500);
  }

  public render() {
    if (!this.props.track) return <div></div>;
    const HeartButton = withStyles({
      root: {
        minWidth: "10px",
        color: "white",
        backgroundColor: Colors.green,
        transition: "filter .3s",
        opacity: 0.8,
        margin: "3px",
        "&:hover": {
          filter: "brightness(85%)",
          backgroundColor: Colors.green,
        },
      },
    })(IconButton);
    const RemoveButton = withStyles({
      root: {
        minWidth: "10px",
        color: "white",
        backgroundColor: Colors.red,
        transition: "filter .3s",
        opacity: 0.8,
        margin: "3px",
        "&:hover": {
          filter: "brightness(85%)",
          backgroundColor: Colors.red,
        },
      },
    })(IconButton);
    return (
      <div
        style={{
          opacity: this.state.opacity,
          // translate: `translateX(${this.state.translate})`,
          transition: "opacity 1s",
          height: "60vmin",
          aspectRatio: "1 / 1",
          backgroundImage: `url(${this.props.track.album.images[0].url})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          borderRadius: "5px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
        className="nohighlight"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#000000",
            fontSize: "40px",
            textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white",
            backgroundColor: this.state.color,
            opacity: "88%",
            borderTopRightRadius: "5px",
            borderTopLeftRadius: "5px",
          }}
        >
          {this.props.track.name}
        </div>
        <div
          style={{
            borderBottomRightRadius: "5px",
            borderBottomLeftRadius: "5px",
            backgroundColor: "white",
            opacity: "88%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            textOverflow: "ellipsis",
            color: "#000000",
            overflow: "hidden",
            minWidth: 0,
            textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white",
          }}
        >
          <div>
            <RemoveButton
              onClick={(e) => this.removeAnimation(e,
                () => this.props.remove(this.props.track.id)
              )}
              disabled={this.state.disabled}
            >
              <Remove />
            </RemoveButton>
          </div>
          <p
            style={{
              display: "flex",
              minHeight: 0,
              fontSize: "calc(2vmin + 10px)",
              textOverflow: "ellipsis",
              wordBreak: "break-all",
              maxHeight: "50px",
              margin: 0,
              padding: 0,
              alignSelf: "center",
            }}
          >
            {this.props.track.artists[0].name}
          </p>
          <div>
            <HeartButton
              onClick={(e) => this.likeAnimation(e, () =>
                this.props.remove(this.props.track.id)
              )}
              disabled={this.state.disabled}
            >
              <Favorite />
            </HeartButton>
          </div>
        </div>
      </div>
    );
  }
}
