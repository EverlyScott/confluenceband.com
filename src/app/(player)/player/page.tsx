import type { NextPage } from "next";
import db, {
  type ConfluencePerformances,
  type ConfluenceSeasons,
  type Expand,
} from "@/db";
import { VideoBrowserProvider } from "./_videoBrowser/context";
import VideoBrowser, {
  type FullPerformance,
  type ISeason,
} from "./_videoBrowser";
import fetchSeason from "./_fetchSeason";

interface IProps {
  searchParams: Promise<{ performance?: string }>;
}

const PlayerPage: NextPage<IProps> = async ({ searchParams }) => {
  const { performance: selectedPerformance } = await searchParams;

  const seasonsList = await db
    .collection("confluenceSeasons")
    .getFullList({ sort: "-season" });

  if (!seasonsList[0]) {
    throw new Error("Latest season does not exist!");
  }

  const payload: ISeason[] = await Promise.all(
    seasonsList.map(async ({ season }, i) => {
      if (i === 0) {
        return await fetchSeason(season);
      }

      return {
        season,
        performances: null,
      };
    }),
  );

  let selectedPerformancePayload: FullPerformance | undefined = undefined;

  if (selectedPerformance) {
    const performance = await db
      .collection("confluencePerformances")
      .getFirstListItem<
        Expand<ConfluencePerformances, { season: ConfluenceSeasons }>
      >(`id="${selectedPerformance}"`, { expand: "season" });

    if (!performance.expand?.season?.season) {
      throw new Error(
        "Season not found while loading from selected performance!",
      );
    }

    const season = performance.expand.season.season;

    const oldIndex = payload.findIndex((val) => val.season === season);

    if (oldIndex === -1) {
      throw new Error("Could not find old index of season whilst loading!");
    }

    const seasonPayload = await fetchSeason(season);

    payload.splice(oldIndex, 1, seasonPayload);

    selectedPerformancePayload = seasonPayload.performances?.find?.(
      (val) => val.id === selectedPerformance,
    );
  }

  return (
    <VideoBrowserProvider
      payload={payload}
      preExpandedTabs={payload
        .filter((season) => season.performances !== null)
        .map((season) => season.season)}
      initialSelectedPerformance={selectedPerformancePayload}
    >
      <VideoBrowser />
    </VideoBrowserProvider>
  );
};

export default PlayerPage;
