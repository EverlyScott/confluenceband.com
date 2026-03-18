import classNames from "classnames";
import type { FullVideo } from "../../videoList";
import styles from "./video.module.scss";
import Image from "next/image";
import { useMemo } from "react";
import moment from "moment";
import useVideoBrowserState from "../../../context";

interface IProps {
  view: "performances" | "queue";
  video: FullVideo;
  selected: boolean;
}

const Video: React.FC<IProps> = ({ view, video, selected }) => {
  const { setPlayingVideo } = useVideoBrowserState();
  const useCoverArt = useMemo(
    () =>
      (view === "queue" && video.expand?.performance?.hasCoverArt) ||
      video.noVideo,
    [video, view],
  );
  const [performance, song] = useMemo(
    () => [video.expand?.performance, video.expand?.song],
    [video],
  );

  if (
    video.song === "full-performance" ||
    performance === undefined ||
    song === undefined
  ) {
    return <></>;
  }

  const handleClick = () => {
    setPlayingVideo(video);
  };

  return (
    <div
      className={classNames(
        styles.container,
        selected ? styles.selected : undefined,
      )}
      onClick={handleClick}
    >
      <Image
        src={`${video.rootUrl}${useCoverArt ? "cover.avif" : "thumb.avif"}`}
        width={useCoverArt ? 3000 : 1280}
        height={useCoverArt ? 3000 : 720}
        alt={`${useCoverArt ? "Cover" : "Thumbnail"} for ${view === "performances" ? performance.name : song.title}`}
        className={styles.img}
      />
      <div className={styles.text}>
        <h3>
          {view === "performances"
            ? `${performance.name}${video.suffix === "" ? "" : ` (${video.suffix})`}`
            : `${video.performanceOrder}. ${song.title}${video.suffix === "" ? "" : ` (${video.suffix})`}`}
        </h3>
        {view === "performances" &&
        performance.expand?.venue &&
        performance.expand.venue.name !== performance.name ? (
          <p>@ {performance.expand.venue.name}</p>
        ) : (
          <></>
        )}
        {view === "performances" ? (
          <p>{moment.utc(performance.date).local().format("MMM Do, YYYY")}</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Video;
