import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./chat.module.css";
import { Button, Flex, Input, Typography } from "@maxhub/max-ui";

interface ChatProps {
  onSubmit: (phone: string) => void;
  error?: string;
  loading?: boolean;
}

const normalizePhone = (value: string): string => value.replace(/\D/g, "");

const isValidPhone = (phone: string): boolean => /^(7\d{10}\d{9})$/.test(phone);

export const Chat = ({ onSubmit, error, loading = false }: ChatProps) => {
  const [value, setValue] = useState("");
  const phone = normalizePhone(value);
  const isValid = isValidPhone(phone);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    onSubmit(phone);
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <Flex direction="column" gap={16}>
        <Typography.Title variant="medium-strong">Новый чат</Typography.Title>
        <Typography.Body variant="small">Введите номер телефона получателя</Typography.Body>

        <Input
          placeholder="79991234567"
          inputMode="tel"
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          hint={error}
          withClearButton
        />

        <Button type="submit" size="large" stretched disabled={!isValid} loading={loading}>
          Создать чат
        </Button>
      </Flex>
    </form>
  );
};
