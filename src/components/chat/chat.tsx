import { useRef, useState } from "react";
import { Flex, Typography } from "@maxhub/max-ui";
import { sendMessage } from "../../services/green-api";
import type { ChatModel, Credentials, MessageModel } from "../../types";
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
    <Flex className={styles.root} direction="column">
      <Flex className={styles.header} align="center" gap={8}>
        <Typography.Title variant="small-strong">{chat.phone}</Typography.Title>
      </Flex>

      <Flex className={styles.messages} direction="column" gap={8}>
        {messages.length === 0 ? (
          <Typography.Text variant="body" color="secondary">
            Напишите первое сообщение
          </Typography.Text>
        ) : (
          messages.map((message) => <Message key={message.id} message={message} />)
        )}
      </Flex>

      {error && (
        <Typography.Text variant="body" className={styles.error}>
          {error}
        </Typography.Text>
      )}

      <MessageInput onSend={handleSend} disabled={sending} />
    </Flex>
  );
};
