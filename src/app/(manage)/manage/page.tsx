import type { NextPage } from "next";
import MenuBar from "./_components/menuBar";
import TabBar from "./_components/tabBar";
import { Typography } from "@mui/material";

const Manage: NextPage = () => {
  return (
    <MenuBar>
      <TabBar />
      <Typography variant="h4" component="p" sx={{ textAlign: "center" }}>
        TBD
      </Typography>
    </MenuBar>
  );
};

export default Manage;
