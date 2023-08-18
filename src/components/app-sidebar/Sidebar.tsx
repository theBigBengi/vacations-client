import React from "react";
import { BiLogOut } from "react-icons/bi";

import { useAuth } from "../../contexts/AuthContext";

import { SearchInput } from "../search-input/SearchInput";
import SidebarActions from "./SidebarActions";
import AppPagination from "../app-pagination/AppPagination";
import Logo from "../logo/Logo";
import AdminNav from "../admin-nav/AdminNav";

import styles from "./Sidebar.module.css";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { isAdmin, user, logout } = useAuth();

  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <Logo composition='colors' size='5rem' />

      {/* Render AdminNav or SearchInput based on isAdmin flag */}
      {/* {isAdmin ? <AdminNav /> : <SearchInput />} */}
      {isAdmin && <AdminNav />}

      {/* Actions section */}
      <div
        className={styles.actions}
        style={{ ...(!isAdmin && { marginTop: "2rem" }) }}
      >
        {/* User section */}
        <div className={styles.user}>
          <h3>
            Hello, <span className={styles.userName}>{user?.firstName}</span>
          </h3>
          {/* Logout button */}
          <button onClick={logout}>
            <BiLogOut />
          </button>
        </div>

        {/* SidebarActions component */}
        <div className={styles.filters}>
          <SidebarActions />
        </div>

        {/* AppPagination component */}
        <AppPagination />
      </div>

      {/* Footer */}
      <footer>OASIS Inc</footer>
    </div>
  );
};

export default Sidebar;
