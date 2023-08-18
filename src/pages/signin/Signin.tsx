import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
//
import { Field } from "../../components/text-input/Field";
import Logo from "../../components/logo/Logo";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
//
import styles from "./Signin.module.css";
import { NotificationManager } from "react-notifications";

export default function Signin() {
  const [email, setEmail] = useState("email1@gmail.com");
  const [password, setPassword] = useState("password1");

  const { login, error, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app/vacations", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response.status === "fail") {
      return NotificationManager.error(response.message, "Error", 3000);
    }

    NotificationManager.success(
      `Hello, ${response.data.user.firstName}`,
      "Logged in",
      3000
    );
  };

  return (
    <main className={styles.login}>
      <section>
        <Logo />

        <form className={styles.form} onSubmit={handleSubmit}>
          <Field error={error} name='email' label='Email'>
            <input
              type='email'
              name='email'
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
          </Field>

          <Field error={error} name='password' label='Password'>
            <input
              type='password'
              name='password'
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
          </Field>

          {error?.includes("Credentials incorrect") && <p>{error}</p>}

          <Button type='primary' disabled={isLoading}>
            {isLoading ? "Sending request..." : "Signin"}
          </Button>
        </form>

        <p>
          Don't have an account ? <NavLink to='/signup'>Signup here</NavLink>
        </p>
      </section>
    </main>
  );
}
