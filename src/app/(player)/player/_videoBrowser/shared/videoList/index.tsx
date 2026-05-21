import { type ConfluenceSongs, type ConfluenceVideos, type Expand } from "@/db";
import type { FullPerformance } from "../..";
import useVideoBrowserState from "../../context";
import styles from "./index.module.scss";
import Video from "./video";
import FullPerformanceVideo from "./fullPerformanceVideo";
import React, { useEffect, useRef, useState } from "react";
import { Portal } from "@mui/material";

export type FullVideo = Expand<
  ConfluenceVideos,
  { song: ConfluenceSongs; performance: FullPerformance }
>;

const VideoList: React.FC = () => {
  const { selectedPerformance } = useVideoBrowserState();
  const [fullPerformanceBackground, setFullPerformanceBackground] =
    useState<string>();
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFullPerformanceBackground(undefined);
  }, [selectedPerformance]);

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
    <div
      className={styles.container}
      style={
        {
          "--bg-image": fullPerformanceBackground
            ? `url("${fullPerformanceBackground}")`
            : undefined,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.fullPerformanceContainer}
        data-show={fullPerformanceBackground !== undefined ? "true" : "false"}
        ref={portalRef}
      />
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

          if (fullVideo.song === "full-performance") {
            const backgroundUrl = `${fullVideo.rootUrl}${fullVideo.expand?.performance?.hasCoverArt ? "cover.avif" : "thumb.avif"}`;
            if (fullPerformanceBackground !== backgroundUrl)
              setFullPerformanceBackground(backgroundUrl);
            return (
              <Portal container={() => portalRef.current!} key={fullVideo.id}>
                <FullPerformanceVideo video={fullVideo} key={fullVideo.id} />
              </Portal>
            );
          }

          return <Video video={fullVideo} key={fullVideo.id} />;
        })}
      </div>
      {selectedPerformance.coverArtCredit === "" ? (
        <></>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "16px",
          }}
        >
          Cover Art Taken By {selectedPerformance.coverArtCredit}
        </p>
      )}
    </div>
  );
};

export default VideoList;
