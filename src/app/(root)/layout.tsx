import { type Metadata } from "next";
import { Nunito } from "next/font/google";
import "../globals.scss";
import ThemeProvider from "@/theme";

export const metadata: Metadata = {
  title: "The La Crosse Confluence",
  description:
    "The La Crosse Confluence is a high energy cover band made up of talented high school musicians that play a variety of music from Journey and Green Day, to Chappel Roan, Laufey, and everything in between.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=0.8, width=device-width" />
      </head>
      <body className={nunito.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
