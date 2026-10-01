//import styles from "./app.module.css";
import { Login } from "../login/login";
import { Chat } from "../chat/chat";

export const App = () => {

  return <Chat onSubmit={(phone) => console.log(phone)} error="На этом номере нет аккаунта MAX" />;
}


