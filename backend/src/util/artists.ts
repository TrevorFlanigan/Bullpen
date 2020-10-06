import fetch from "node-fetch";

const longArtists = (accessToken: string) =>
  fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

const shortArtists = (accessToken: string) =>
  fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
export {
  longArtists as getLongHistoryArtists,
  shortArtists as getShortHistoryArtists,
};
