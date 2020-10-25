import User from "../schemas/User";
import testAccessToken from "./testAccessToken";
import { refreshAccessToken } from "../util/spotify";


/**
 * 
 * @param req must have req.query.uid,
 * @param res sends response errors if theres an error
 */
const getUserAndRefreshToken = async (req: any, res: any) => {
    let user = await User.findOne({ id: req.query.uid });
    if (!user) {
        console.log("User not found error");
        res.status(404).json({ error: "User not found" });
        // throw new Error("User not found");
        console.log("User not found");
        return { user: null, accessToken: null };
    }


    let accessToken = user.access_token;
    if (!(await testAccessToken(accessToken, req, res))) {
        console.log("HAVE TO REFRESH TOKEN");

        await refreshAccessToken(user.id);
    }
    return { user, accessToken };
}


export default getUserAndRefreshToken;

