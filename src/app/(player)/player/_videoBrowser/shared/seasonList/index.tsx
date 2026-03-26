import useVideoBrowserState from "../../context";
import Season from "./season";
import styles from "./index.module.scss";

const SeasonList: React.FC = () => {
  const { seasons } = useVideoBrowserState();

  return (
    <div className={styles.performances}>
      <p
        style={{ fontSize: "0.9rem", textAlign: "center", fontStyle: "italic" }}
      >
        Performances are still being added and some videos may not play.
      </p>
      {seasons.map((season, i) => {
        return (
          <Season isLatest={i === 0} season={season} key={season.season} />
        );
      })}
    </div>
  );
};

export default SeasonList;
