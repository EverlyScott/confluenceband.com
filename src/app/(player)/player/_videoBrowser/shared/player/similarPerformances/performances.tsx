import { useEffect, useRef } from "react";
import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Video from "./video";

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

  if (view !== "performances" || performances === undefined) {
    return <></>;
  }

  return performances.map((video) => {
    return (
      <Video
        view={view}
        video={video}
        selected={playingVideo?.id === video.id}
        ref={playingVideoRef}
        key={video.id}
      />
    );
  });
};

export default Performances;
