"use client";

import type { NextPage } from "next";
import TabBar from "../_components/tabBar";
import MenuBar from "../_components/menuBar";
import { useEffect, useState } from "react";
import type { ConfluenceMembers } from "@/db";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
} from "@mui/x-data-grid";
import db from "@/db";

const grades: Record<number, string> = {
  8: "Unknown",
  9: "Freshman",
  10: "Sophomore",
  11: "Junior",
  12: "Senior",
  13: "Graduated",
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "grade",
    headerName: "Grade",
    flex: 0.5,
    renderCell: (params) => grades[params.value as number],
  },
  {
    field: "instrument",
    headerName: "Instrument",
    flex: 0.5,
    renderCell: (params) => (params.value as string[]).join(", "),
  },
  {
    field: "headshot",
    headerName: "Headshot",
    width: 100,
    renderCell: (params) => {
      if (!params.value) return;
      const row: ConfluenceMembers = params.row;
      const path = db.files.getURL(row, params.value);

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${row.name}'s Headshot`}
          src={path}
          style={{ width: "auto", height: "100%", cursor: "pointer" }}
          onClick={() => {
            open(path, "_blank");
          }}
        />
      );
    },
  },
  {
    field: "seasons",
    headerName: "Season in Confluence",
    flex: 1,
    sortComparator: (v1, v2) => {
      const v1LatestSeason = (v1 as string[]).sort(
        (a, b) => parseInt(b) - parseInt(a),
      )[0]!;
      const v2LatestSeason = (v2 as string[]).sort(
        (a, b) => parseInt(b) - parseInt(a),
      )[0]!;

      return parseInt(v2LatestSeason) - parseInt(v1LatestSeason);
    },
    renderCell: (params) =>
      (params.value as string[])
        .sort((a, b) => {
          return parseInt(b) - parseInt(a);
        })
        .join(", "),
  },
];

const Meta: NextPage = () => {
  const [data, setData] = useState<ConfluenceMembers[]>();
  const [, setSelectedRow] = useState<ConfluenceMembers>();
  const [, setShowEditDialog] = useState(false);

  useEffect(() => {
    (async () => {
      const newData = await db
        .collection("confluenceMembers")
        .getFullList({ sort: "+name" });

      setData(newData);
    })();
  }, []);

  const handleEditCell: GridEventListener<"rowDoubleClick"> = (evt) => {
    setSelectedRow(evt.row);
    setShowEditDialog(true);
  };

  const handleSelectCell: GridEventListener<"rowClick"> = (evt) => {
    setSelectedRow(evt.row);
  };

  return (
    <MenuBar>
      <TabBar />
      <DataGrid
        rows={data}
        columns={columns}
        onRowDoubleClick={handleEditCell}
        onRowClick={handleSelectCell}
        loading={data === undefined}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          sorting: {
            sortModel: [
              {
                field: "seasons",
                sort: "asc",
              },
            ],
          },
        }}
      />
    </MenuBar>
  );
};

export default Meta;
