import { useState } from "react";
import { Flex } from "@maxhub/max-ui";
import { checkAccount } from "../../services/green-api";
import type { ChatModel, Credentials } from "../../types";
import { Login } from "../login/login";
import { NewChat } from "../new-chat/new-chat";
import { Chat } from "../chat/chat";
import styles from "./app.module.css";

export const App = () => {
  const [credentials, setCredentials] = useState<Credentials>();
  const [chat, setChat] = useState<ChatModel>();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>();

  const handleLogin = (value: Credentials) => {
    setCredentials(value);
    setError(undefined);
  };

  const handleCreateChat = async (phone: string) => {
    if (!credentials) return;
    setCreating(true);
    setError(undefined);
    try {
      const { exist, chatId } = await checkAccount(credentials, phone);
      if (!exist) {
        setError("На этом номере нет аккаунта MAX");
        return;
      }
      setChat({ phone, chatId });
    } catch {
      setError("Не удалось проверить номер. Проверьте учетные данные");
    } finally {
      setCreating(false);
    }
  };

  if (!credentials) {
    return <Login onSubmit={handleLogin} />;
  }

  if (!chat) {
    return (
      <Flex className={styles.root} align="center" justify="center">
        <NewChat onSubmit={handleCreateChat} error={error} loading={creating} />
      </Flex>
    );
  }

  return (
    <Flex className={styles.root} direction="column">
      <Chat credentials={credentials} chat={chat} />
    </Flex>
  );
};
