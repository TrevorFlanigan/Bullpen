import mongoose from "mongoose";
interface IUser extends mongoose.Document {
  date?: Date;
  display_name: string;
  followers: any;
  href: string;
  id: string;
  images: [Object];
  uri: string;
  recentlyPlayed: any[];
  shortHistory: any[];
  mediumHistory: any[];
  longHistory: any[];
  favoriteArtists: any[];
  favoriteGenres: any[];
  skipped: any[];
  oldFavorites: any[];
  oldFavoritePlaylist: any[];
  discoverPlaylistName: string;
  discoverPlaylist: any[];
  discoverPlaylistId: string;
  oldFavoritePlaylistName: string;
  oldFavoritePlaylistId: string;
  refresh_token: string;
  access_token: string;
  known_tracks: string[];

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
    type: [Object],
  },
  shortHistory: {
    type: [Object],
  },
  mediumHistory: {
    type: [Object],
  },
  longHistory: {
    type: [Object],
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
  discoverPlaylistId: {
    type: String,
  },
  discoverPlaylist: {
    type: [Object],
  },
  oldFavoritePlaylistName: {
    type: String,
    default: "Old Flames",
  },
  oldFavoritePlaylistId: {
    type: String,
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  known_tracks: {
    type: [String]
  }
});
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
