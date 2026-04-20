"use client";

import type { NextPage } from "next";
import TabBar from "../_components/tabBar";
import MenuBar from "../_components/menuBar";
import { useEffect, useState } from "react";
import type { ConfluenceMeta } from "@/db";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
} from "@mui/x-data-grid";
import db from "@/db";
import EditDialog from "./editDialog";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 150,
  },
  {
    field: "content",
    headerName: "Content",
    flex: 1,
    renderCell: (params) => JSON.stringify(params.value),
  },
];

export const metaRowDescriptions = {
  currentSeason: "The current confluence season.",
  instrumentsort:
    "The order of instruments whenever the site is listing different instruments.",
};

const Meta: NextPage = () => {
  const [data, setData] = useState<ConfluenceMeta[]>();
  const [selectedRow, setSelectedRow] = useState<ConfluenceMeta>();
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    (async () => {
      const newData = await db.collection("confluenceMeta").getFullList();

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
        sx={{ margin: "1rem" }}
      />
      <EditDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        data={selectedRow}
      />
    </MenuBar>
  );
};

export default Meta;
