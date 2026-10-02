import styles from "./message.module.css";
import type { MessageModel } from "../../types";
import { Typography } from "@maxhub/max-ui";

interface MessageProps {
  message: MessageModel;
}

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export const Message = ({ message }: MessageProps) => {
  const isOutgoing = (message.direction === "out");
  const className = isOutgoing ? `${styles.root} ${styles.outgoing}` : `${styles.root} ${styles.incoming}`;

  return (
    <div className={className}>
      <Typography.Text variant="body" className={styles.text}>
        {message.text}
      </Typography.Text>
      <Typography.Text variant="note" color="tertiary" className={styles.time}>
        {formatTime(message.timestamp)}
      </Typography.Text>
    </div>
  );
};
