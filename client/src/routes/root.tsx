import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DesktopNav from "../components/DesktopNav";
import LogoutModal from "../components/LogoutModal";
import MobileNav from "../components/MobileNav";
import { useAuthContext } from "../hooks/useAuthContext";

const Root = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { setUser } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setIsLogoutModalOpen(false);
  };

  const hideNav = pathname === "/login" || pathname === "/sign-up";

  return (
    <>
      {!hideNav && (
        <>
          <MobileNav onLogout={() => setIsLogoutModalOpen(true)} />
          <DesktopNav onLogout={() => setIsLogoutModalOpen(true)} />
        </>
      )}
      <Outlet />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={logout}
      />
    </>
  );
};

export default Root;
