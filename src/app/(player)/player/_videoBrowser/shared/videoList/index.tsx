import type { ConfluenceSongs, ConfluenceVideos, Expand } from "@/db";
import type { FullPerformance } from "../..";
import useVideoBrowserState from "../../context";
import styles from "./index.module.scss";
import Video from "./video";
import FullPerformanceVideo from "./fullPerformanceVideo";

export type FullVideo = Expand<
  ConfluenceVideos,
  { song: ConfluenceSongs; performance: FullPerformance }
>;

const VideoList: React.FC = () => {
  const { selectedPerformance } = useVideoBrowserState();

  if (selectedPerformance === undefined) {
    return <></>;
  }

  selectedPerformance.videos.sort((a, b) => {
    if (a.performanceOrder < b.performanceOrder) {
      return -1;
    }
    if (a.performanceOrder > b.performanceOrder) {
      return 1;
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      {selectedPerformance.performanceNote ? (
        <div
          style={{ textAlign: "center", padding: "0 1rem" }}
          dangerouslySetInnerHTML={{
            __html: selectedPerformance.performanceNote,
          }}
        />
      ) : (
        <></>
      )}
      <div className={styles.playlist}>
        {selectedPerformance.videos.map((video) => {
          const fullVideo: FullVideo = {
            ...video,
            expand: {
              ...video.expand,
              performance: selectedPerformance,
            },
          };

          if (fullVideo.expand?.song?.id === "full-performance") {
            return (
              <FullPerformanceVideo video={fullVideo} key={fullVideo.id} />
            );
          }

          return <Video video={fullVideo} key={fullVideo.id} />;
        })}
      </div>
    </div>
  );
};

export default VideoList;
