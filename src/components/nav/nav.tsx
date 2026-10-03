import usersIcon from "../../assets/users.png";
import styles from "./nav.module.css";

export const Nav = () => (
  <nav className={styles.root} aria-label="Основная навигация">
    <button type="button" className={`${styles.item} ${styles.active}`} aria-current="page">
      <img src={usersIcon} width={24} height={24} alt="" aria-hidden="true" />
      <span className={styles.title}>Контакты</span>
    </button>
  </nav>
);
