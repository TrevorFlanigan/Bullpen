import fetch from "node-fetch";
import mapToSet from "./mapToSet";
import { getAllFromNext } from "./playlists";

const longHistoryTracks = (accessToken: string) => {
  return fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const mediumHistoryTracks = (accessToken: string) => {
  return fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const shortHistoryTracks = (accessToken: string) =>
  fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

const recentlyPlayedTracks = (accessToken: string) =>
  fetch("https://api.spotify.com/v1/me/player/recently-played", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });


const getAllTracksFromTimeFrame = async (accessToken: string, timeFrame: "long_term" | "medium_term" | "short_term"): Promise<Set<any>> => {
  let res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeFrame}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (res.ok) {
    let json = await res.json();

    let tracks = await mapToSet(json.items);
    let next = json.next;
    let allTracks = await getAllFromNext(accessToken, next, tracks);
    return allTracks;
  }
  else {
    console.log("Failed to get tracks from time frame");
    return new Set<any>();
  }

}


const getAllRecentlyPlayed = async (accessToken: string): Promise<Set<any>> => {
  let res = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (res.ok) {
    let json = await res.json();

    let tracks = await mapToSet(json.items);
    let next = json.next;
    let allTracks = await getAllFromNext(accessToken, next, tracks);
    return allTracks;
  }
  else {
    console.log("Failed to get tracks from time frame");
    return new Set<any>();
  }

}
export {
  longHistoryTracks,
  shortHistoryTracks,
  recentlyPlayedTracks,
  mediumHistoryTracks,
  getAllTracksFromTimeFrame,
  getAllRecentlyPlayed
};
