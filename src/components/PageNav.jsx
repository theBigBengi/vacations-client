import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
//
import Logo from "./Logo";
import Button from "./Button";
//
import styles from "./PageNav.module.css";

const LOGO_URL = "oasis-logo-text-right-colors.png";

export default function PageNav() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Logo src={LOGO_URL} size='6rem' />
      <ul>
        <li>
          <NavLink to='/pricing'>Pricing</NavLink>
        </li>
        <li>
          <NavLink to='/vacations'>Products</NavLink>
        </li>

        {isAuthenticated && (
          <li>
            <Button type='back' onClick={logout}>
              logout
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}
