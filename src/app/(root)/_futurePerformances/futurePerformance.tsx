import classNames from "classnames";
import styles from "./styles.module.scss";

interface IProps {
  performanceName: string;
  formattedPerformanceTime: string;
  venueAddress?: string;
  ticketInfo: string;
  miscInfo?: string;
  ticketLink?: string;
  venueImageUrl?: string;
  ticketsFree: boolean;
}

const FuturePerformance: React.FC<IProps> = ({
  performanceName,
  formattedPerformanceTime,
  venueAddress,
  ticketInfo,
  miscInfo,
  ticketLink,
  venueImageUrl,
  ticketsFree,
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
            <p className={styles.performanceAddress}>{venueAddress}</p>
            <p className={styles.performanceInfo}>
              {ticketInfo}
              {miscInfo ? `; ${miscInfo}` : ""}
            </p>
          </div>
          {ticketLink ? (
            <a className={styles.buyTickets} href={ticketLink} target="_blank">
              {ticketsFree ? "More Info" : "Buy Tickets"}
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
