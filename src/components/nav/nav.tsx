import usersIcon from "../../assets/users.png";
import { Icon } from "../icon/icon";
import styles from "./nav.module.css";

interface NavProps {
  onLogout: () => void;
}

export const Nav = ({ onLogout }: NavProps) => (
  <nav className={styles.root} aria-label="Основная навигация">
    <button type="button" className={`${styles.item} ${styles.active}`} aria-current="page">
      <img src={usersIcon} width={24} height={24} alt="" aria-hidden="true" />
      <span className={styles.title}>Контакты</span>
    </button>
    <button type="button" className={`${styles.item} ${styles.logout}`} onClick={onLogout}>
      <Icon name="logout" size={24} />
      <span className={styles.title}>Выход</span>
    </button>
  </nav>
);
