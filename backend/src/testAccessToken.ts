import fetch from "node-fetch";

const testAccessToken = async (accessToken: string, req: any, res: any) => {
  let response = await fetch("https://api.spotify.com/v1/me/", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  let json = await response.json();
  if (json.error?.status === 401) {
    res.status(401).json({ error: "Expired access token" });
    return false;
  }
  return true;
};

export default testAccessToken;
