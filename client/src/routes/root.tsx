import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav";

const Root = () => {
  return (
    <>
      <MobileNav />
      <Outlet />
    </>
  );
};

export default Root;
