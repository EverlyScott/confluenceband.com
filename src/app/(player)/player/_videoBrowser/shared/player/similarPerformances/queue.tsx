import { useEffect, useRef } from "react";
import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Video from "./video";

interface IProps {
  view: "performances" | "queue";
  queue: FullVideo[] | undefined;
}

const Queue: React.FC<IProps> = ({ view, queue }) => {
  const { playingVideo } = useVideoBrowserState();
  const playingVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playingVideoRef.current)
      playingVideoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [playingVideo]);

  if (view !== "queue" || queue === undefined) {
    return <></>;
  }

  return queue.map((video) => (
    <Video
      view={view}
      video={video}
      selected={playingVideo?.id === video.id}
      ref={playingVideo?.id === video.id ? playingVideoRef : undefined}
      key={video.id}
    />
  ));
};

export default Queue;
