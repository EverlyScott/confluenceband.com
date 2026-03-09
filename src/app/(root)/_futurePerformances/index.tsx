"use client";

import type { ConfluencePerformances, ConfluenceVenues } from "@/db";
import db from "@/db";
import type { Expand } from "@/db";
import { Suspense, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import moment from "moment";
import FuturePerformance from "./futurePerformance";
import { useSearchParams } from "next/navigation";

const FuturePerformances: React.FC = () => {
  const [loadingFuturePerformances, setLoadingFuturePerformances] =
    useState(true);
  const [futurePerformances, setFuturePerformances] = useState<
    Expand<ConfluencePerformances, { venue: ConfluenceVenues }>[]
  >([]);

  useEffect(() => {
    (async () => {
      const currentDate = Date.now();

      const performances = await db
        .collection("confluencePerformances")
        .getFullList({ expand: "venue", sort: "date" });

      const futurePerformances = performances.filter(
        (performance) => new Date(performance.date).getTime() > currentDate,
      );

      setFuturePerformances(futurePerformances);
      setLoadingFuturePerformances(false);
    })();
  }, []);

  if (loadingFuturePerformances) {
    return (
      <>
        <h2>Future Performances</h2>
        {new Array(4).fill("").map((_, i) => {
          return (
            <FuturePerformance
              key={i}
              performanceName="&nbsp;"
              formattedPerformanceTime="&nbsp;"
              venueAddress="&nbsp;"
              ticketInfo="&nbsp;"
            />
          );
        })}
        <Suspense>
          <WatchPriorPerformances />
        </Suspense>
      </>
    );
  }

  if (futurePerformances.length === 0) {
    return (
      <>
        <h2>Future Performances</h2>
        <h3>There are currently no future performances scheduled.</h3>
        <Suspense>
          <WatchPriorPerformances />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <h2>Future Performances</h2>
      {/* <a
        className={styles.addToCalendar}
        href="webcal://confluenceband.com/api/calendar/confluence.ics"
      >
        Add to Calendar
      </a> */}
      {futurePerformances.map((performance) => {
        return (
          <FuturePerformance
            key={performance.id}
            performanceName={performance.name}
            formattedPerformanceTime={moment(performance.date).format(
              "MMMM Do YYYY h:mm A",
            )}
            venueAddress={performance.expand?.venue?.address}
            ticketInfo={performance.ticketInfo}
            miscInfo={performance.miscInfo}
            ticketLink={performance.ticketLink}
            venueImageUrl={
              performance.expand?.venue?.venueImage
                ? `url("${db.files.getURL(performance.expand.venue, performance.expand.venue.venueImage)}")`
                : undefined
            }
          />
        );
      })}
      <Suspense>
        <WatchPriorPerformances />
      </Suspense>
    </>
  );
};

const WatchPriorPerformances: React.FC = () => {
  const searchParams = useSearchParams();

  const isBeta = useMemo(
    () => searchParams.get("beta") === "true",
    [searchParams],
  );

  if (!isBeta) {
    return <></>;
  }

  return (
    <div className={classNames(styles.performanceContainer, styles.hasLink)}>
      <a href="/player" className={styles.ticketLink}>
        <div className={styles.performance}>
          <div style={{ flexGrow: 1 }}>
            <h3 className={styles.performanceName}>Watch Prior Performances</h3>
          </div>
        </div>
      </a>
    </div>
  );
};

export default FuturePerformances;
