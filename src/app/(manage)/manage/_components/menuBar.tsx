"use client";

import { UserButton } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography } from "@mui/material";

const MenuBar: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage
          </Typography>
          <UserButton />
        </Toolbar>
      </AppBar>
      <div>
        <Toolbar />
        {children}
      </div>
    </>
  );
};

export default MenuBar;
