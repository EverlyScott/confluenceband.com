"use client";

import { Tab, Tabs } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const tabRoutes = {
  "/manage": "Overview",
  "/manage/seasons": "Seasons",
  "/manage/performances": "All Performances",
  "/manage/meta": "Metadata",
  "/manage/members": "Members",
} as const;

type Routes = keyof typeof tabRoutes;

const TabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (page: Routes) => () => {
    router.push(page);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Tabs value={pathname} variant="scrollable" allowScrollButtonsMobile>
        {Object.getOwnPropertyNames(tabRoutes).map((Route) => {
          const route = Route as Routes;

          return (
            <Tab
              label={tabRoutes[route]}
              value={route}
              onClick={handleClick(route)}
              key={route}
            />
          );
        })}
      </Tabs>
    </div>
  );
};

export default TabBar;
