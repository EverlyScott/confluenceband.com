import moment from "moment";
import type { FullVideo } from ".";
import useVideoBrowserState from "../../context";
import styles from "./fullPerformanceVideo.module.scss";
import { useMemo } from "react";

interface IProps {
  video: FullVideo;
}

const FullPerformanceVideo: React.FC<IProps> = ({ video }) => {
  const { setPlayingVideo, setPlayerExpanded } = useVideoBrowserState();
  const hasCoverArt = useMemo(
    () => video.expand?.performance?.hasCoverArt,
    [video],
  );

  const performance = video.expand?.performance;

  if (!performance) {
    return <></>;
  }

  const handlePlayVideo = () => {
    setPlayingVideo(video);
    setPlayerExpanded(true);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${video.rootUrl}${hasCoverArt ? "cover.avif" : "thumb.avif"})`,
      }}
    >
      <div className={styles.inner}>
        <div className={styles.flex}>
          <div className={styles.text}>
            <h2>{performance.name}</h2>
            <h3>
              {moment.utc(performance.date).local().format("MMM Do, YYYY")}
            </h3>
          </div>
          <button onClick={handlePlayVideo} className={styles.watch}>
            ▶ Full Performance
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullPerformanceVideo;
