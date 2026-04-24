"use client";

import db, {
  type Expand,
  type ConfluencePerformances,
  type ConfluenceVenues,
  type ConfluenceSeasons,
} from "@/db";
import { DataGrid, type GridEventListener } from "@mui/x-data-grid";
import type { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MenuBar from "../_components/menuBar";
import Breadcrumbs from "../_components/breadcrumbs";
import { performanceColumns } from "@/app/(manage)/columns";
import TabBar from "../_components/tabBar";

const Performances: NextPage<{ seasonId?: string }> = ({ seasonId }) => {
  const router = useRouter();
  const [season, setSeason] = useState<ConfluenceSeasons>();
  const [data, setData] = useState<ConfluencePerformances[]>();
  const params = useParams<{ season: string }>();

  useEffect(() => {
    (async () => {
      if (seasonId) {
        const newSeason = await db
          .collection("confluenceSeasons")
          .getOne(params.season);

        setSeason(newSeason);
      }

      const newData = await db
        .collection("confluencePerformances")
        .getFullList<
          Expand<ConfluencePerformances, { venue: ConfluenceVenues }>
        >({ filter: seasonId ? `season="${seasonId}"` : undefined, expand: "venue" });

      setData(newData);
    })();
  }, [params.season, seasonId]);

  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (evt) => {
    const row: ConfluencePerformances = evt.row;

    router.push(`/manage/performances/${row.id}`);
  };

  return (
    <MenuBar>
      {seasonId ? (
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
              path: `/manage/seasons/${seasonId}`,
              name: season?.season.toString() ?? seasonId,
            },
          ]}
        />
      ) : (
        <TabBar />
      )}

      <DataGrid
        rows={data}
        columns={performanceColumns}
        onRowDoubleClick={handleRowDoubleClick}
        loading={data === undefined}
        localeText={{
          footerRowSelected: () => "Double click to edit performance",
        }}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: "date",
                sort: "desc",
              },
            ],
          },
          columns: {
            columnVisibilityModel: {
              id: false,
              season: !seasonId,
            },
          },
        }}
      />
    </MenuBar>
  );
};

export default Performances;
