import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import iconEllipsis from "../../assets/images/icon-ellipsis.svg";
import { Budget, Transaction } from "../../types";
import { getThemeByCategory } from "../../utils";

interface BudgetsSummaryProps {
  budgets: Budget[] | null;
  transactions: Transaction[] | null;
  totalSpent: { [key: string]: number };
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

const BudgetsList = ({
  budgets,
  transactions,
  totalSpent,
  onEdit,
  onDelete,
}: BudgetsSummaryProps) => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleBudgetClick = (budgetId: string) => {
    if (selectedBudget === budgetId) {
      setSelectedBudget(null);
    } else {
      setSelectedBudget(budgetId);
    }
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedBudget(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      {budgets &&
        budgets.map((budget) => {
          const filteredTransactions =
            transactions?.filter(
              (transaction) => transaction.category === budget.category,
            ) || [];

          const latestTransactions = filteredTransactions
            .filter((transaction) => transaction.category === budget.category)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 3);

          return (
            <div
              key={budget._id}
              className="relative flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full items-center gap-4">
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{
                      backgroundColor: getThemeByCategory(budget.category),
                    }}
                  ></div>
                  <h3 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
                    {budget.category}
                  </h3>
                </div>
                <button
                  type="button"
                  className="h-4 w-4"
                  onClick={() => handleBudgetClick(budget._id || "")}
                >
                  <img src={iconEllipsis} alt="ellipsis icon" />
                </button>
              </div>

              <div className="flex w-full flex-col gap-6">
                <p className="text-[0.875rem] leading-normal tracking-normal text-grey-500">
                  Maximum of P{budget.maximum.toFixed(2)}
                </p>
                <div className="h-8 w-full rounded-[4px] bg-beige-100 p-1">
                  <div
                    style={{
                      backgroundColor: getThemeByCategory(budget.category),
                      width: `${Math.min(
                        ((Math.abs(totalSpent[budget.category]) || 0) /
                          Math.abs(budget.maximum)) *
                          100,
                        100,
                      )}%`,
                    }}
                    className="h-full rounded-[4px]"
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex flex-1 flex-col gap-1 pl-4">
                    <span
                      className="absolute left-0 right-0 h-full w-1 rounded-lg"
                      style={{
                        backgroundColor: getThemeByCategory(budget.category),
                      }}
                    ></span>
                    <span className="text-xs leading-[1.2] tracking-normal text-grey-500">
                      Spent
                    </span>
                    <span className="text-sm font-bold leading-[1.5] tracking-normal text-grey-900">
                      P
                      {Math.abs(
                        Number(totalSpent[budget.category] || 0),
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="relative flex flex-1 flex-col gap-1 pl-4">
                    <span className="absolute left-0 right-0 h-full w-1 rounded-lg bg-beige-100"></span>
                    <span className="text-xs leading-[1.2] tracking-normal text-grey-500">
                      Free
                    </span>
                    <span className="text-sm font-bold leading-[1.5] tracking-normal text-grey-900">
                      P
                      {Math.max(
                        budget.maximum +
                          (Number(totalSpent[budget.category]) || 0),
                        0,
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-5 rounded-xl bg-beige-100 p-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-base font-bold tracking-normal text-grey-900">
                    Latest Spending
                  </span>
                  <Link
                    to={`/transactions?category=${budget.category}`}
                    className="flex items-center gap-3 text-[0.875rem] leading-normal tracking-normal text-grey-500"
                  >
                    See All
                    <div className="flex h-3 w-3 items-center justify-center">
                      <img src={iconCaretRight} alt="caret right icon" />
                    </div>
                  </Link>
                </div>
                <ul className="flex flex-col gap-3">
                  {latestTransactions.length > 0 ? (
                    latestTransactions.map((transaction) => (
                      <li
                        key={transaction.name + transaction.date}
                        className={`flex w-full items-center justify-between ${
                          latestTransactions.indexOf(transaction) !==
                          latestTransactions.length - 1
                            ? "border-b border-solid border-grey-500/15 pb-3"
                            : ""
                        }`}
                      >
                        <span className="text-[0.875rem] leading-normal tracking-normal text-grey-500">
                          {transaction.name}
                        </span>
                        <span className="text-base font-bold tracking-normal text-grey-900">
                          P{Math.abs(Number(transaction.amount)).toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
                      No transactions yet.
                    </li>
                  )}
                </ul>
              </div>

              <div
                ref={dropdownRef}
                aria-hidden={!selectedBudget}
                className={`absolute right-5 top-12 z-10 flex cursor-auto flex-col gap-3 rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)] transition-opacity duration-300 ${
                  selectedBudget === budget._id ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  className="text-left text-sm leading-normal text-grey-900"
                  onClick={() => onEdit(budget)}
                >
                  Edit Budget
                </button>
                <div className="pointer-events-none h-px w-full bg-grey-100"></div>
                <button
                  className="text-left text-sm leading-normal text-red"
                  onClick={() => onDelete(budget)}
                >
                  Delete Budget
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default BudgetsList;
