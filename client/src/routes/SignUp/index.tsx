import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
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

  const { user, setUser } = useAuthContext();

  const signUpUser = async (user: User) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/user/sign-up",
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
        localStorage.setItem("token", JSON.stringify(data.token));
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    signUpUser({ firstName, lastName, email, password });
  };

  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full items-center justify-center rounded-b-lg bg-grey-900 px-10 py-6">
        <div>
          <img src={logoLarge} alt="finance logo" />
        </div>
      </div>
      {user && (
        <span>
          {user.firstName} {user.lastName}
        </span>
      )}
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
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none`}
              />
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
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none`}
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
              <span className="self-end text-xs text-grey-500">
                Password must be at least 8 characters
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign Up
          </button>
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
