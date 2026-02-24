import BandMembers from "./_bandMembers";
import FuturePerformances from "./_futurePerformances";
import styles from "./styles.module.scss";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.cover}>
        <div className={styles.logo} />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.contentTransition} />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <p>
              The La Crosse Confluence is a high energy cover band of talented
              high school musicians. The band plays an incredible variety of
              music from Aretha Franklin to Adele, from Charlie Daniels Band to
              Dave Matthews Band and everything in between (and beyond). Since
              its inception in 2023, everyone who sees The La Crosse Confluence
              is always amazed at the talent of these young musicians.
              <br />
              <br />
              The band performs throughout the Coulee Region from spring through
              early fall. Some performance highlights include Ashley for the
              Arts, Deecefest, Moontunes, Leo and Leona&apos;s and the Vernon
              County Fair.
            </p>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <FuturePerformances />
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <h2>Band Members</h2>
            <BandMembers />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
