"use client";

import { UserButton } from "@clerk/nextjs";
import {
  AppBar,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Home from "@mui/icons-material/Home";

const MenuBar: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Tooltip title="Home">
            <IconButton href="/">
              <Home />
            </IconButton>
          </Tooltip>
          <div style={{ flexGrow: 1, marginLeft: "1rem", display: "flex" }}>
            <Link underline="hover" color="inherit" href="/manage">
              <Typography variant="h6" component="div">
                Manage
              </Typography>
            </Link>
          </div>
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
