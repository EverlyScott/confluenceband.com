import type { Metadata, NextPage } from "next";
import type React from "react";
import { metadata as rootMetadata } from "@/app/(root)/layout";
import { Nunito } from "next/font/google";
import classNames from "classnames";
import "../globals.scss";
import styles from "./layout.module.scss";
import ThemeProvider from "@/theme";

export const metadata: Metadata = {
  title: "Player | The La Crosse Confluence",
  description: rootMetadata.description,
  icons: rootMetadata.icons,
};

const nunito = Nunito({
  subsets: ["latin"],
});

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={classNames(nunito.className, styles.body)}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
