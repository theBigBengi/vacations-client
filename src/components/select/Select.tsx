import React from "react";
import styles from "./Select.module.css";

export default function Select({
  options,
  value,
  onChange,
  label,
  ...props
}: any) {
  return (
    <div className={styles.select}>
      <label>{label}</label>
      <select
        {...props}
        value={value}
        onChange={onChange}
        style={{ backgroundColor: "none", border: "none" }}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
