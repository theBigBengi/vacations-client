import React, { useState, ChangeEvent } from "react";
import { Checkbox } from "../checkbox/Checkbox";
import { useVacations } from "../../contexts/VacationsContext";
import Select from "../select/Select";

import styles from "./Sidebar.module.css";

interface SidebarActionsProps {}

const SidebarActions: React.FC<SidebarActionsProps> = () => {
  // Get vacations context data using a custom hook
  const { insertQuery, query } = useVacations();

  // Handler for the "My vacations" checkbox
  const handleMyVacationsChange = (e: ChangeEvent<HTMLInputElement>) => {
    insertQuery({
      following: e.target.checked,
      page: 1,
      startingDate: undefined,
      endingDate: undefined,
    });
  };

  // Handler for the "Schedule" and "In progress" checkboxes
  const handleDateCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    const currentDate = new Date().toISOString();

    if (e.target.checked) {
      const dateQuery =
        type === "start"
          ? { startingDate: `gt${currentDate}`, endingDate: undefined }
          : {
              startingDate: `lt${currentDate}`,
              endingDate: `gt${currentDate}`,
            };

      insertQuery({
        ...dateQuery,
        page: 1,
      });
    } else {
      insertQuery({
        startingDate: `gt${currentDate}`,
        endingDate: undefined,
        page: 1,
      });
    }
  };

  // Handler for
  const handleAllCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date().toISOString();

    if (e.target.checked) {
      insertQuery({
        startingDate: undefined,
        endingDate: undefined,
        page: 1,
      });
    } else {
      insertQuery({
        startingDate: `gt${currentDate}`,
        endingDate: undefined,
        page: 1,
      });
    }
  };

  // Handler for the "Results" select
  const handleLimitSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    insertQuery({ limit: parseInt(e.target.value) });
  };

  // Handler for the "Sort by" select
  const handleSortSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    insertQuery({ sort: e.target.value });
  };

  return (
    <>
      {/* My vacations checkbox */}
      <Checkbox label='My vacations' onChange={handleMyVacationsChange} />

      {/* Schedule checkbox */}
      <Checkbox
        label='Schedule'
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleDateCheckboxChange(e, "start")
        }
      />

      {/* In progress checkbox */}
      <Checkbox
        label='In progress'
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleDateCheckboxChange(e, "end")
        }
      />

      {/* In progress checkbox */}
      <Checkbox
        checked
        label='All vacations'
        onChange={handleAllCheckboxChange}
      />

      {/* Selects container */}
      <div className={styles["selects"]}>
        {/* Results per page select */}
        <Select
          options={[
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 30, value: 30 },
          ]}
          value={query.limit}
          onChange={handleLimitSelectChange}
          name='limit'
          label='Results'
        />

        {/* Sort by select */}
        <Select
          options={[
            { label: "Price", value: "price" },
            { label: "Starting date", value: "startingDate" },
          ]}
          value={query.sort}
          onChange={handleSortSelectChange}
          name='sort'
          label='Sort by'
        />
      </div>
    </>
  );
};

export default SidebarActions;
