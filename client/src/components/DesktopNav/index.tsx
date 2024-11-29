import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import iconMinimizeMenu from "../../assets/images/icon-minimize-menu.svg";
import iconNavBudgetsActive from "../../assets/images/icon-nav-budgets-green.svg";
import iconNavBudgets from "../../assets/images/icon-nav-budgets.svg";
import iconNavLogout from "../../assets/images/icon-nav-logout.svg";
import iconNavOverviewActive from "../../assets/images/icon-nav-overview-green.svg";
import iconNavOverview from "../../assets/images/icon-nav-overview.svg";
import iconNavPotsActive from "../../assets/images/icon-nav-pots-green.svg";
import iconNavPots from "../../assets/images/icon-nav-pots.svg";
import iconNavRecurringBillsActive from "../../assets/images/icon-nav-recurring-bills-green.svg";
import iconNavRecurringBills from "../../assets/images/icon-nav-recurring-bills.svg";
import iconNavTransactionsActive from "../../assets/images/icon-nav-transactions-green.svg";
import iconNavTransactions from "../../assets/images/icon-nav-transactions.svg";
import logoLarge from "../../assets/images/logo-large.svg";
import logoSmall from "../../assets/images/logo-small.svg";

interface MobileNavProps {
  onLogout: () => void;
}

const navItems = [
  {
    name: "Overview",
    path: "/",
    icon: iconNavOverview,
    activeIcon: iconNavOverviewActive,
    alt: "overview icon",
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: iconNavTransactions,
    activeIcon: iconNavTransactionsActive,
    alt: "transactions icon",
  },
  {
    name: "Budgets",
    path: "/budgets",
    icon: iconNavBudgets,
    activeIcon: iconNavBudgetsActive,
    alt: "budgets icon",
  },
  {
    name: "Pots",
    path: "/pots",
    icon: iconNavPots,
    activeIcon: iconNavPotsActive,
    alt: "pots icon",
  },
  {
    name: "Recurring Bills",
    path: "/recurring-bills",
    icon: iconNavRecurringBills,
    activeIcon: iconNavRecurringBillsActive,
    alt: "recurring bills icon",
  },
];

const DesktopNav = ({ onLogout }: MobileNavProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const location = useLocation();

  return (
    <nav
      className={`sticky left-0 top-0 hidden h-screen min-h-[667px] flex-col gap-6 rounded-r-2xl bg-black pb-14 transition-all duration-300 xl:flex ${isMinimized ? "w-24 min-w-24" : "w-[300px] min-w-[300px]"}`}
    >
      <div className="w-full px-8 py-10">
        <Link
          to="/"
          className={`flex items-center ${isMinimized && "justify-center"}`}
        >
          <img
            src={isMinimized ? logoSmall : logoLarge}
            className={isMinimized ? "h-8 w-8" : ""}
            alt="logo large"
          />
        </Link>
      </div>
      <ul className="flex flex-1 flex-col gap-1">
        {navItems.map(({ name, path, icon, activeIcon, alt }) => (
          <li
            className={`transition-all duration-300 ${isMinimized ? "w-20" : "w-[276px]"}`}
            key={path}
          >
            <Link
              to={path}
              className={`flex h-14 w-full items-center gap-4 rounded-r-xl transition-colors ${isMinimized ? "justify-center" : "px-8 py-4"} ${
                location.pathname === path
                  ? "border-l-4 border-solid border-green bg-beige-100 transition-none"
                  : "bg-grey-900"
              }`}
            >
              <img
                src={location.pathname === path ? activeIcon : icon}
                alt={alt}
                className="h-6 w-6"
              />

              {!isMinimized && (
                <span
                  className={`block text-base font-bold leading-normal ${location.pathname === path ? "text-grey-900" : "text-grey-300"}`}
                >
                  {name}
                </span>
              )}
            </Link>
          </li>
        ))}
        <li
          className={`transition-all duration-300 ${isMinimized ? "w-20" : "w-[276px]"}`}
        >
          <button
            className={`flex h-14 w-full items-center gap-4 rounded-r-xl transition-colors ${isMinimized ? "justify-center" : "px-8 py-4"} bg-grey-900`}
            onClick={() => onLogout()}
          >
            <img src={iconNavLogout} alt="logout icon" />
            {!isMinimized && (
              <span
                className={`block text-base font-bold leading-normal text-grey-300`}
              >
                Logout
              </span>
            )}
          </button>
        </li>
      </ul>
      <div
        className={`flex w-full px-8 py-4 ${isMinimized && "justify-center"}`}
      >
        <button
          className={`flex h-8 items-center gap-4 transition-all duration-300 ${isMinimized ? "w-8 justify-center" : "w-fit"}`}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <img
            src={iconMinimizeMenu}
            alt="minimize menu icon"
            className={`transition-transform duration-300 ${isMinimized ? "rotate-180" : "rotate-0"}`}
          />
          {!isMinimized && (
            <span className="text-base font-bold tracking-normal text-grey-300">
              Minimize Menu
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default DesktopNav;
