import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Likes } from "./Like";
import { Reward } from "./Reward";
import { ScanHistory } from "./ScanHistory";
import { WasteCollectionSchedule } from "./WasteCollectionSchedule";

export interface User {
  userID: number;
  fullName: string;
  email: string;
  passwordHash: string;
  points: number;
  userIDfireBase: string;
  createdAt: string;
  posts:Post[];
  comments:Comment[];
  likes: Likes[];
  rewards: Reward[];
  scanHistories: ScanHistory[];
  wasteCollectionSchedules:WasteCollectionSchedule[];
}
