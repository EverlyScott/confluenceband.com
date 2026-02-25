import Skeleton from "@mui/material/Skeleton";
import styles from "./performance.module.scss";

const LoadingPerformances: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Skeleton variant="rounded" sx={{ bgcolor: "#7943bd" }}>
          <div className={styles.img}></div>
        </Skeleton>
      </div>
      <div className={styles.text} style={{ width: "100%" }}>
        <Skeleton sx={{ bgcolor: "#7943bd" }}>
          <h3>Performance Name</h3>
        </Skeleton>
        <Skeleton sx={{ bgcolor: "#7943bd" }}>
          <p style={{ fontStyle: "italic" }}>@ Performance Location</p>
        </Skeleton>
        <Skeleton sx={{ bgcolor: "#7943bd" }}>
          <p>Jan 1st, 1999</p>
        </Skeleton>
      </div>
    </div>
  );
};

export default LoadingPerformances;
