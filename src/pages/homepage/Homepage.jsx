import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
// components
import Logo from "../../components/logo/Logo";
// styles
import styles from "./Homepage.module.css";

export default function Homepage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className={styles.homepage}>
      <section>
        {isAuthenticated && (
          <button className={styles.logout} onClick={logout}>
            Logout
          </button>
        )}
        <Logo composition='colors-bottom' size='30rem' />
        <h1>You travel the world.</h1>

        <h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non
          ullamcorper nisl. Morbi ultricies eros a nisl ultricies, id tincidunt
          justo vestibulum. Integer tincidunt ligula in facilisis posuere.
          Mauris efficitur vel diam laoreet fringilla. Nullam consequat congue
          tellus.
        </h2>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <Link to='/app/vacations' className='cta primary'>
              Find the next vacation
            </Link>
          ) : (
            <>
              <Link to='/signin' className='cta'>
                Sign in
              </Link>
              <span>OR</span>
              <Link to='/signup' className='cta'>
                Create account
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
