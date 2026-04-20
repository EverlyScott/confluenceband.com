"use client";

import db, {
  type Expand,
  type ConfluencePerformances,
  type ConfluenceVenues,
} from "@/db";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
} from "@mui/x-data-grid";
import type { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MenuBar from "../../_components/menuBar";
import Breadcrumbs from "../../_components/breadcrumbs";
import moment from "moment";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
  },
  {
    field: "venue",
    headerName: "Venue",
    flex: 1,
    renderCell: (params) => {
      const row: Expand<ConfluencePerformances, { venue: ConfluenceVenues }> =
        params.row;

      return row.expand?.venue?.name ?? row.venue;
    },
  },
  {
    field: "season",
    headerName: "Season",
    flex: 1,
  },
  {
    field: "date",
    headerName: "Date/Time",
    width: 175,
    renderCell: (params) => {
      return moment.utc(params.value).local().format("YYYY-MM-DD h:mm A");
    },
  },
  {
    field: "length",
    headerName: "Length (Hours)",
    width: 125,
  },
  {
    field: "ticketInfo",
    headerName: "Ticket Price",
    flex: 2,
  },
  {
    field: "miscInfo",
    headerName: "Misc Ticket Info",
    flex: 1,
  },
  {
    field: "ticketLink",
    headerName: "Tickets/Info Link",
    flex: 1,
  },
  {
    field: "ticketsFree",
    headerName: "Free Tickets",
    width: 100,
  },
  {
    field: "performanceNote",
    headerName: "Performance Notes",
    flex: 1,
  },
  {
    field: "hasCoverArt",
    headerName: "Use Cover Art",
    width: 125,
  },
  {
    field: "coverArtCredit",
    headerName: "Cover Art Credit",
    flex: 1,
  },
];

const Performances: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<ConfluencePerformances[]>();
  const { season } = useParams<{ season: string }>();

  useEffect(() => {
    (async () => {
      const newData = await db
        .collection("confluencePerformances")
        .getFullList<
          Expand<ConfluencePerformances, { venue: ConfluenceVenues }>
        >({ filter: `season="${season}"`, expand: "venue" });

      setData(newData);
    })();
  }, [season]);

  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (evt) => {
    const row: ConfluencePerformances = evt.row;

    router.push(`/manage/seasons/${season}/${row.id}`);
  };

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
        ]}
      />
      <DataGrid
        rows={data}
        columns={columns}
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
              season: false,
            },
          },
        }}
        sx={{ margin: "1rem" }}
      />
    </MenuBar>
  );
};

export default Performances;
