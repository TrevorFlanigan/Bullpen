import fetch from "node-fetch"
const makePlaylist = async (accessToken: string, uid: string, name: string) => {
  console.log("makeglaylist");

  try {
    let res = await fetch(`https://api.spotify.com/v1/users/${uid}/playlists`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    console.log(res);

    let json = await res.json();
    console.log(json);

    return json;
  }
  catch (e) {
    console.log(e);

    throw e;

  }

};

export { makePlaylist };
