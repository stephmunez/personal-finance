import { Budget } from "../../types";
import { getThemeByCategory } from "../../utils";

interface BudgetsSummaryProps {
  budgets: Budget[] | null;
  totalSpent: { [key: string]: number };
}

const BudgetSummary = ({ budgets, totalSpent }: BudgetsSummaryProps) => {
  return (
    <div className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6">
      <div>{/* Pie chart placeholder */}</div>
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
          Spending Summary
        </h2>
        <ul className="flex w-full flex-col gap-4">
          {/* Display each budget category and spent amount */}
          {budgets &&
            budgets.map((budget, i) => (
              <li
                key={budget._id}
                className={`flex w-full items-center justify-between ${
                  i !== budgets.length - 1
                    ? "border-b border-solid border-grey-500/15 pb-4"
                    : ""
                }`}
              >
                <div className="relative flex items-center pl-5">
                  <span
                    className="absolute left-0 right-0 h-full w-1 rounded-lg"
                    style={{
                      backgroundColor: getThemeByCategory(budget.category),
                    }}
                  ></span>
                  <span className="text-[0.875rem] leading-normal tracking-normal text-grey-500">
                    {budget.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-normal text-grey-900">
                    P
                    {Math.abs(Number(totalSpent[budget.category] || 0)).toFixed(
                      2,
                    )}
                  </span>
                  <span className="text-xs leading-normal tracking-normal text-grey-500">
                    of P{budget.maximum.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default BudgetSummary;
