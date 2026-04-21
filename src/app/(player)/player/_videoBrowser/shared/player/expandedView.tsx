import { MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import { type IProps as UIProps } from "./ui";
import { IconButton, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "./expandedView.module.scss";
import classNames from "classnames";
import useVideoBrowserState from "../../context";
import SimilarPerformances from "./similarPerformances";

interface IProps extends UIProps {
  player: MediaPlayerInstance | null;
  isPaused: boolean;
  isFullscreen: boolean;
}

const ExpandedView: React.FC<IProps> = ({
  useVideo,
  setUseVideo,
  player,
  isPaused,
  isFullscreen,
}) => {
  const { playingVideo, setPlayerExpanded } = useVideoBrowserState();

  if (playingVideo === undefined) {
    return <></>;
  }

  const handleVideoChange = (
    _: React.MouseEvent<HTMLElement>,
    value: boolean,
  ) => {
    player?.el?.focus?.();

    const oldTime = player?.currentTime;

    if (value !== null) setUseVideo(value);

    if (player && oldTime !== undefined && value !== useVideo) {
      const handleReady = () => {
        player.removeEventListener("playing", handleReady);

        player.currentTime = oldTime;
      };

      player.addEventListener("playing", handleReady);
    }
  };

  return (
    <div
      className={classNames(
        styles.container,
        isFullscreen && styles.fullscreen,
      )}
    >
      <div className={styles.topBar}>
        <div>
          <IconButton
            onClick={() => {
              setPlayerExpanded(false);
            }}
          >
            <ExpandMore />
          </IconButton>
        </div>
        {playingVideo.expand?.song?.id === "full-performance" ? (
          <></>
        ) : (
          <div className={styles.avToggle}>
            <ToggleButtonGroup
              value={useVideo}
              exclusive
              onChange={handleVideoChange}
            >
              <ToggleButton value={false} disabled={playingVideo.noAudio}>
                Audio
              </ToggleButton>
              <ToggleButton value={true} disabled={playingVideo.noVideo}>
                Video
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.coverContainer}>
          {useVideo ? (
            <MediaProvider
              className={classNames(
                styles.video,
                isPaused ? styles.paused : undefined,
              )}
            />
          ) : (
            <div
              className={classNames(
                styles.cover,
                isPaused ? styles.paused : undefined,
              )}
              style={{
                backgroundImage: `url("${playingVideo.rootUrl}cover.avif"), url("${playingVideo.rootUrl}thumb.avif")`,
              }}
            />
          )}
        </div>
        {playingVideo?.expand?.song?.id === "full-performance" ||
        isFullscreen ? (
          <></>
        ) : (
          <SimilarPerformances player={player} />
        )}
      </div>
    </div>
  );
};

export default ExpandedView;
