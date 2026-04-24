"use client";

import { useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../../_components/breadcrumbs";
import MenuBar from "../../_components/menuBar";
import db, { type ConfluencePerformances } from "@/db";
import { useParams, useRouter } from "next/navigation";
import { performanceColumns } from "@/app/(manage)/columns";
import FormField from "@/app/(manage)/FormField";
import type { RecordModel } from "pocketbase";
import { Button, DialogActions } from "@mui/material";

const Performance = () => {
  const router = useRouter();
  const [data, setData] = useState<RecordModel & ConfluencePerformances>();
  const [seasonName, setSeasonName] = useState<string>();
  const { performance } = useParams<{
    performance: string;
  }>();

  const fetchData = useCallback(async () => {
    const newData = await db
      .collection("confluencePerformances")
      .getOne(performance, { expand: "venue" });

    setData(newData);

    const season = await db
      .collection("confluenceSeasons")
      .getOne(newData.season);

    setSeasonName(season.season.toString());
  }, [performance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            path: `/manage/seasons/${data?.season}`,
            name: seasonName ?? data?.name ?? "...",
          },
          {
            path: `/manage/performances/${performance}`,
            name: data?.name ?? performance,
          },
        ]}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "750px",
            flexGrow: 1,
          }}
        >
          {performanceColumns.map((col) => {
            return (
              <FormField
                data={data}
                setData={setData}
                column={col}
                key={col.field}
              />
            );
          })}
          <DialogActions>
            <Button variant="text" onClick={fetchData}>
              Revert
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                alert("TBD");
                router.push(`/manage/seasons/${data?.season}`);
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </div>
      </div>
    </MenuBar>
  );
};

export default Performance;
