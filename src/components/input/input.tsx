import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Icon } from "../icon/icon";
import styles from "./input.module.css";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 4000;
const MAX_HEIGHT = 120;

export const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmed = text.trim();
  const canSend = trimmed !== "" && !disabled;

  const resize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
  };

  const send = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (textarea) textarea.style.height = "auto";
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <div className={styles.root}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        placeholder="Сообщение"
        value={text}
        disabled={disabled}
        maxLength={MAX_LENGTH}
        onChange={(event) => {
          setText(event.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
      />
      {trimmed !== "" && (
        <button type="button" className={styles.send} aria-label="Отправить" disabled={!canSend} onClick={send}>
          <Icon name="send" size={20} />
        </button>
      )}
    </div>
  );
};
