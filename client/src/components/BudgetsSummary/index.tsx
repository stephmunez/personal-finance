import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Budget } from "../../types";
import { getThemeByCategory } from "../../utils";

interface BudgetsSummaryProps {
  budgets: Budget[] | null;
  totalSpent: { [key: string]: number };
}

const BudgetSummary = ({ budgets, totalSpent }: BudgetsSummaryProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (budgets) {
      setLoading(false);
    }
  }, [budgets]);

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

  const sortedBudgets = budgets
    ? [...budgets].sort(
        (a, b) => (totalSpent[b.category] || 0) - (totalSpent[a.category] || 0),
      )
    : [];

  return (
    <>
      {loading ? (
        <div className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6 md:flex-row md:p-8 xl:h-fit xl:w-2/5 xl:flex-col">
          <div className="relative flex h-72 w-72 items-center justify-center self-center">
            <div className="h-72 w-72 animate-pulse rounded-full bg-grey-100"></div>

            <div className="absolute top-1/2 flex h-48 w-48 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full bg-white/25">
              <span className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
                <span className="h-8 w-16 animate-pulse rounded bg-grey-100"></span>
              </span>
              <span className="text-xs leading-normal tracking-normal text-grey-500">
                <span className="h-4 w-20 animate-pulse rounded bg-grey-100"></span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="h-6 w-32 animate-pulse rounded bg-grey-100"></div>

            <ul className="flex w-full flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className={`flex w-full items-center justify-between ${
                    index !== 4
                      ? "border-b border-solid border-grey-500/15 pb-4"
                      : ""
                  }`}
                >
                  <div className="relative flex items-center pl-5">
                    <span className="h-4 w-16 animate-pulse rounded bg-grey-100"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-12 animate-pulse rounded bg-grey-100"></span>
                    <span className="h-4 w-12 animate-pulse rounded bg-grey-100"></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6 md:flex-row md:justify-between md:p-8 xl:h-fit xl:w-2/5 xl:flex-col">
          <div className="flex w-full items-center justify-center md:w-[47%] xl:w-full">
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
                  {`P${Math.abs(Number(overallSpent))}`}
                </span>
                <span className="text-xs leading-normal tracking-normal text-grey-500">
                  {`of P${overallMaximum.toFixed(0)} limit`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 md:w-[47%] md:justify-center xl:w-full">
            <h2 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
              Spending Summary
            </h2>

            <ul className="flex w-full flex-col gap-4">
              {sortedBudgets &&
                sortedBudgets.map((budget, i) => (
                  <li
                    key={budget._id}
                    className={`flex w-full items-center justify-between ${
                      i !== sortedBudgets.length - 1
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
                        {Math.abs(
                          Number(totalSpent[budget.category] || 0),
                        ).toFixed(2)}
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
      )}
    </>
  );
};

export default BudgetSummary;
