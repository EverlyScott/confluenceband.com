"use client";

import useVideoBrowserState from "../context";
import SeasonList from "../shared/seasonList";
import VideoList from "../shared/videoList";
import styles from "./index.module.scss";

const MobileVideoBrowser: React.FC = () => {
  const { selectedPerformance, handleSetSelectedPerformance } =
    useVideoBrowserState();

  const handleCloseVideoList = () => {
    handleSetSelectedPerformance(undefined);
  };

  if (selectedPerformance === undefined) {
    return (
      <div className={styles.seasonList}>
        <SeasonList />
      </div>
    );
  }

  return (
    <div className={styles.videoList}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleCloseVideoList}>
          &#10094;
        </button>
        <h3>{selectedPerformance.name}</h3>
      </div>
      <VideoList />
    </div>
  );
};

export default MobileVideoBrowser;
