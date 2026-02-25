"use client";

import styles from "./index.module.scss";
import SeasonList from "../shared/seasonList";
import VideoList from "../shared/videoList";

const DesktopVideoBrowser: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.seasonList}>
        <SeasonList />
      </div>
      <div className={styles.videoList}>
        <VideoList />
      </div>
    </div>
  );
};

export default DesktopVideoBrowser;
