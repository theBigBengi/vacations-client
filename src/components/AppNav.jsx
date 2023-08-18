import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
import Logo from "./Logo";

export default function AppNav() {
  return (
    <div className={styles.nav}>
      <Logo src='/oasis-logo-text-right-colors.png' size='6rem' />
      <ul>
        <li>
          <NavLink to='reports'>Reports</NavLink>
        </li>
        <li>
          <NavLink
            to='countries'
            style={{
              backgroundColor: "#88e1ff",
              padding: "1rem 4rem",
              borderRadius: 25,
            }}
          >
            Add
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
