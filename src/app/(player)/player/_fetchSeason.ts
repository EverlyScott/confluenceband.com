import db from "@/db";
import type { ISeason } from "./_videoBrowser";

const fetchSeason = async (season: number): Promise<ISeason> => {
  try {
    return await db.send(`/api/hooks/season/${season}/full`, {});
  } catch {
    let errString =
      "Failed to fetch season! An adblocker may be causing this issue, try disabling it.";

    if (typeof window === "undefined") {
      errString = "Failed to fetch season!";
    } else {
      alert(errString);
    }

    throw new Error(errString);
  }
};

export default fetchSeason;
