"use client";

import { createContext, useContext, useState, type MouseEvent } from "react";
import type { FullPerformance, ISeason } from ".";
import type { FullVideo } from "./shared/videoList";
import fetchSeason from "../_fetchSeason";
import type { SeasonPerformanceCount } from "@/db";

interface VideoBrowserContext {
  expanded: number[];
  seasons: ISeason[];
  seasonPerformanceCount: SeasonPerformanceCount;
  selectedPerformance: FullPerformance | undefined;
  setSelectedPerformance: React.Dispatch<
    React.SetStateAction<FullPerformance | undefined>
  >;
  handleSetSelectedPerformance: (
    performance: FullPerformance | undefined,
    evt?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  playingVideo: FullVideo | undefined;
  setPlayingVideo: React.Dispatch<React.SetStateAction<FullVideo | undefined>>;
  toggleTab: (seasonId: number) => void;
  playerExpanded: boolean;
  setPlayerExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const videoBrowserContext = createContext<VideoBrowserContext | null>(null);

export const useVideoBrowserState = () => {
  const context = useContext(videoBrowserContext);

  if (context === null) {
    throw new Error("Missing VideoBrowserProvider!");
  }

  return context;
};

export default useVideoBrowserState;

interface ProviderProps {
  payload: ISeason[];
  preExpandedTabs: number[];
  initialSelectedPerformance?: FullPerformance;
  seasonPerformanceCount: SeasonPerformanceCount;
}

export const VideoBrowserProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({
  payload,
  preExpandedTabs,
  initialSelectedPerformance,
  seasonPerformanceCount,
  children,
}) => {
  const [expanded, setExpanded] =
    useState<VideoBrowserContext["expanded"]>(preExpandedTabs);
  const [seasons, setSeasons] =
    useState<VideoBrowserContext["seasons"]>(payload);
  const [selectedPerformance, setSelectedPerformance] = useState<
    VideoBrowserContext["selectedPerformance"]
  >(
    initialSelectedPerformance ??
      seasons[0]?.performances?.find((val) => val.videos.length !== 0),
  );
  const [playingVideo, setPlayingVideo] =
    useState<VideoBrowserContext["playingVideo"]>();
  const [playerExpanded, setPlayerExpanded] = useState(false);

  const toggleTab: VideoBrowserContext["toggleTab"] = (seasonId) => {
    setExpanded((newExpanded) => {
      const expanded = [...newExpanded]; // Clone object

      const existingIndex = expanded.findIndex((val) => val === seasonId);

      if (existingIndex === -1) {
        expanded.push(seasonId);

        const season = seasons.find((season) => season.season === seasonId);
        if (season?.performances === null) {
          fetchAndUpdateSeason(seasonId);
        }
      } else {
        expanded.splice(existingIndex, 1);
      }

      return expanded;
    });
  };

  const fetchAndUpdateSeason = async (seasonId: number) => {
    const fetchedSeason = await fetchSeason(seasonId);

    setSeasons((seasons) => {
      const newSeasons = [...seasons];
      const oldIndex = seasons.findIndex((val) => val.season === seasonId);
      if (oldIndex === -1) {
        throw new Error("Could not find old index of season whilst loading!");
      }
      newSeasons.splice(oldIndex, 1, fetchedSeason);
      return newSeasons;
    });
  };

  const handleSetSelectedPerformance: VideoBrowserContext["handleSetSelectedPerformance"] =
    (performance, evt) => {
      evt?.preventDefault?.();

      const newUrl = new URL(window.location.href);
      if (performance) {
        newUrl.searchParams.set("performance", performance.id);
        newUrl.hash = "#performances";
      } else {
        newUrl.searchParams.delete("performance");
        newUrl.hash = "";
      }
      history.replaceState({}, "", newUrl);
      setSelectedPerformance(performance);
    };

  return (
    <videoBrowserContext.Provider
      value={{
        expanded,
        seasons,
        seasonPerformanceCount,
        selectedPerformance,
        setSelectedPerformance,
        handleSetSelectedPerformance,
        playingVideo,
        setPlayingVideo,
        toggleTab,
        playerExpanded,
        setPlayerExpanded,
      }}
    >
      {children}
    </videoBrowserContext.Provider>
  );
};
