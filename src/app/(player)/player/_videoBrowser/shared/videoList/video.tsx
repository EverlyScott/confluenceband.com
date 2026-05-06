import Image from "next/image";
import type { FullVideo } from ".";
import useVideoBrowserState from "../../context";
import styles from "./video.module.scss";
import { useMemo } from "react";
import type { ConfluenceArtistHeaders } from "@/db";

interface IProps {
  video: FullVideo;
}

const Video: React.FC<IProps> = ({ video }) => {
  const { setPlayingVideo, artistHeaders } = useVideoBrowserState();
  const hasCoverArt = useMemo(
    () => video.expand?.performance?.hasCoverArt,
    [video],
  );

  const handleSetVideo = () => {
    setPlayingVideo(video);
  };

  if (video.isHidden) {
    return <></>;
  }

  return (
    <>
      <ArtistHeader
        performanceOrder={video.performanceOrder}
        artistHeaders={artistHeaders}
      />
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
            {video.displayedOrder || video.performanceOrder}.{" "}
            {video.expand?.song?.title}
            {video.suffix ? ` (${video.suffix})` : ""}
          </p>
        </div>
      </a>
    </>
  );
};

export default Video;

interface ArtistHeaderProps {
  performanceOrder: number;
  artistHeaders: ConfluenceArtistHeaders[];
}

const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  performanceOrder,
  artistHeaders,
}) => {
  const showArtistHeader = useMemo(() => {
    for (const header of artistHeaders) {
      if (header.beforeSong === performanceOrder) {
        return header;
      }
    }

    return undefined;
  }, [performanceOrder, artistHeaders]);

  if (showArtistHeader === undefined) return <></>;

  return (
    <h2
      style={{
        display: "block",
        width: "100%",
        flexBasis: "100%",
        margin: "2rem 0 0 0",
        textAlign: "center",
      }}
    >
      {showArtistHeader.artistName}
    </h2>
  );
};
