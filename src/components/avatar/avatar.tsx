import { Icon } from "../icon/icon";
import styles from "./avatar.module.css";

interface AvatarProps {
  seed: string;
  size?: number;
}

const PALETTE = ["#2596a7", "#3b7cca", "#565cf2", "#be5087", "#da7f41"];

const pickColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

export const Avatar = ({ seed, size = 48 }: AvatarProps) => (
  <div className={styles.root} style={{ background: pickColor(seed), width: size, height: size }}>
    <Icon name="user" size={Math.round(size * 0.55)} />
  </div>
);
