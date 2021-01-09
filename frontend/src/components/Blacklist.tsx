import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import { CircularProgress, IconButton, List } from "@material-ui/core";
import { ChevronLeft, ChevronRight, Settings } from "@material-ui/icons";
import Cookies from "js-cookie";
import { Playlist } from "../types";
import PlaylistOption from "./PlaylistOption";

const useStyles = makeStyles((theme) => ({
  list: {
    flexGrow: 1,
    width: "100%",
  },
}));

export default function Blacklist() {
  const classes = useStyles();

  const [playlists, setPlaylists] = useState([] as Playlist[]);
  const [isMore, setIsMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const playlistsPerPage = 10;
  const [total, setTotal] = useState(0);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(0);

  useEffect(() => {
    const getPlaylists = async () => {
      setLoading(true);

      let user = JSON.parse(Cookies.get("user") as string);
      let res = await fetch(
        `/api/playlists?uid=${user.id}&offset=${playlistsLoaded}&limit=${50}`
      );
      let json = await res.json();
      console.log(json);

      setPlaylists([...playlists, ...(json.items as Playlist[])]);
      setLoading(false);
      setPlaylistsLoaded(playlistsLoaded + json.items.length);
      setTotal(json.total);
      setIsMore(json.next != null);
      if (json.next != null) {
        setPagesLoaded(pagesLoaded + 3);
      }
    };

    if (page * playlistsPerPage >= playlistsLoaded) getPlaylists();
  }, [page]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Settings />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <div
          style={{
            padding: 10,
            minWidth: "300px",
            maxWidth: "300px",
            // minHeight: "300px",
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Proxima Nova",
          }}
        >
          <h2>Blacklist Playlists</h2>
          {loading ? (
            <CircularProgress />
          ) : !playlists.length ? (
            <p>Looks like you have no playlists!</p>
          ) : (
            <List className={classes.list}>
              {playlists
                .slice(page * playlistsPerPage, (page + 1) * playlistsPerPage)
                .filter(Boolean)
                .map((playlist: Playlist) => {
                  if (!playlist.tracks.total) return;
                  return <PlaylistOption playlist={playlist} />;
                })}
            </List>
          )}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              disabled={page === 0}
              onClick={() => {
                setPage(page === 0 ? 0 : page - 1);
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              disabled={(page + 1) * playlistsPerPage >= total}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </Popover>
    </div>
  );
}
