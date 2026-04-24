"use client";

import { useParams } from "next/navigation";
import Performances from "../../performances/page";
import type { NextPage } from "next";

const SeasonPerformances: NextPage = () => {
  const params = useParams<{ season: string }>();

  return <Performances seasonId={params.season} />;
};

export default SeasonPerformances;
