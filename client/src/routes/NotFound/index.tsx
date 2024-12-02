import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-8 px-8">
      <h1 className="text-8xl font-bold text-green">404</h1>
      <p className="text-center text-xl">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
        to="/"
      >
        Go to Homepage
      </Link>
    </main>
  );
};

export default NotFound;
