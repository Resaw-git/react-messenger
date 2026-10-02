import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Credentials } from "../../types";
import styles from "./login.module.css";
import { Button, Input, MaxUI, Typography } from "@maxhub/max-ui";

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
    <MaxUI className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <img className={styles.logoMark} src="/max-logo.png" alt="logo" />
            <span className={styles.logoWord}>MAX</span>
          </div>

          <Typography.Text className={styles.title} variant="header" color="primary">
            Введите данные инстанса Green API
          </Typography.Text>

          <div className={styles.fields}>
            <Input
              size="medium"
              mode="contrast"
              placeholder="idInstance"
              inputMode="numeric"
              autoComplete="off"
              value={idInstance}
              onChange={(event) => setIdInstance(event.target.value)}
            />

            <Input
              size="medium"
              mode="contrast"
              placeholder="apiTokenInstance"
              type="password"
              autoComplete="off"
              value={apiTokenInstance}
              onChange={(event) => setApiTokenInstance(event.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="medium" stretched disabled={!isValid}>
            Продолжить
          </Button>
          <Typography.Text className={styles.hint} variant="description" color="tertiary">
            Инстанса ещё нет? Создайте его по ссылке{" "}
            <a className={styles.link} href="https://green-api.com/max" target="_blank" rel="noreferrer">
              https://green-api.com/max
            </a>
            , а затем в личном кабинете скопируйте <span className={styles.bold}>idInstance</span> и{" "}
            <span className={styles.bold}>apiTokenInstance</span>.
          </Typography.Text>
        </div>
      </form>
    </MaxUI>
  );
};
