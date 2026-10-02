import { Button, Flex, Textarea } from "@maxhub/max-ui";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./input.module.css";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 4000;

export const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [text, setText] = useState("");
  const trimmed = text.trim();
  const canSend = trimmed !== "" && !disabled;

  const send = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event?.preventDefault();
      send();
    }
  };

  return (
    <Flex className={styles.root} gap={8} align="flex-end">
      <Textarea
        className={styles.textarea}
        placeholder="Введите сообщение"
        value={text}
        disabled={disabled}
        maxLength={MAX_LENGTH}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button variant="primary" size="large" disabled={!canSend} onClick={send}>
        Отправить
      </Button>
    </Flex>
  );
};
