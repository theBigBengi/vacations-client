import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  type,
  size,
  color,
  style,
  ...props
}: {
  children?: any;
  type?: any;
  size?: any;
  color?: any;
  style?: any;
  onClick?: any;
  [key: string]: any;
}) {
  return (
    <button
      className={`${styles.btn} ${styles[type]} ${styles[size]}`}
      onClick={onClick}
      style={{
        color,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
