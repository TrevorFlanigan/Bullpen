import fetch from "node-fetch";
const makePlaylist = async (accessToken: string, uid: string, name: string) => {
  console.log("makePlaylist");

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

    let json = await res.json();

    console.log("done makeplaylist");

    return json;
  } catch (e) {
    console.log(e);

    // throw e;
  }
};
const addToPlaylist = async (
  accessToken: string,
  playlist_id: string,
  trackUris: string[]
) => {
  console.log("adding to spotify");
  console.log(trackUris);

  try {
    let res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );

    let json = await res.json();
    console.log(json);

    console.log("done addtoplaylist");

    return json;
  } catch (e) {
    console.log(e);

    // throw e;
  }
};

const getAllFromNext = async (
  accessToken: string,
  next: string,
  prevSet?: Set<any>
) => {
  return new Promise<Set<any>>(async (res, rej) => {
    if (!next) res(prevSet || new Set<any>());
    let tracks = new Set<any>(prevSet);
    let promises: [Promise<any>] = [new Promise((res) => res())];
    while (next) {
      let result = await fetch(next, {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      let json = await result.json();
      let promise = new Promise((res) => {
        for (const track of json.items) {
          tracks.add(track.track || track);
        }
        res();
      });

      promises.push(promise);
      next = json.next;
    }
    await Promise.all(promises);
    res(tracks);
  });
};
export { makePlaylist, addToPlaylist, getAllFromNext };
