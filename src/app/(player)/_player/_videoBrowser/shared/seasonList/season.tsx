import type { ISeason } from "@/app/(player)/_player/_videoBrowser";
import { useEffect, useMemo, useRef, useState } from "react";
import useVideoBrowserState from "../../context";
import styles from "./season.module.scss";
import PerformanceList from "./performanceList";

interface IProps {
  isLatest: boolean;
  season: ISeason;
}

const Season: React.FC<IProps> = ({ isLatest, season }) => {
  const { expanded, toggleTab } = useVideoBrowserState();

  const isExpanded = useMemo(
    () => expanded.includes(season.season),
    [expanded, season],
  );

  const contentElem = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const handleContentSizeChange: ResizeObserverCallback = (entries) => {
    setHeight(entries[0]!.contentRect.height);
  };

  const resizeObserver = useRef(
    typeof window === "undefined"
      ? undefined
      : new ResizeObserver(handleContentSizeChange),
  );

  useEffect(() => {
    const ro = resizeObserver.current;
    const content = contentElem.current;

    if (ro === undefined) return;

    if (content !== null) {
      ro.observe(content);
    }

    return () => {
      if (content !== null) {
        ro.unobserve(content);
      }
    };
  }, []);

  const toggleExpand = () => {
    toggleTab(season.season);
  };

  return (
    <div className={styles.details} data-open={isExpanded ? true : undefined}>
      <div onClick={toggleExpand} className={styles.summary}>
        <h3>{season.season}</h3>
      </div>
      <div
        className={styles.content}
        style={{
          height: isExpanded ? `calc(${height}px + 1.5rem)` : "0px",
        }}
      >
        <div ref={contentElem} className={styles.finalContent}>
          <PerformanceList isLatest={isLatest} season={season} />
        </div>
      </div>
    </div>
  );
};

export default Season;
