import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Button, Input } from "@maxhub/max-ui";
import { formatPhoneDigits, normalizePhone } from "../../utils/phone";
import { Icon } from "../icon/icon";
import styles from "./add-contact-modal.module.css";

const NAME_MAX_LENGTH = 60;
const PHONE_LENGTH = 10;

interface AddContactModalProps {
  adding: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (phone: string, firstName: string, lastName?: string) => Promise<boolean>;
}

export const AddContactModal = ({ adding, error, onClose, onSubmit }: AddContactModalProps) => {
  const [digits, setDigits] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePhoneChange = (value: string) => {
    let next = normalizePhone(value);
    if (next.length > PHONE_LENGTH && (next.startsWith("7") || next.startsWith("8"))) {
      next = next.slice(1);
    }
    setDigits(next.slice(0, PHONE_LENGTH));
  };

  const isValid = digits.length === PHONE_LENGTH && firstName.trim().length > 0;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || adding) return;
    const saved = await onSubmit(`7${digits}`, firstName.trim(), lastName.trim() || undefined);
    if (saved) onClose();
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-contact-title">
        <div className={styles.header}>
          <h2 className={styles.title}>Добавить контакт</h2>
            
          
          <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
            <Icon name="cross" size={14} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            ref={phoneRef}
            mode="contrast"
            size="medium"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="123 456 78 90"
            aria-label="Номер телефона"
            withClearButton={false}
            iconBefore={
              <span className={styles.prefix}>
                +7
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M3.293 5.293a1 1 0 0 1 1.414 0L8 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414"
                  />
                </svg>
              </span>
            }
            value={formatPhoneDigits(digits)}
            onChange={(event) => handlePhoneChange(event.target.value)}
          />

          <Input
            mode="contrast"
            size="medium"
            type="text"
            autoComplete="off"
            placeholder="Имя"
            aria-label="Имя"
            withClearButton={false}
            maxLength={NAME_MAX_LENGTH}
            iconAfter={
              <span className={styles.counter}>
                {firstName.length}/{NAME_MAX_LENGTH}
              </span>
            }
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />

          <Input
            mode="contrast"
            size="medium"
            type="text"
            autoComplete="off"
            placeholder="Фамилия (необязательно)"
            aria-label="Фамилия (необязательно)"
            withClearButton={false}
            maxLength={NAME_MAX_LENGTH}
            iconAfter={
              <span className={styles.counter}>
                {lastName.length}/{NAME_MAX_LENGTH}
              </span>
            }
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />

          <div className={styles.errorSlot} aria-live="polite">
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <Button type="submit" variant="primary" size="small" stretched disabled={!isValid || adding}>
            {adding ? "Сохраняем…" : "Сохранить контакт"}
          </Button>
        </form>
      </div>
    </div>
  );
};
