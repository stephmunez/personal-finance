import { PieChart } from "@mui/x-charts";
import { Budget } from "../../types";
import { getThemeByCategory } from "../../utils";

interface BudgetsSummaryProps {
  budgets: Budget[] | null;
  totalSpent: { [key: string]: number };
}

const BudgetSummary = ({ budgets, totalSpent }: BudgetsSummaryProps) => {
  const overallSpent = budgets
    ? budgets.reduce(
        (acc, budget) => acc + (totalSpent[budget.category] || 0),
        0,
      )
    : 0;

  const overallMaximum = budgets
    ? budgets.reduce((acc, budget) => acc + budget.maximum, 0)
    : 0;

  const chartData = budgets
    ? budgets.map((budget) => ({
        id: budget._id,
        value: Math.abs(Number(totalSpent[budget.category] || 0)),
        color: getThemeByCategory(budget.category),
      }))
    : [];

  return (
    <div className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6">
      <div className="relative flex h-72 w-72 items-center justify-center self-center">
        <PieChart
          series={[
            {
              innerRadius: 80,
              outerRadius: 124,
              data: chartData,
              cx: 140,
            },
          ]}
          slotProps={{
            legend: { hidden: true },
          }}
          tooltip={{ trigger: "none" }}
          height={288}
        />
        <div className="absolute top-1/2 flex h-48 w-48 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full bg-white/25">
          <span className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
            P{Math.abs(Number(overallSpent))}
          </span>
          <span className="text-xs leading-normal tracking-normal text-grey-500">
            of P{overallMaximum.toFixed(0)} limit
          </span>
        </div>
      </div>

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
