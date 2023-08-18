import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./AdminNav.module.css";

const AdminNav: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to='/app/vacations'>vacations</NavLink>
        </li>
        <li>
          <NavLink to='/app/reports'>reports</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
