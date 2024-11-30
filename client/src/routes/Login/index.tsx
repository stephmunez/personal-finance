import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import iconError from "../../assets/images/icon-bill-due.svg";
import iconHidePassword from "../../assets/images/icon-hide-password.svg";
import iconShowPassword from "../../assets/images/icon-show-password.svg";
import illustrationAuthentication from "../../assets/images/illustration-authentication.svg";
import logoLarge from "../../assets/images/logo-large.svg";
import { useAuthContext } from "../../hooks/useAuthContext";
import { User } from "../../types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useAuthContext();

  const loginUser = async (user: User) => {
    setIsLoading(true);
    setErrors({ email: "", password: "" });
    setServerError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setIsLoading(false);
        setServerError(data.error);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email is not valid.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await loginUser({ email, password });

      if (!serverError) {
        setEmail("");
        setPassword("");
      }
      setErrors({ email: "", password: "" });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full flex-col xl:flex-row">
      <div className="flex w-full items-center justify-center rounded-b-lg bg-grey-900 px-10 py-6 xl:hidden xl:py-64">
        <div>
          <img src={logoLarge} alt="finance logo" />
        </div>
      </div>

      <div className="relative hidden h-screen w-[42%] flex-col p-5 xl:flex">
        <div className="absolute bottom-5 left-5 right-5 top-5">
          <img
            className="pointer-events-none block h-full w-full rounded-xl object-cover object-top"
            src={illustrationAuthentication}
            alt="authentication illustration"
          />
        </div>

        <div className="z-10 flex h-full w-full flex-col justify-between">
          <div className="ml-10 mt-10 w-max">
            <img src={logoLarge} alt="finance logo" />
          </div>
          <div className="flex flex-col gap-6 rounded-xl bg-grey-900/30 p-10">
            <p className="text-[2rem] font-bold leading-[1.2] text-white">
              Keep track of your money <br /> and save for your future
            </p>
            <p className="text-sm leading-normal text-white">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-24 md:py-48 xl:w-[58%] xl:px-36">
        <form
          className="flex w-full max-w-96 flex-col gap-8 rounded-xl bg-white px-5 py-6 md:max-w-[560px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <h1 className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
            Login
          </h1>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${
                  errors.email ? "border-red" : "border-beige-500"
                }`}
              />

              {errors.email && (
                <span className="text-xs leading-normal text-red">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${
                    errors.password ? "border-red" : "border-beige-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                >
                  {showPassword ? (
                    <img src={iconHidePassword} alt="hide password icon" />
                  ) : (
                    <img src={iconShowPassword} alt="show password icon" />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="text-xs leading-normal text-red">
                  {errors.password}
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            Login
          </button>
          {serverError && (
            <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-red bg-red/10 px-5 py-3 text-sm leading-normal text-red">
              <img src={iconError} alt="error icon" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm leading-normal text-grey-500">
              Need to create a new account?
            </span>
            <Link
              to="/sign-up"
              className="text-sm font-bold leading-normal text-grey-900 underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
