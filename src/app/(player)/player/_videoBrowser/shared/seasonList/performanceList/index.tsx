import type { ISeason } from "@/app/(player)/player/_videoBrowser";
import LoadingPerformances from "./loadingPerformances";
import Performance from "./performance";
import { useMemo } from "react";

interface IProps {
  isLatest: boolean;
  season: ISeason;
}

const PerformanceList: React.FC<IProps> = ({ isLatest, season }) => {
  const filteredPerformances = useMemo(
    () =>
      season.performances?.filter?.(
        (performance) => performance.videos.length !== 0,
      ),
    [season],
  );

  if (season.performances === null) {
    return new Array(10).fill("").map((_, i) => {
      return <LoadingPerformances key={i} />;
    });
  }

  if ((filteredPerformances ?? []).length === 0) {
    return (
      <p style={{ fontSize: "0.9rem", marginTop: "-10px", marginLeft: "2rem" }}>
        No performances yet. Check back later!
      </p>
    );
  }

  let firstRealPerformanceIndex = -1;

  return season.performances.map((performance, i) => {
    if (firstRealPerformanceIndex === -1 && performance.videos.length !== 0) {
      firstRealPerformanceIndex = i;
    }

    return (
      <Performance
        isLatest={isLatest && i === firstRealPerformanceIndex}
        performance={performance}
        key={performance.id}
      />
    );
  });
};

export default PerformanceList;
