import { Link, useLocation } from "react-router-dom";
import iconNavBudgetsActive from "../../assets/images/icon-nav-budgets-green.svg";
import iconNavBudgets from "../../assets/images/icon-nav-budgets.svg";
import iconNavOverviewActive from "../../assets/images/icon-nav-overview-green.svg";
import iconNavOverview from "../../assets/images/icon-nav-overview.svg";
import iconNavPotsActive from "../../assets/images/icon-nav-pots-green.svg";
import iconNavPots from "../../assets/images/icon-nav-pots.svg";
import iconNavRecurringBillsActive from "../../assets/images/icon-nav-recurring-bills-green.svg";
import iconNavRecurringBills from "../../assets/images/icon-nav-recurring-bills.svg";
import iconNavTransactionsActive from "../../assets/images/icon-nav-transactions-green.svg";
import iconNavTransactions from "../../assets/images/icon-nav-transactions.svg";

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

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full rounded-t-lg bg-grey-900 px-4 pt-2 md:px-10">
      <ul className="flex items-center justify-between">
        {navItems.map(({ name, path, icon, activeIcon, alt }) => (
          <li className="max-w-28 flex-1" key={path}>
            <Link
              to={path}
              className={`flex h-11 w-full items-center justify-center gap-1 rounded-t-lg transition-colors md:h-16 md:flex-col ${
                location.pathname === path
                  ? "border-b-4 border-solid border-green bg-beige-100 transition-none"
                  : "bg-grey-900"
              }`}
            >
              <img
                src={location.pathname === path ? activeIcon : icon}
                alt={alt}
              />
              <span
                className={`hidden text-xs font-bold leading-normal md:block ${location.pathname === path ? "text-grey-900" : "text-grey-300"}`}
              >
                {name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
