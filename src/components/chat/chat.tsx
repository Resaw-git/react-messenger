import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../../services/green-api";
import { getContactName, type ChatModel, type Credentials, type MessageModel } from "../../types";
import { formatPhone } from "../../utils/phone";
import { Avatar } from "../avatar/avatar";
import { Message } from "../message/message";
import { MessageInput } from "../input/input";
import { useIncomingMessages } from "./use-incoming-messages";
import styles from "./chat.module.css";

interface ChatProps {
  credentials: Credentials;
  chat: ChatModel;
}

export const Chat = ({ credentials, chat }: ChatProps) => {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const knownIdsRef = useRef(new Set<string>());
  const bottomRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: MessageModel) => {
    if (knownIdsRef.current.has(message.id)) return;
    knownIdsRef.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  };

  useIncomingMessages({
    credentials,
    chatId: chat.chatId,
    enabled: true,
    onMessage: addMessage,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSend = async (text: string) => {
    setSending(true);
    setError(undefined);
    try {
      const response = await sendMessage(credentials, chat.chatId, text);
      addMessage({ id: response.idMessage, text, direction: "out", timestamp: Date.now() });
    } catch {
      setError("Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Avatar seed={chat.phone} size={40} />
        <div className={styles.headerBody}>
          <span className={styles.headerTitle}>{getContactName(chat) || formatPhone(chat.phone)}</span>
          <span className={styles.headerSubtitle}>{getContactName(chat) ? formatPhone(chat.phone) : "MAX"}</span>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
};
