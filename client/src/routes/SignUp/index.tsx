import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import iconError from "../../assets/images/icon-bill-due.svg";
import iconHidePassword from "../../assets/images/icon-hide-password.svg";
import iconShowPassword from "../../assets/images/icon-show-password.svg";
import logoLarge from "../../assets/images/logo-large.svg";
import { useAuthContext } from "../../hooks/useAuthContext";
import { User } from "../../types";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { setUser } = useAuthContext();

  const signUpUser = async (user: User) => {
    setIsLoading(true);
    setErrors({ firstName: "", lastName: "", email: "", password: "" });
    setServerError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/sign-up`,
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
    const newErrors = { firstName: "", lastName: "", email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

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
      await signUpUser({ firstName, lastName, email, password });

      if (!serverError) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      }

      setErrors({ firstName: "", lastName: "", email: "", password: "" });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full items-center justify-center rounded-b-lg bg-grey-900 px-10 py-6">
        <div>
          <img src={logoLarge} alt="finance logo" />
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-24">
        <form
          className="flex w-full max-w-96 flex-col gap-8 rounded-xl bg-white px-5 py-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <h1 className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
            Sign Up
          </h1>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${
                  errors.firstName ? "border-red" : "border-beige-500"
                }`}
              />

              {errors.firstName && (
                <span className="text-xs leading-normal text-red">
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${
                  errors.lastName ? "border-red" : "border-beige-500"
                }`}
              />

              {errors.lastName && (
                <span className="text-xs leading-normal text-red">
                  {errors.lastName}
                </span>
              )}
            </div>
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
                Create Password
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
              {errors.password ? (
                <span className="text-xs leading-normal text-red">
                  {errors.password}
                </span>
              ) : (
                <>
                  <ul className="list-inside list-disc">
                    <li className="text-xs text-grey-500">
                      Password must be at least 8 characters
                    </li>
                    <li className="text-xs text-grey-500">
                      Must contain at least 1 lowercase
                    </li>
                    <li className="text-xs text-grey-500">
                      Must contain at least 1 uppercase letter
                    </li>
                    <li className="text-xs text-grey-500">
                      Must contain at least 1 number
                    </li>
                    <li className="text-xs text-grey-500">
                      Must contain at least 1 symbol (e.g., !, @, #, etc.).
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            Sign Up
          </button>
          {serverError && (
            <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-red bg-red/10 px-5 py-3 text-sm leading-normal text-red">
              <img src={iconError} alt="error icon" />
              <span>{serverError}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm leading-normal text-grey-500">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="text-sm font-bold leading-normal text-grey-900 underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
