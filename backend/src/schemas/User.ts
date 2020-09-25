import mongoose from "mongoose";
interface IUser extends mongoose.Document {
  date?: Date;
  display_name: string;
  followers: any;
  href: string;
  id: string;
  images: [Object];
  uri: string;
  recentlyPlayed: [string];
  favoriteArtists: any[];
  favoriteGenres: any[];
  skipped: any[];
  oldFavorites: any[];
  oldFavoritePlaylist: any[];
  discoverPlaylistName: string;
}
const UserSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  display_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  followers: {
    type: Object,
  },
  href: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  images: {
    type: [Object],
  },
  uri: {
    type: String,
    required: true,
  },
  recentlyPlayed: {
    type: [String],
  },
  favoriteArtists: {
    type: [Object],
  },
  favoriteGenres: {
    type: [Object],
  },
  skipped: {
    type: [Object],
  },
  oldFavorites: {
    type: [Object],
  },
  oldFavoritePlaylist: {
    type: [Object],
  },
  discoverPlaylistName: {
    type: String,
    default: "The Bullpen",
  },
});
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
