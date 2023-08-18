import { ChangeEvent } from "react";
import { useVacations } from "../../contexts/VacationsContext";

import styles from "./SearchInput.module.css";

export function SearchInput() {
  const { searchDestination } = useVacations();

  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    // if (e.target.value.length > 2) {
    searchDestination(e.target.value);
    // }
  }

  return (
    <div className={styles.searchInput}>
      <input
        placeholder='Search destination'
        onChange={onSearch}
        style={{ borderRadius: "25px", marginBottom: "2.5rem" }}
      />
    </div>
  );
}
