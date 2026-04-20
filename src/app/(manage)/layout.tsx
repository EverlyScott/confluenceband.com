import type { Metadata, NextPage } from "next";
import { Roboto } from "next/font/google";
import { metadata as rootMetadata } from "@/app/(root)/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import clerkAppearance from "./clerkApperance";
import PbAuth from "./pbAuth";

export const metadata: Metadata = {
  title: "Manage | The La Crosse Confluence",
  description: rootMetadata.description,
  icons: rootMetadata.icons,
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const Layout: NextPage<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ClerkProvider appearance={clerkAppearance}>
              <PbAuth />
              <CssBaseline />
              {children}
            </ClerkProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default Layout;
