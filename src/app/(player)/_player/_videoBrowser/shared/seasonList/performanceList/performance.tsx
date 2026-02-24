import type { FullPerformance } from "@/app/(player)/_player/_videoBrowser";
import useVideoBrowserState from "../../../context";
import { useMemo, type MouseEventHandler } from "react";
import Link from "next/link";
import styles from "./performance.module.scss";
import classNames from "classnames";
import Image from "next/image";
import moment from "moment";

interface IProps {
  isLatest: boolean;
  performance: FullPerformance;
}

const Performance: React.FC<IProps> = ({ isLatest, performance }) => {
  const { selectedPerformance, handleSetSelectedPerformance } =
    useVideoBrowserState();
  const selected = useMemo(() => {
    return (
      selectedPerformance !== undefined &&
      selectedPerformance.id === performance.id
    );
  }, [selectedPerformance, performance]);

  if (performance.videos.length === 0) {
    return <></>;
  }

  const handleClickLink: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    handleSetSelectedPerformance(performance, evt);
  };

  return (
    <Link
      href={`/?performance=${performance.id}#performances`}
      onClick={handleClickLink}
      className={styles.link}
    >
      <div
        className={classNames(
          styles.container,
          selected ? styles.selected : undefined,
        )}
      >
        <div
          className={styles.imgContainer}
          data-new={
            isLatest && Date.now() - Date.parse(performance.date) < 1209600000 // 2 weeks
          }
        >
          <Image
            src={`${performance.videos[0]?.rootUrl}thumb.avif`}
            width={1280}
            height={720}
            alt={`Thumbnail for ${performance.name}`}
            className={styles.img}
          />
        </div>
        <div className={styles.text}>
          <h3>{performance.name}</h3>
          {performance.expand?.venue &&
          performance.expand?.venue?.name !== performance.name ? (
            <p className={styles.venue}>@ {performance.expand.venue.name}</p>
          ) : (
            <></>
          )}
          <p>{moment.utc(performance.date).format("MMM Do, YYYY")}</p>
        </div>
      </div>
    </Link>
  );
};

export default Performance;
