import { useState, type FormEvent } from "react";
import { Button, Flex, Input, Typography } from "@maxhub/max-ui";
import styles from "./new-chat.module.css";

interface NewChatProps {
  onSubmit: (phone: string) => void;
  error?: string;
  loading?: boolean;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidPhone(phone: string): boolean {
  return /^(7\d{10})$/.test(phone);
}

export function NewChat({ onSubmit, error, loading = false }: NewChatProps) {
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
        <Typography.Text variant="body" color="secondary">
          Введите номер телефона получателя
        </Typography.Text>

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
}
