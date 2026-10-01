import styles from "./app.module.css";
import { Login } from "../login/login";

export const App = () => {

  return <Login onSubmit={(c) => console.log(c)} />;
}


