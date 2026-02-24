import useVideoBrowserState from "../../../context";
import type { FullVideo } from "../../videoList";
import Video from "./video";

interface IProps {
  view: "performances" | "queue";
  performances: FullVideo[] | undefined;
}

const Performances: React.FC<IProps> = ({ view, performances }) => {
  const { playingVideo } = useVideoBrowserState();

  if (view !== "performances" || performances === undefined) {
    return <></>;
  }

  return performances.map((video) => (
    <Video
      view={view}
      video={video}
      selected={playingVideo?.id === video.id}
      key={video.id}
    />
  ));
};

export default Performances;
