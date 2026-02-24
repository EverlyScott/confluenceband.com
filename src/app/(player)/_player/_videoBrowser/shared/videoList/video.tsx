import Image from "next/image";
import type { FullVideo } from ".";
import useVideoBrowserState from "../../context";
import styles from "./video.module.scss";
import { useMemo } from "react";

interface IProps {
  video: FullVideo;
}

const Video: React.FC<IProps> = ({ video }) => {
  const { setPlayingVideo } = useVideoBrowserState();
  const hasCoverArt = useMemo(
    () => video.expand?.performance?.hasCoverArt,
    [video],
  );

  const handleSetVideo = () => {
    setPlayingVideo(video);
  };

  return (
    <a className={styles.link} href="#performances" onClick={handleSetVideo}>
      <div className={styles.container}>
        <Image
          src={`${video.rootUrl}${hasCoverArt ? "cover.avif" : "thumb.avif"}`}
          width={hasCoverArt ? 3000 : 1280}
          height={hasCoverArt ? 3000 : 720}
          alt={`Thumbnail for ${video.expand?.song?.title}`}
          className={styles.videoThumb}
        />
        <p>
          {video.performanceOrder}. {video.expand?.song?.title}
          {video.suffix ? ` (${video.suffix})` : ""}
        </p>
      </div>
    </a>
  );
};

export default Video;
