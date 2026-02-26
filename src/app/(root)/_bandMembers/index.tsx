"use client";

import db from "@/db";
import type { ConfluenceMembers } from "@/db";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const BandMembers: React.FC = () => {
  const [bandMembers, setBandMembers] = useState<ConfluenceMembers[]>([]);
  const [currentSeason, setCurrentSeason] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const currentSeason = (
        await db.collection("confluenceMeta").getOne("currentSeason")
      ).content as string | null;

      setCurrentSeason(currentSeason);
    })();
  }, []);

  useEffect(() => {
    if (currentSeason === null) return;

    (async () => {
      const instrumentSort = (
        await db.collection("confluenceMeta").getOne("instrumentsort")
      ).content as string[];

      const unsortedMembers = await db
        .collection("confluenceMembers")
        .getFullList({
          sort: "name",
          filter: `seasons.id ?= "${currentSeason}"`,
        });

      const members: ConfluenceMembers[] = [];

      for (const instrument of instrumentSort) {
        const membersWithInstrument = unsortedMembers.filter(
          (member) => member.instrument[0] === instrument,
        );

        members.push(...membersWithInstrument);
      }

      setBandMembers(members);
    })();
  }, [currentSeason]);

  if (currentSeason === null) {
    return (
      <div className={styles.container}>
        <h3>
          Confluence is currently out of season.
          <br />
          Check back in Spring.
        </h3>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {bandMembers.map((member) => {
        return (
          <div
            className={styles.memberContainer}
            key={member.id}
            style={{
              backgroundImage: `url("${db.files.getURL(member, member.headshot)}")`,
            }}
          >
            <div className={styles.memberInfo}>
              <h3>{member.name}</h3>
              <p>{member.instrument.join("/")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BandMembers;
