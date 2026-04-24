"use client";

import db, { type ConfluenceSeasons } from "@/db";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
} from "@mui/x-data-grid";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MenuBar from "../_components/menuBar";
import TabBar from "../_components/tabBar";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "season",
    headerName: "Seasons",
    flex: 1,
  },
];

const Seasons: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<ConfluenceSeasons[]>();

  useEffect(() => {
    (async () => {
      const newData = await db.collection("confluenceSeasons").getFullList();

      setData(newData);
    })();
  }, []);

  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (evt) => {
    const row = evt.row as ConfluenceSeasons;

    router.push(`/manage/seasons/${row.id}`);
  };

  return (
    <MenuBar>
      <TabBar />
      <DataGrid
        rows={data}
        columns={columns}
        onRowDoubleClick={handleRowDoubleClick}
        loading={data === undefined}
        localeText={{
          footerRowSelected: () => "Double click to browse",
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "season", sort: "desc" }],
          },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
    </MenuBar>
  );
};

export default Seasons;
