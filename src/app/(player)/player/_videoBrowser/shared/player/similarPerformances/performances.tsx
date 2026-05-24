import { useEffect, useRef } from "react";
import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Video from "./video";
import { Skeleton } from "@mui/material";

interface IProps {
  view: "performances" | "queue";
  performances: FullVideo[] | undefined;
}

const Performances: React.FC<IProps> = ({ view, performances }) => {
  const { playingVideo } = useVideoBrowserState();
  const playingVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playingVideoRef.current)
      playingVideoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [playingVideo]);

  if (view !== "performances") {
    return <></>;
  }

  if (performances === undefined) {
    return new Array(12).fill("").map((_, i) => (
      <Skeleton
        variant="rectangular"
        sx={{
          borderRadius: "10px",
          width: "100%",
          minHeight: "72.25px",
        }}
        key={i}
      />
    ));
  }

  return performances.map((video) => (
    <Video
      view={view}
      video={video}
      selected={playingVideo?.id === video.id}
      ref={playingVideo?.id === video.id ? playingVideoRef : undefined}
      key={video.id}
    />
  ));
};

export default Performances;
