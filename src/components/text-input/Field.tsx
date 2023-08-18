import React from "react";

import styles from "./Field.module.css";

export function Field({
  error,
  onChange,
  value,
  name,
  type,
  label,
  children,
}: any) {
  return (
    <div
      className={`${styles.row} ${error?.includes(name) ? styles.error : ""}`}
    >
      <label htmlFor={name}>{label || name}</label>
      {children ?? (
        <input
          type={type}
          id={name}
          name={name}
          onChange={onChange}
          value={value}
        />
      )}

      {error && (
        <p>{error.split(",").filter((e: any) => e.includes(name))[0]}</p>
      )}
    </div>
  );
}
