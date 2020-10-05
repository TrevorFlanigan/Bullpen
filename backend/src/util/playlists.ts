const makePlaylist = async (accessToken: string, uid: string, name: string) => {
  return fetch(`https://api.spotify.com/v1/users/${uid}/playlists`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: name,
    }),
  });
};

export { makePlaylist };
