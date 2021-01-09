import {
  List,
  makeStyles,
  ListItem,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import { Playlist } from "../types";
import React from "react";

const useStyles = makeStyles({
  item: {
    flexGrow: 1,
    width: "100%",
  },
  avatar: {
    borderRadius: 0,
  },
});

const PlaylistOption = ({ playlist }: { playlist: Playlist }) => {
  const classes = useStyles();

  return (
    <ListItem
      divider
      button
      onClick={() => {
        console.log("hello");
      }}
      className={classes.item}
    >
      {playlist.images.length > 0 && (
        <ListItemAvatar>
          <Avatar
            className={classes.avatar}
            alt=""
            src={playlist.images[playlist.images.length - 1]?.url}
          />
        </ListItemAvatar>
      )}
      <p style={{ textOverflow: "ellipsis", maxWidth: "300px" }}>
        {playlist.name}
      </p>
    </ListItem>
  );
};

export default PlaylistOption;
