"use client";

import { Link } from "@mui/material";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { usePathname } from "next/navigation";

interface IProps {
  links: { path: string; name: string }[];
}

const Breadcrumbs: React.FC<IProps> = ({ links }) => {
  const pathname = usePathname();

  return (
    <MUIBreadcrumbs
      sx={{
        margin: "1rem",
      }}
    >
      {links.map((link) => (
        <Link
          sx={pathname === link.path ? { color: "text.primary" } : undefined}
          key={link.path}
          underline="hover"
          color="inherit"
          href={link.path}
        >
          {link.name}
        </Link>
      ))}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
