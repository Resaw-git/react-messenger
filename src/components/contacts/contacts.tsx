import { useState } from "react";
import { getContactName, type ChatModel } from "../../types";
import { formatPhone } from "../../utils/phone";
import { AddContactModal } from "../add-contact-modal/add-contact-modal";
import { Avatar } from "../avatar/avatar";
import { Icon } from "../icon/icon";
import styles from "./contacts.module.css";

interface ContactsProps {
  contacts: ChatModel[];
  selectedChatId?: string;
  adding: boolean;
  error?: string;
  onSelect: (chat: ChatModel) => void;
  onAdd: (phone: string, firstName: string, lastName?: string) => Promise<boolean>;
  onClearError: () => void;
}

export const Contacts = ({ contacts, selectedChatId, adding, error, onSelect, onAdd, onClearError }: ContactsProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClearError();
  };

  return (
    <aside className={styles.root} aria-label="Контакты">
      <div className={styles.header}>
        <h2 className={styles.title}>Контакты</h2>
        <button
          type="button"
          className={styles.addButton}
          title="Добавить контакт"
          aria-label="Добавить контакт"
          aria-haspopup="dialog"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="plus" size={20} />
        </button>
      </div>

      <div className={styles.list}>
        {contacts.length === 0 ? (
          <div className={styles.empty}>
            <Icon name="user-add" size={32} />
            <p className={styles.emptyText}>Добавьте первый контакт по номеру телефона</p>
          </div>
        ) : (
          contacts.map((contact) => {
            const isSelected = contact.chatId === selectedChatId;
            const name = getContactName(contact);
            return (
              <button
                key={contact.chatId}
                type="button"
                className={isSelected ? `${styles.cell} ${styles.selected}` : styles.cell}
                onClick={() => onSelect(contact)}
              >
                <Avatar seed={contact.phone} size={48} />
                <span className={styles.cellBody}>
                  <span className={styles.cellName}>{name || formatPhone(contact.phone)}</span>
                  <span className={styles.cellStatus}>{name ? formatPhone(contact.phone) : "MAX"}</span>
                </span>
              </button>
            );
          })
        )}
      </div>

      {modalOpen && <AddContactModal adding={adding} error={error} onClose={handleCloseModal} onSubmit={onAdd} />}
    </aside>
  );
};
