import { useState } from "react";
import type { SubmitEvent } from "react";
import { getStateInstance } from "../../services/green-api";
import type { Credentials } from "../../types";
import styles from "./login.module.css";
import { Button, Input, MaxUI, Typography } from "@maxhub/max-ui";

interface LoginProps {
  onSubmit: (credentials: Credentials) => void;
}

export const Login = ({ onSubmit }: LoginProps) => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string>();

  const isValid = idInstance.trim() !== "" && apiTokenInstance.trim() !== "";

  const handleIdInstanceChange = (value: string) => {
    setIdInstance(value);
    setError(undefined);
  };

  const handleApiTokenInstanceChange = (value: string) => {
    setApiTokenInstance(value);
    setError(undefined);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || checking) return;

    const credentials: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    setChecking(true);
    setError(undefined);
    try {
      const { stateInstance } = await getStateInstance(credentials);
      if (stateInstance !== "authorized") {
        setError("Инстанс не авторизован. Авторизуйте его в личном кабинете Green API");
        return;
      }
      onSubmit(credentials);
    } catch {
      setError("Неверные idInstance или apiTokenInstance. Проверьте данные инстанса");
    } finally {
      setChecking(false);
    }
  };

  return (
    <MaxUI className={styles.screen} colorScheme="dark">
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
              disabled={checking}
              onChange={(event) => handleIdInstanceChange(event.target.value)}
            />

            <Input
              size="medium"
              mode="contrast"
              placeholder="apiTokenInstance"
              type="password"
              autoComplete="off"
              value={apiTokenInstance}
              disabled={checking}
              onChange={(event) => handleApiTokenInstanceChange(event.target.value)}
            />
          </div>

          {error && (
            <Typography.Text className={styles.error} variant="description" role="alert">
              {error}
            </Typography.Text>
          )}

          <Button type="submit" variant="primary" size="medium" stretched disabled={!isValid || checking}>
            {checking ? "Проверка..." : "Продолжить"}
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
