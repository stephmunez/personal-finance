const NotFound = () => {
  return (
    <main className="flex w-full flex-col items-center gap-8 py-96">
      <h1 className="text-9xl font-bold text-grey-900">404</h1>
      <p className="text-2xl text-grey-900">
        Page not found.{" "}
        <a href="/" className="text-blue underline">
          Go back to home.
        </a>
      </p>
    </main>
  );
};

export default NotFound;
