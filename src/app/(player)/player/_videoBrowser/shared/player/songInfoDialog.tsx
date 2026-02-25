import type React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import useVideoBrowserState from "../../context";
import { useMemo } from "react";
import moment from "moment";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongInfoDialog: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const { playingVideo } = useVideoBrowserState();
  const songInfo = playingVideo?.expand?.song;
  const performanceInfo = playingVideo?.expand?.performance;

  const hasArtists = useMemo(() => {
    return playingVideo?.artists !== undefined && playingVideo.artists !== null;
  }, [playingVideo]);

  if (playingVideo === undefined || songInfo === undefined) {
    return <></>;
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#331c5080",
            backdropFilter: "blur(10px)",
            width: "clamp(90vw, 300px, 600px);",
            borderRadius: "10px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", fontSize: "1.3rem", lineHeight: "1.35rem" }}
      >
        <div>
          {songInfo.title} {playingVideo.suffix}
        </div>
        {performanceInfo && (
          <div style={{ fontWeight: "normal" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "normal",
              }}
            >
              {performanceInfo.name}{" "}
              {moment.utc(performanceInfo.date).format("YYYY")}
            </div>
          </div>
        )}
        {/* tbd add performance name & date */}
      </DialogTitle>
      <Divider />
      <DialogContent>
        {hasArtists ? (
          <>
            <DialogContentTitle>Performed By</DialogContentTitle>
            <div style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              {Object.getOwnPropertyNames(playingVideo.artists).map((key) => {
                return (
                  <>
                    <DialogContentHeader key={key}>{key}</DialogContentHeader>
                    <DialogContentSub>
                      {playingVideo.artists![key]!.map((artist, i) => {
                        if (!artist) {
                          return <div key={i}>-</div>;
                        }

                        return <div key={`${i}-${artist}`}>{artist}</div>;
                      })}
                    </DialogContentSub>
                  </>
                );
              })}
            </div>
            <DialogContentTitle>Original Credits</DialogContentTitle>
          </>
        ) : (
          <></>
        )}
        <div style={{ marginLeft: hasArtists ? "1rem" : "0" }}>
          <DialogContentHeader>Artist</DialogContentHeader>
          <DialogContentSub>{songInfo.artist}</DialogContentSub>

          <DialogContentHeader>Writer</DialogContentHeader>
          <DialogContentSub>{songInfo.writer}</DialogContentSub>

          <DialogContentHeader>Producer</DialogContentHeader>
          <DialogContentSub>{songInfo.producer}</DialogContentSub>

          {songInfo.originalCopyright ? (
            <DialogContentText sx={{ fontSize: "0.75rem" }}>
              &copy; {songInfo.originalCopyright}
            </DialogContentText>
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogContentTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <DialogContentText sx={{ fontSize: "1.15rem", fontWeight: "bold" }}>
      {children}
    </DialogContentText>
  );
};

const DialogContentHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <DialogContentText sx={{ fontSize: "1rem", fontWeight: "bold" }}>
      {children}
    </DialogContentText>
  );
};

const DialogContentSub: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <DialogContentText sx={{ fontSize: "0.85rem", marginLeft: "1rem" }}>
      {children}
    </DialogContentText>
  );
};

export default SongInfoDialog;
