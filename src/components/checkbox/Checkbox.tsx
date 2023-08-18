import React from "react";
import styles from "./Checkbox.module.css";

export const Checkbox = ({ label, secondLabel, checked, onChange }: any) => {
  return (
    <div className={styles.checkbox}>
      <label>{checked ? secondLabel || label : label}</label>
      <input type='checkbox' checked={checked} onChange={onChange} />
    </div>
  );
};
