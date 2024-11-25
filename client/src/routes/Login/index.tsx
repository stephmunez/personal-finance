import { useState } from "react";
import { Link } from "react-router-dom";
import iconHidePassword from "../../assets/images/icon-hide-password.svg";
import iconShowPassword from "../../assets/images/icon-show-password.svg";
import logoLarge from "../../assets/images/logo-large.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full items-center justify-center rounded-b-lg bg-grey-900 px-10 py-6">
        <div>
          <img src={logoLarge} alt="finance logo" />
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-24">
        <form className="flex w-full max-w-96 flex-col gap-8 rounded-xl bg-white px-5 py-6">
          <h1 className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
            Login
          </h1>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Email
              </label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none`}
              />
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
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Login
          </button>
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
