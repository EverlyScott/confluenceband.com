import db, {
  type ConfluencePerformances,
  type ConfluenceVenues,
  type Expand,
} from "@/db";
import ics from "ics";
import moment from "moment";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const performances = await db
    .collection("confluencePerformances")
    .getFullList<Expand<ConfluencePerformances, { venue: ConfluenceVenues }>>({
      expand: "venue",
    });

  const { error, value } = ics.createEvents(
    performances.map((performance) => {
      const date = moment.utc(performance.date);

      return {
        title: `Confluence @ ${performance.name}`,
        description: `Confluence performance located at ${performance.expand?.venue?.name}\nTickets: ${performance.ticketInfo}`,
        location: performance.expand?.venue?.address || undefined,
        start: [
          date.get("years"),
          date.get("months") + 1,
          date.get("days") + 1,
          date.get("hours"),
          date.get("minutes"),
        ],
        startInputType: "utc",
        duration: { hours: 2 },
        url: performance.ticketLink || undefined,
      };
    }),
  );

  if (error) throw error;

  return new NextResponse(value, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar",
    },
  });
};
