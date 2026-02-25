"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import "react-scrubber/lib/scrubber.css";
import "@vidstack/react/player/styles/default/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import PlayerUI from "./ui";
import useVideoBrowserState from "../../context";

const Player: React.FC = () => {
  const { playingVideo, selectedPerformance, setPlayerExpanded } =
    useVideoBrowserState();

  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    setPlayerExpanded(false);
  }, [selectedPerformance, setPlayerExpanded]);

  const computedUseVideo = useMemo(() => {
    if (playingVideo) {
      if (playingVideo.noVideo) return false;
      if (playingVideo.noAudio) return true;
    }
    return useVideo;
  }, [playingVideo, useVideo]);

  if (!playingVideo) {
    return <></>;
  }

  return (
    <MediaPlayer
      title={`${playingVideo?.expand?.song?.title}${playingVideo.suffix ? ` (${playingVideo.suffix})` : ""}`}
      artist="The La Crosse Confluence"
      artwork={[
        {
          src: `${playingVideo.rootUrl}cover.avif`,
          type: "image/avif",
        },
      ]}
      src={`${playingVideo.rootUrl}${computedUseVideo ? "index.m3u8" : "track.flac"}`}
      autoPlay
      className={styles.vidstack}
    >
      <PlayerUI
        {...{
          setUseVideo,
        }}
        useVideo={computedUseVideo}
      />
      {computedUseVideo ? <></> : <MediaProvider style={{ display: "none" }} />}
    </MediaPlayer>
  );
};

export default Player;
