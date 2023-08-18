import { useEffect, useState } from "react";

import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import { Field } from "../components/text-input/Field";
import Logo from "../components/logo/Logo";
import { NotificationManager } from "react-notifications";

export default function Login() {
  const [email, setEmail] = useState("email@email.com");
  const [password, setPassword] = useState("1234");
  const [errors, setErrors] = useState<string | null>(null);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app/vacations", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response?.status === "fail") {
      setErrors(response.message);
      return NotificationManager.error(response.message, "Error", 3000);
    }

    NotificationManager.success(
      `Hello, ${response?.data.user.firstName}`,
      "Logged in",
      3000
    );
  };

  return (
    <main className={styles.login}>
      <section>
        <Logo style={{ width: "12rem", height: "13rem" }} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <Field error={errors} name='email' label='Email'>
            <input
              type='email'
              name='email'
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
          </Field>
          <Field error={errors} name='password' label='Password'>
            <input
              type='password'
              name='password'
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
          </Field>

          {errors?.includes("Credentials incorrect") && <p>{errors}</p>}

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
