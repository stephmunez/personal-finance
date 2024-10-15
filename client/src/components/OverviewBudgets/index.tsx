import { PieChart } from "@mui/x-charts";
import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import { Budget } from "../../types";
import { getThemeByCategory } from "../../utils";

interface OverviewBudgetsProps {
  budgets: Budget[] | null;
  totalSpent: { [key: string]: number };
}

const OverviewBudgets = ({ budgets, totalSpent }: OverviewBudgetsProps) => {
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
    <section className="flex flex-col gap-5 rounded-xl bg-white px-5 py-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
          Budgets
        </h2>
        <Link
          to={"/budgets"}
          className="flex items-center gap-3 text-sm leading-normal text-grey-500"
        >
          See Details <img src={iconCaretRight} alt="caret right icon" />
        </Link>
      </div>
      <div className="flex w-full flex-col gap-4">
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
        <ul className="flex w-full flex-wrap gap-4">
          {budgets &&
            budgets.slice(0, 4).map((budget) => (
              <li
                key={budget._id}
                className="flex flex-[1_1_calc(50%-16px)] gap-4"
              >
                <div
                  className="h-full w-1 rounded-lg"
                  style={{ backgroundColor: budget.theme }}
                ></div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs leading-normal text-grey-500">
                    {budget.category}
                  </h4>
                  <span className="text-sm font-bold leading-normal text-grey-900">
                    P{Math.abs(totalSpent[budget.category] || 0).toFixed(0)}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default OverviewBudgets;
