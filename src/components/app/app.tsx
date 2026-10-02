//import styles from "./app.module.css";
import { Login } from "../login/login";
import { Chat } from "../chat/chat";
import { Message } from "../message/message";
import { MessageInput } from "../input/input";

export const App = () => {
  
  return (
    <MessageInput onSend={(text) => console.log("send:", text)} />
  );
};
