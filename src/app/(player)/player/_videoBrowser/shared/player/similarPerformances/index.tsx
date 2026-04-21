import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import {
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import classNames from "classnames";
import type { MediaPlayerInstance } from "@vidstack/react";
import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Performances from "./performances";
import Queue from "./queue";
import db from "@/db";

type ViewMode = "performances" | "queue";

interface IProps {
  player: MediaPlayerInstance | null;
}

const fetchSameSongVideos = async (songId: string) => {
  return await db.send<FullVideo[]>(`/api/hooks/songs/${songId}/videos`, {});
};

const SimilarPerformances: React.FC<IProps> = ({ player }) => {
  const { playingVideo } = useVideoBrowserState();
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<ViewMode>("performances");
  const [performances, setPerformances] = useState<FullVideo[]>();
  const [queue, setQueue] = useState<FullVideo[]>();

  useEffect(() => {
    if (expanded === false || playingVideo === undefined) return;

    // Don't update if the video has the same song; results will be the same
    if (performances?.[0]?.song === playingVideo.song) return;

    (async () => {
      if (view === "performances") {
        setPerformances(await fetchSameSongVideos(playingVideo.song));
      }
    })();
  }, [expanded, performances, playingVideo, view]);

  useEffect(() => {
    setPerformances(undefined);
  }, [playingVideo?.song]);

  useEffect(() => {
    setQueue(undefined);
  }, [playingVideo?.performance]);

  useEffect(() => {
    if (playingVideo?.expand?.performance?.videos)
      setQueue(
        playingVideo.expand.performance.videos.map((video) => ({
          ...video,
          expand: {
            ...video.expand,
            performance: playingVideo.expand!.performance!,
          },
        })),
      );
  }, [playingVideo]);

  const toggleExpand = () => {
    player?.el?.focus?.();
    setExpanded((expanded) => {
      return !expanded;
    });
  };

  const handleViewModeChange = (
    evt: React.MouseEvent<HTMLElement>,
    value: ViewMode,
  ) => {
    player?.el?.focus?.();

    setView(value);
  };

  return (
    <div className={styles.container}>
      <div>
        <Tooltip title="Browse Performances">
          <IconButton onClick={toggleExpand}>
            {expanded ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Tooltip>
      </div>
      <div
        className={classNames(
          styles.main,
          expanded ? styles.expanded : undefined,
        )}
      >
        <div>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewModeChange}
          >
            <ToggleButton value="performances">Performances</ToggleButton>
            <ToggleButton value="queue">Queue</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.videoList}>
          <Performances {...{ view, performances }} />
          <Queue {...{ view, queue }} />
        </div>
      </div>
    </div>
  );
};

export default SimilarPerformances;
