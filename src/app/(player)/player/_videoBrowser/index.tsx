"use client";

import Mobile from "./mobile";
import Desktop from "./desktop";
import type {
  ConfluencePerformances,
  ConfluenceSongs,
  ConfluenceVenues,
  ConfluenceVideos,
  Expand,
} from "@/db";
import { useMediaQuery } from "@mui/material";
import Player from "./shared/player";
import classNames from "classnames";
import styles from "./index.module.scss";

export interface ISeason {
  season: number;
  performances: Array<FullPerformance> | null;
}

export type FullPerformance = Expand<
  ConfluencePerformances,
  { venue: ConfluenceVenues }
> & { videos: Expand<ConfluenceVideos, { song: ConfluenceSongs }>[] };

const VideoBrowser: React.FC = () => {
  const isMobile = useMediaQuery("screen and (max-width: 900px)");

  if (isMobile) {
    return (
      <>
        <Mobile />
        <PlayerContainer isMobile />
      </>
    );
  }

  return (
    <>
      <Desktop />
      <PlayerContainer />
    </>
  );
};

export default VideoBrowser;

const PlayerContainer: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  return (
    <div
      className={classNames(
        styles.player,
        isMobile ? styles.mobile : undefined,
      )}
    >
      <Player />
    </div>
  );
};
