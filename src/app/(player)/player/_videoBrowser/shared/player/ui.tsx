import {
  MediaPlayerInstance,
  useMediaPlayer,
  useState as usePlayerState,
  type MediaPlayerState,
} from "@vidstack/react";
import styles from "./styles.module.scss";
import { Scrubber } from "react-scrubber";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEventHandler,
} from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import Download from "@mui/icons-material/Download";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import ExpandedView from "./expandedView";
import classNames from "classnames";
import SongInfoDialog from "./songInfoDialog";
import useVideoBrowserState from "../../context";
import type { FullVideo } from "../videoList";
import moment from "moment";

export interface IProps {
  useVideo: boolean;
  setUseVideo: React.Dispatch<React.SetStateAction<boolean>>;
}

function useMediaPlayerState<T extends keyof MediaPlayerState>(
  key: T,
  player: MediaPlayerInstance | null,
) {
  return usePlayerState(MediaPlayerInstance, key, { current: player });
}

const PlayerUI: React.FC<IProps> = (props) => {
  const {
    playingVideo,
    setPlayingVideo,
    handleSetSelectedPerformance,
    playerExpanded,
    setPlayerExpanded,
  } = useVideoBrowserState();

  const { useVideo } = props;

  const player = useMediaPlayer();
  const isFullscreen = useMediaPlayerState("fullscreen", player);
  const currentTime = useMediaPlayerState("currentTime", player);
  const bufferedEnd = useMediaPlayerState("bufferedEnd", player);
  const duration = useMediaPlayerState("duration", player);
  const isPaused = useMediaPlayerState("paused", player);
  const volume = useMediaPlayerState("volume", player);
  const buffering = useMediaPlayerState("waiting", player);
  const [songInfoOpen, setSongInfoOpen] = useState(false);
  const [volumeMenuOpen, setVolumeMenuOpen] = useState(false);
  const [preMutedVolume, setPreMutedVolume] = useState(volume);
  const volumeControlRef = useRef<HTMLInputElement>(null);
  const previousVideo = useMemo<FullVideo | undefined>(() => {
    if (playingVideo === undefined) return undefined;

    if (playingVideo?.performanceOrder !== 1) {
      const performanceVideos = playingVideo?.expand?.performance?.videos;

      const currentIndex =
        performanceVideos?.findIndex?.(
          (video) => video.id === playingVideo.id,
        ) ?? -1;

      if (currentIndex !== -1 && performanceVideos?.[currentIndex - 1]) {
        const previousVideoRoot = performanceVideos[currentIndex - 1];

        return {
          ...previousVideoRoot,
          expand: {
            ...previousVideoRoot?.expand,
            performance: playingVideo?.expand?.performance,
          },
        } as FullVideo;
      }
    }

    return undefined;
  }, [playingVideo]);
  const nextVideo = useMemo<FullVideo | undefined>(() => {
    if (playingVideo === undefined) return undefined;

    const performanceVideos = playingVideo?.expand?.performance?.videos;

    const currentIndex =
      performanceVideos?.findIndex?.((video) => video.id === playingVideo.id) ??
      -1;

    if (currentIndex !== -1 && performanceVideos?.[currentIndex + 1]) {
      const nextVideoRoot = performanceVideos[currentIndex + 1];

      return {
        ...nextVideoRoot,
        expand: {
          ...nextVideoRoot?.expand,
          performance: playingVideo?.expand?.performance,
        },
      } as FullVideo;
    }

    return undefined;
  }, [playingVideo]);

  const blurButton = useCallback(() => {
    player?.el?.focus?.();
  }, [player]);

  const handleSkipPrevious = useCallback(() => {
    blurButton();

    if (previousVideo) setPlayingVideo(previousVideo);
  }, [blurButton, previousVideo, setPlayingVideo]);

  const handleSkipNext = useCallback(() => {
    blurButton();

    if (nextVideo) setPlayingVideo(nextVideo);
  }, [blurButton, nextVideo, setPlayingVideo]);

  useEffect(() => {
    if (player) {
      player.addEventListener("end", handleSkipNext);
    }

    return () => {
      if (player) {
        player.removeEventListener("end", handleSkipNext);
      }
    };
  }, [handleSkipNext, player]);

  if (playingVideo === undefined) {
    return <></>;
  }

  const handleScrubChange = (value: number) => {
    if (player) {
      player.currentTime = value;
    }
  };

  const handleVolumeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (player) {
      player.volume = evt.target.valueAsNumber / 100;
    }
  };

  const handlePlay = async () => {
    blurButton();

    if (player) {
      await player.play();
    }
  };

  const handlePause = async () => {
    blurButton();

    if (player) {
      await player.pause();
    }
  };

  const toggleExpanded: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = () => {
    blurButton();

    setPlayerExpanded((expanded) => {
      return !expanded;
    });
  };

  const mouseEnterVolume = () => {
    setVolumeMenuOpen(true);
  };

  const mouseExitVolume = () => {
    setVolumeMenuOpen(false);
  };

  const toggleMute: MouseEventHandler<HTMLButtonElement> = () => {
    blurButton();

    if (!player) return;

    if (volume === 0) return (player.volume = preMutedVolume);

    setPreMutedVolume(volume);
    player.volume = 0;
  };

  const closePlayer: MouseEventHandler<HTMLButtonElement> = () => {
    blurButton();

    setPlayerExpanded(false);
    setPlayingVideo(undefined);
  };

  const getDownloadHref = () => {
    let name = `${playingVideo.performanceOrder}. ${playingVideo.expand?.song?.title}`;

    if (playingVideo.suffix) name += ` ${playingVideo.suffix}`;

    if (useVideo) {
      return `${playingVideo.rootUrl}original.mp4?download=${name}.mp4`;
    }

    return `${playingVideo.rootUrl}track.flac?download=${name}.flac`;
  };

  const enterFullscreen: MouseEventHandler<HTMLButtonElement> = () => {
    blurButton();

    if (!player) return;

    player.enterFullscreen();
  };

  const exitFullscreen: MouseEventHandler<HTMLButtonElement> = () => {
    blurButton();

    if (!player) return;

    player.exitFullscreen();
  };

  const showSongInfo = () => {
    setSongInfoOpen(true);
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.contentView,
          playerExpanded && styles.expanded,
          isFullscreen && styles.fullscreen,
        )}
      >
        <ExpandedView {...{ ...props, player, isPaused, isFullscreen }} />
      </div>

      <div className={styles.player}>
        <Scrubber
          min={0}
          max={duration}
          value={currentTime}
          onScrubStart={handleScrubChange}
          onScrubEnd={handleScrubChange}
          onScrubChange={handleScrubChange}
          bufferPosition={bufferedEnd}
          className={styles.scrub}
          tooltip={{
            enabledOnHover: true,
            enabledOnScrub: true,
            formatString: (val) =>
              new Date(val * 1000)
                .toISOString()
                .slice(val < 3600 ? 14 : 11, 19),
          }}
        />
        <div
          className={classNames(
            styles.playerMain,
            isFullscreen && styles.fullscreen,
          )}
        >
          <div className={styles.left}>
            <div
              className={styles.cover}
              onClick={toggleExpanded}
              style={{
                backgroundImage: `url("${playingVideo.rootUrl}cover.avif"), url("${playingVideo.rootUrl}thumb.avif")`,
              }}
            >
              <div className={styles.coverPopUp}>
                {playerExpanded ? <ExpandMore /> : <ExpandLess />}
              </div>
            </div>
            <div className={styles.text}>
              <SongInfoDialog
                isOpen={songInfoOpen}
                setIsOpen={setSongInfoOpen}
              />
              <a href="#" onClick={showSongInfo}>
                <h1>
                  {playingVideo.expand?.song?.title}
                  {playingVideo.suffix === ""
                    ? ""
                    : ` (${playingVideo.suffix})`}
                </h1>
              </a>
              <Link
                href={`/?performance=${playingVideo.expand?.performance?.id}`}
                onClick={(evt) => {
                  evt.preventDefault();
                  handleSetSelectedPerformance(
                    playingVideo.expand?.performance,
                  );
                  setPlayerExpanded(false);
                  if (!player) return;
                  player.exitFullscreen();
                }}
              >
                <p>
                  {playingVideo.expand?.performance?.name}
                  {playingVideo.expand?.performance?.date
                    ? ` ${moment
                        .utc(playingVideo.expand.performance.date)
                        .format("YYYY")}`
                    : ""}
                </p>
              </Link>
            </div>
          </div>
          <div className={styles.controls}>
            <Tooltip title="Previous" placement="top">
              <IconButton
                onClick={handleSkipPrevious}
                disabled={!previousVideo}
              >
                <SkipPrevious />
              </IconButton>
            </Tooltip>
            {buffering ? (
              <CircularProgress />
            ) : isPaused ? (
              <Tooltip title="Play" placement="top">
                <IconButton onClick={handlePlay} size="large">
                  <PlayArrow />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Pause" placement="top">
                <IconButton onClick={handlePause} size="large">
                  <Pause />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Next" placement="top">
              <IconButton onClick={handleSkipNext} disabled={!nextVideo}>
                <SkipNext />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.rightControls}>
            <div
              className={styles.volumeContainer}
              onMouseEnter={mouseEnterVolume}
              onMouseLeave={mouseExitVolume}
            >
              <div
                className={styles.volumeControl}
                style={{
                  width: volumeMenuOpen
                    ? (volumeControlRef.current?.clientWidth ?? 0) + 4
                    : undefined,
                }}
              >
                <Tooltip title={`${Math.round(volume * 100)}%`} placement="top">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    ref={volumeControlRef}
                    onClick={blurButton}
                  />
                </Tooltip>
              </div>
              <Tooltip title="Mute" placement="top">
                <IconButton onClick={toggleMute}>
                  {volume > 0.5 ? (
                    <VolumeUp />
                  ) : volume > 0 ? (
                    <VolumeDown />
                  ) : (
                    <VolumeOff />
                  )}
                </IconButton>
              </Tooltip>
            </div>
            <a href={getDownloadHref()} target="_blank" onClick={blurButton}>
              <Tooltip title="Download" placement="top">
                <IconButton onClick={blurButton}>
                  <Download />
                </IconButton>
              </Tooltip>
            </a>
            {useVideo ? (
              isFullscreen ? (
                <Tooltip title="Exit Fullscreen" placement="top">
                  <IconButton onClick={exitFullscreen}>
                    <FullscreenExit />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Enter Fullscreen" placement="top">
                  <IconButton onClick={enterFullscreen}>
                    <Fullscreen />
                  </IconButton>
                </Tooltip>
              )
            ) : (
              <></>
            )}
            {isFullscreen ? (
              <></>
            ) : (
              <Tooltip title={playerExpanded ? "Shrink" : "Expand"}>
                <IconButton onClick={toggleExpanded}>
                  {playerExpanded ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Close Player">
              <IconButton onClick={closePlayer}>
                <Cancel />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerUI;
