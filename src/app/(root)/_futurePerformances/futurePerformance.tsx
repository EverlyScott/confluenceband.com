import classNames from "classnames";
import styles from "./styles.module.scss";

interface IProps {
  performanceName: string;
  formattedPerformanceTime: string;
  performanceAddress?: string;
  ticketInfo: string;
  miscInfo?: string;
  ticketLink?: string;
  venueImageUrl?: string;
}

const FuturePerformance: React.FC<IProps> = ({
  performanceName,
  formattedPerformanceTime,
  performanceAddress,
  ticketInfo,
  miscInfo,
  ticketLink,
  venueImageUrl,
}) => {
  return (
    <div
      className={classNames(
        styles.performanceContainer,
        ticketLink ? styles.hasLink : undefined,
      )}
      style={{ backgroundImage: venueImageUrl }}
    >
      <a
        href={ticketLink}
        onClick={
          ticketLink
            ? undefined
            : (evt) => {
                evt.preventDefault();
              }
        }
        target="_blank"
        className={ticketLink ? styles.ticketLink : styles.noTicketLink}
      >
        <div className={styles.performance}>
          <div style={{ flexGrow: 1 }}>
            <h3 className={styles.performanceName}>{performanceName}</h3>
            <p className={styles.performanceTime}>{formattedPerformanceTime}</p>
            <p className={styles.performanceAddress}>{performanceAddress}</p>
            <p className={styles.performanceInfo}>
              {ticketInfo}
              {miscInfo ? `; ${miscInfo}` : ""}
            </p>
          </div>
          {ticketLink ? (
            <a className={styles.buyTickets} href={ticketLink} target="_blank">
              Buy Tickets
            </a>
          ) : (
            <></>
          )}
        </div>
      </a>
    </div>
  );
};

export default FuturePerformance;
