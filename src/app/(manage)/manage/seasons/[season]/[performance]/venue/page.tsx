"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../../../../_components/breadcrumbs";
import MenuBar from "../../../../_components/menuBar";
import db, { type ConfluencePerformances } from "@/db";
import { useParams } from "next/navigation";
import { Typography } from "@mui/material";

const Venue = () => {
  const [data, setData] = useState<ConfluencePerformances>();
  const { season, performance } = useParams<{
    season: string;
    performance: string;
  }>();

  useEffect(() => {
    (async () => {
      const newData = await db
        .collection("confluencePerformances")
        .getOne(performance);

      setData(newData);
    })();
  }, [performance]);

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
            name: data?.name ?? performance,
          },
          {
            path: `/manage/seasons/${season}/${performance}/venue`,
            name: "Venue",
          },
        ]}
      />
      <Typography variant="h4" component="p" sx={{ textAlign: "center" }}>
        TBD
      </Typography>
    </MenuBar>
  );
};

export default Venue;
