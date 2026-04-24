import type {
  Collections,
  ConfluencePerformances,
  ConfluenceVenues,
  Expand,
} from "@/db";
import db from "@/db";
import type { GridColDef } from "@mui/x-data-grid";

export interface CustomColumnData {
  hideInEditMode?: boolean;
  disabled?: boolean;
  editingType?: "ref";
  referenceTo?: keyof Collections;
  multiline?: boolean;
  startAdornment?: string;
  endAdornment?: string;
  hideAdornmentsWhenNoValue?: boolean;
  fetchRefOptions?: () => RefOption[] | Promise<RefOption[]>;
}

export interface RefOption {
  id: string;
  name: string;
}

export type Column = GridColDef & CustomColumnData;

export const performanceColumns: Column[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    type: "string",
    disabled: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    type: "string",
  },
  {
    field: "venue",
    headerName: "Venue",
    flex: 1,
    renderCell: (params) => {
      const row: Expand<ConfluencePerformances, { venue: ConfluenceVenues }> =
        params.row;

      return row.expand?.venue?.name ?? row.venue;
    },
    type: "string",
    editingType: "ref",
    referenceTo: "confluenceVenues",
    fetchRefOptions: async () => {
      const venues = await db.collection("confluenceVenues").getFullList();

      return venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
      }));
    },
  },
  {
    field: "season",
    headerName: "Season",
    flex: 1,
    type: "string",
  },
  {
    field: "date",
    headerName: "Date/Time",
    width: 175,
    valueGetter: (value) => new Date(value),
    type: "dateTime",
  },
  {
    field: "length",
    headerName: "Length (Hours)",
    width: 125,
    type: "number",
  },
  {
    field: "ticketInfo",
    headerName: "Ticket Info",
    flex: 2,
    type: "string",
    multiline: true,
  },
  {
    field: "miscInfo",
    headerName: "Misc Ticket Info",
    flex: 1,
    type: "string",
    multiline: true,
  },
  {
    field: "ticketLink",
    headerName: "Tickets/Info Link",
    flex: 1,
    type: "string",
  },
  {
    field: "ticketsFree",
    headerName: "Free Tickets",
    width: 100,
    type: "boolean",
  },
  {
    field: "performanceNote",
    headerName: "Performance Notes",
    flex: 1,
    type: "string",
    multiline: true,
  },
  {
    field: "hasCoverArt",
    headerName: "Use Cover Art",
    width: 125,
    type: "boolean",
  },
  {
    field: "coverArtCredit",
    headerName: "Cover Art Credit",
    flex: 1,
    type: "string",
    startAdornment: "Cover Art Taken By",
  },
];
