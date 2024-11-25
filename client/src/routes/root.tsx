import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

const Root = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideNav = pathname === "/login" || pathname === "/sign-up";

  return (
    <>
      {!hideNav && (
        <>
          <MobileNav />
          <DesktopNav />
        </>
      )}
      <Outlet />
    </>
  );
};

export default Root;
