import React from "react";
import styles from "./Message.module.css";

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <p className={styles.message}>
      <span role='img'>👋</span> {message}
    </p>
  );
};

export default Message;
