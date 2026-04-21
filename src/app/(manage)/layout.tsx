import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { metadata as rootMetadata } from "@/app/(root)/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CssBaseline } from "@mui/material";
import clerkAppearance from "./clerkApperance";
import PbAuth from "./pbAuth";
import MuiProvider from "./theme";

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

const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <MuiProvider>
            <ClerkProvider appearance={clerkAppearance}>
              <PbAuth />
              <CssBaseline />
              {children}
            </ClerkProvider>
          </MuiProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default Layout;
