"use client";

import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../../../_components/breadcrumbs";
import MenuBar from "../../../../_components/menuBar";
import db, {
  type ConfluenceVideos,
  type ConfluenceSongs,
  type Expand,
} from "@/db";
import { useParams } from "next/navigation";
import { Typography } from "@mui/material";

const Video = () => {
  const [performanceName, setPerformanceName] = useState<string>();
  const [data, setData] =
    useState<Expand<ConfluenceVideos, { song: ConfluenceSongs }>>();
  const { season, performance, video } = useParams<{
    season: string;
    performance: string;
    video: string;
  }>();

  const songTitle = useMemo(
    () =>
      data
        ? `${data?.performanceOrder}. ${data?.expand?.song?.title}${data?.suffix ? ` ${data.suffix}` : ""}`
        : video,
    [data, video],
  );

  useEffect(() => {
    (async () => {
      const performanceData = await db
        .collection("confluencePerformances")
        .getOne(performance);

      setPerformanceName(performanceData.name);

      const data = await db
        .collection("confluenceVideos")
        .getOne(video, { expand: "song" });

      setData(data);
    })();
  }, [performance, video]);

  return (
    <MenuBar>
      <Breadcrumbs
        links={[
          {
            path: "/manage",
            name: "Manage",
          },
          {
            path: "/manage/seasons",
            name: "Seasons",
          },
          {
            path: `/manage/seasons/${season}`,
            name: season,
          },
          {
            path: `/manage/seasons/${season}/${performance}`,
            name: performanceName ?? performance,
          },
          {
            path: `/manage/seasons/${season}/${performance}/${video}`,
            name: songTitle,
          },
        ]}
      />
      <Typography variant="h4" component="p" sx={{ textAlign: "center" }}>
        TBD
      </Typography>
    </MenuBar>
  );
};

export default Video;
