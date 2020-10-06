import fetch from "node-fetch";

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
export { longHistoryTracks, shortHistoryTracks, recentlyPlayedTracks };
