import type { MediaPlayerInstance } from "@vidstack/react";
import { useEffect, useRef } from "react";
import useVideoBrowserState from "../../context";
import moment from "moment";

interface Params {
  player: MediaPlayerInstance | null;
  onNext: () => void;
  onPrevious: () => void;
}

const useMediaSession = ({ player, onNext, onPrevious }: Params) => {
  const handlesRegistered = useRef(false);
  const { playingVideo } = useVideoBrowserState();

  useEffect(() => {
    if (!("mediaSession" in navigator) || !player || handlesRegistered.current)
      return;

    const ms = navigator.mediaSession;

    ms.setActionHandler("play", () => {
      player.play();
    });
    ms.setActionHandler("pause", () => {
      player.pause();
    });

    ms.setActionHandler("previoustrack", onPrevious);
    ms.setActionHandler("nexttrack", onNext);

    handlesRegistered.current = true;
  }, [player, onNext, onPrevious]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !player) return;

    const updatePlaybackState = () => {
      navigator.mediaSession.playbackState = player.paused
        ? "paused"
        : "playing";
    };

    updatePlaybackState();

    player.addEventListener("play", updatePlaybackState);
    player.addEventListener("pause", updatePlaybackState);
    player.addEventListener("end", updatePlaybackState);

    return () => {
      player.removeEventListener("play", updatePlaybackState);
      player.removeEventListener("pause", updatePlaybackState);
      player.removeEventListener("end", updatePlaybackState);
    };
  }, [player]);

  useEffect(() => {
    const applyMetadata = () => {
      if (
        !("mediaSession" in navigator) ||
        player === null ||
        playingVideo?.expand?.song === undefined ||
        playingVideo?.expand?.performance === undefined
      )
        return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${playingVideo.expand.song.title}${playingVideo.suffix ? ` (${playingVideo.suffix})` : ""}`,
        artist: "The La Crosse Confluence",
        album: `${playingVideo.expand.performance.name} ${moment.utc(playingVideo.expand.performance.date).local().format("YYYY")}`,
        artwork: [
          {
            src: `${playingVideo.rootUrl}cover.avif`,
            type: "image/avif",
          },
        ],
      });
    };

    if (!player?.paused && Number.isFinite(player?.duration)) {
      applyMetadata();
    } else {
      player?.addEventListener("canplay", applyMetadata, { once: true });
    }
  }, [playingVideo, player]);
};

export default useMediaSession;
