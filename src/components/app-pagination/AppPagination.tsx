import React from "react";
import styles from "./AppPagination.module.css";
import { useVacations } from "../../contexts/VacationsContext";

export default function AppPagination() {
  const { insertQuery, query, hasNext, totalVacations, vacations } =
    useVacations();

  const hasBack = query.page * query.limit > query.limit;

  function onNext() {
    insertQuery({ page: query.page + 1 });
  }

  function onBack() {
    insertQuery({ page: query.page - 1 });
  }

  // minimum results number
  let min = (query.page - 1) * query.limit;
  // maximum results number
  let max =
    query.limit === vacations.length
      ? query.page * query.limit
      : (query.page - 1) * query.limit + vacations.length;

  return (
    <div className={styles.pagination}>
      <button disabled={!hasBack} onClick={onBack}>
        {"<"}
      </button>
      <p>
        {min}-{max}
        out of {totalVacations} possible results
      </p>
      <button disabled={!hasNext} onClick={onNext}>
        {">"}
      </button>
    </div>
  );
}
