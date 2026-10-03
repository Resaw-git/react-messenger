import { useState } from "react";
import { checkAccount } from "../../services/green-api";
import type { ChatModel, Credentials } from "../../types";
import { Login } from "../login/login";
import { Nav } from "../nav/nav";
import { Contacts } from "../contacts/contacts";
import { Chat } from "../chat/chat";
import { Icon } from "../icon/icon";
import styles from "./app.module.css";

export const App = () => {
  const [credentials, setCredentials] = useState<Credentials | undefined>();
  const [contacts, setContacts] = useState<ChatModel[]>([]);
  const [chat, setChat] = useState<ChatModel>();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string>();

  const handleLogin = (value: Credentials) => {
    setCredentials(value);
    setError(undefined);
  };

  const handleSelectChat = (value: ChatModel) => {
    setChat(value);
    setError(undefined);
  };

  const handleCloseChat = () => {
    setChat(undefined);
  };

  const handleLogout = () => {
    setCredentials(undefined);
    setContacts([]);
    setChat(undefined);
    setError(undefined);
  };

  const handleAddContact = async (phone: string, firstName: string, lastName?: string): Promise<boolean> => {
    if (!credentials) return false;

    const existing = contacts.find((contact) => contact.phone === phone);
    if (existing) {
      handleSelectChat(existing);
      return true;
    }

    setAdding(true);
    setError(undefined);
    try {
      const { exist, chatId } = await checkAccount(credentials, phone);
      if (!exist) {
        setError("На этом номере нет аккаунта MAX");
        return false;
      }
      const contact: ChatModel = { phone, chatId, firstName, lastName };
      setContacts((prev) => [...prev, contact]);
      setChat(contact);
      return true;
    } catch {
      setError("Не удалось проверить номер. Проверьте учетные данные");
      return false;
    } finally {
      setAdding(false);
    }
  };

  if (!credentials) {
    return <Login onSubmit={handleLogin} />;
  }

  return (
    <div className={chat ? `${styles.shell} ${styles.chatOpen}` : styles.shell}>
      <div className={styles.nav}>
        <Nav onLogout={handleLogout} />
      </div>
      <div className={styles.contacts}>
        <Contacts
          contacts={contacts}
          selectedChatId={chat?.chatId}
          adding={adding}
          error={error}
          onSelect={handleSelectChat}
          onAdd={handleAddContact}
          onClearError={() => setError(undefined)}
        />
      </div>
      <main className={styles.main}>
        {chat ? (
          <Chat key={chat.chatId} credentials={credentials} chat={chat} onBack={handleCloseChat} />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <Icon name="message" size={40} />
            </div>
            <p className={styles.placeholderTitle}>Выберите контакт</p>
            <p className={styles.placeholderText}>Выберите чат из списка, чтобы начать переписку</p>
          </div>
        )}
      </main>
    </div>
  );
};
