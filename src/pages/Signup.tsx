import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

import Button from "../components/Button";

import styles from "./Login.module.css";
import { Field } from "../components/text-input/Field";
import Logo from "../components/logo/Logo";
import { NotificationManager } from "react-notifications";

export default function Login() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>({ email: "", password: "", firstName: "", lastName: "" });
  const [errors, setErrors] = useState<string | null>(null);

  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app/vacations", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await signup(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password
    );

    if (response.status === "fail") {
      setErrors(response.message);
      return NotificationManager.error(response.message, "Error", 3000);
    }

    NotificationManager.success(
      `Hello, ${response.data.user.firstName}`,
      "Logged in",
      3000
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className={styles.login}>
      <section>
        <Logo />

        <form className={styles.form} onSubmit={handleSubmit}>
          <Field label='First name' name='firstName' error={errors}>
            <input
              onChange={handleChange}
              value={formData.firstName}
              name='firstName'
              type='text'
            />
          </Field>

          <Field label='Last name' name='lastName' error={errors}>
            <input
              onChange={handleChange}
              value={formData.lastName}
              name='lastName'
              type='text'
            />
          </Field>

          <Field label='Email address' error={errors} name='email'>
            <input
              onChange={handleChange}
              value={formData.email}
              name='email'
              type='email'
            />
          </Field>

          <Field label='Password' name='password' error={errors}>
            <input
              onChange={handleChange}
              value={formData.password}
              name='password'
              type='password'
            />
          </Field>

          <Button type='primary' size='big' disabled={isLoading}>
            {isLoading ? "Sending request..." : "Signin"}
          </Button>
        </form>

        <p>
          Don't have an account ? <NavLink to='/signin'>Signin here</NavLink>
        </p>
      </section>
    </main>
  );
}
