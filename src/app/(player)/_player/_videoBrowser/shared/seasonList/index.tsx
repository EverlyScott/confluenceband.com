import useVideoBrowserState from "../../context";
import Season from "./season";
import styles from "./index.module.scss";

const SeasonList: React.FC = () => {
  const { seasons } = useVideoBrowserState();

  return (
    <div className={styles.performances}>
      {seasons.map((season, i) => {
        return (
          <Season isLatest={i === 0} season={season} key={season.season} />
        );
      })}
    </div>
  );
};

export default SeasonList;
