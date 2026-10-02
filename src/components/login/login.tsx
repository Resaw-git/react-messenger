import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Credentials } from "../../types";
import styles from "./login.module.css";
import { Button, Flex, Input, Typography } from "@maxhub/max-ui";

interface LoginProps {
  onSubmit: (credentials: Credentials) => void;
}

export const Login = ({ onSubmit }: LoginProps) => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const isValid = idInstance.trim() !== "" && apiTokenInstance.trim() !== "";

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    onSubmit({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <Flex direction="column" gap={16}>
        <Typography.Title variant="medium-strong">Вход</Typography.Title>
        <Typography.Body variant="small">Введите учетные данные инстанса Green API</Typography.Body>

        <Input
          placeholder="idInstance"
          inputMode="numeric"
          autoComplete="off"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value)}
        />

        <Input
          placeholder="apiTokenInstance"
          type="password"
          autoComplete="off"
          value={apiTokenInstance}
          onChange={(event) => setApiTokenInstance(event.target.value)}
        />

        <Button type="submit" size="large" stretched disabled={!isValid}>
          Войти
        </Button>
      </Flex>
    </form>
  );
};
