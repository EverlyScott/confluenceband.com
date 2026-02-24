import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Video from "./video";

interface IProps {
  view: "performances" | "queue";
  queue: FullVideo[] | undefined;
}

const Queue: React.FC<IProps> = ({ view, queue }) => {
  const { playingVideo } = useVideoBrowserState();

  if (view !== "queue" || queue === undefined) {
    return <></>;
  }

  return queue.map((video) => (
    <Video
      view={view}
      video={video}
      selected={playingVideo?.id === video.id}
      key={video.id}
    />
  ));
};

export default Queue;
