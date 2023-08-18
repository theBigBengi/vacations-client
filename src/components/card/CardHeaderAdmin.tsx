import React from "react";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import styles from "./Card.module.css";

export default function CardHeaderAdmin({ destination }: any) {
  return (
    <div className={styles["admin"]}>
      <div>
        <span>
          <BsPencil />
        </span>
        <span>
          <BsTrash3 />
        </span>
      </div>
      <h4>{destination}</h4>
    </div>
  );
}
