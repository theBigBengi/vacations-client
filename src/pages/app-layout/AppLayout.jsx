// import Map from "../components/Map";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/app-sidebar/Sidebar";

import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
