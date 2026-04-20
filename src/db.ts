import PocketBase, { type RecordService, type RecordModel } from "pocketbase";
import { env } from "@/env";

type NewRecordModel = RecordModel & { expand?: undefined };

export type Expand<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E extends { [key in keyof T]?: Record<string, any> },
> = T & {
  expand?: Partial<E>;
};

export interface Geo {
  lon: number;
  lat: number;
}

export interface Collections {
  confluenceSeasons: ConfluenceSeasons;
  confluencePerformances: ConfluencePerformances;
  confluenceVenues: ConfluenceVenues;
  confluenceVideos: ConfluenceVideos;
  confluenceMembers: ConfluenceMembers;
  confluenceMeta: ConfluenceMeta;
  confluenceSongs: ConfluenceSongs;
  _superusers: RecordModel;
  users: Users;
}

export interface Users {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  clerkId: string;
  role: "owner" | "director" | "unassigned";
}

export interface ConfluenceMeta {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export interface ConfluenceSeasons {
  id: string;
  season: number;
}

export interface ConfluencePerformances {
  id: string;
  name: string;
  venue: string;
  season: string;
  date: string;
  length?: number;
  ticketInfo: string;
  miscInfo?: string;
  ticketLink?: string;
  ticketsFree: boolean;
  performanceNote?: string;
  hasCoverArt: boolean;
  coverArtCredit?: string;
}

export interface ConfluenceVenues {
  id: string;
  name: string;
  address?: string;
  venueImage?: string;
}

export interface ConfluenceVideos {
  id: string;
  song: string;
  suffix: string;
  performance: string;
  performanceOrder: number;
  rootUrl: string;
  artists: Record<string, string[]> | null; // {instrument: artist}
  noVideo: boolean;
  noAudio: boolean;
}

export interface ConfluenceMembers {
  id: string;
  name: string;
  /**
   * Value `8`-`13`
   *
   * `8` = Unknown
   *
   * `13` = Graduated
   */
  grade: number;
  instrument: string[];
  headshot: string;
}

export interface ConfluenceSongs {
  id: string;
  title: string;
  artist: string;
  writer: string;
  producer: string;
  originalCopyright: string;
}

export type SeasonPerformanceCount = Record<string, number>;

class TypedPocketBase<T = Record<string, NewRecordModel>> extends PocketBase {
  collection<M extends Extract<keyof T, string>>(
    idOrName: M,
  ): RecordService<T[M] & NewRecordModel> {
    return super.collection<T[M] & NewRecordModel>(idOrName);
  }
}

const db = new TypedPocketBase<Collections>(env.NEXT_PUBLIC_POCKETBASE_URL);

db.autoCancellation(false);

export default db;
