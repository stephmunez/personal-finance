import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import iconEllipsis from "../../assets/images/icon-ellipsis.svg";
interface Budget {
  _id: string;
  category: string;
  maximum: number;
  theme: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      const response = await fetch("http://localhost:4000/api/v1/budgets");
      const data = await response.json();

      if (response.ok) {
        setBudgets(data.budgets);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Budgets
        </h1>
        <button
          type="button"
          className="h-14 w-40 rounded-lg bg-black text-[0.875rem] font-bold leading-normal tracking-normal text-white"
        >
          + Add New Budget
        </button>
      </div>
      <div className="flex w-full flex-col gap-6">
        <div>
          <h2>Spending Summary</h2>
        </div>
        <div className="flex w-full flex-col gap-6">
          {budgets &&
            budgets.map((budget) => (
              <div
                key={budget._id}
                className="flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-full items-center gap-4">
                    <div
                      className={`h-4 w-4 rounded-full`}
                      style={{ backgroundColor: budget.theme }}
                    ></div>
                    <h3 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
                      {budget.category}
                    </h3>
                  </div>
                  <button type="button" className="h-4 w-4">
                    <img src={iconEllipsis} alt="ellipsis icon" />
                  </button>
                </div>

                <div className="flex w-full flex-col gap-6">
                  <p className="text-[0.875rem] leading-normal tracking-normal text-grey-500">
                    Maximum of P{budget.maximum.toFixed(2)}
                  </p>
                  <div className="h-8 w-full rounded-[4px] bg-beige-100 p-1">
                    <div
                      style={{ backgroundColor: budget.theme }}
                      className="h-full w-1/2 rounded-[4px]"
                    ></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative flex flex-1 flex-col gap-1 pl-4">
                      <span
                        className="absolute left-0 right-0 h-full w-1 rounded-lg"
                        style={{ backgroundColor: budget.theme }}
                      ></span>
                      <span className="text-xs leading-[1.2] tracking-normal text-grey-500">
                        Spent
                      </span>
                      <span className="text-sm font-bold leading-[1.5] tracking-normal text-grey-900">
                        P25.00
                      </span>
                    </div>
                    <div className="relative flex flex-1 flex-col gap-1 pl-4">
                      <span className="absolute left-0 right-0 h-full w-1 rounded-lg bg-beige-100"></span>
                      <span className="text-xs leading-[1.2] tracking-normal text-grey-500">
                        Free
                      </span>
                      <span className="text-sm font-bold leading-[1.5] tracking-normal text-grey-900">
                        P50.00
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
                      to={`/transactions`}
                      className="flex items-center gap-3 text-[0.875rem] leading-normal tracking-normal text-grey-500"
                    >
                      See All
                      <div className="flex h-3 w-3 items-center justify-center">
                        <img src={iconCaretRight} alt="caret right icon" />
                      </div>
                    </Link>
                  </div>
                  <ul className="flex w-full flex-col gap-5">
                    <li
                      className={`flex w-full items-center justify-between border-b border-solid border-grey-500/15 pb-3`}
                    >
                      <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                        Papa Software
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                          -P10.00
                        </span>
                        <span className="text-xs leading-normal tracking-normal text-grey-500">
                          16 Aug 2024
                        </span>
                      </div>
                    </li>
                    <li
                      className={`flex w-full items-center justify-between border-b border-solid border-grey-500/15 pb-3`}
                    >
                      <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                        Papa Software
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                          -P10.00
                        </span>
                        <span className="text-xs leading-normal tracking-normal text-grey-500">
                          16 Aug 2024
                        </span>
                      </div>
                    </li>
                    <li className={`flex w-full items-center justify-between`}>
                      <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                        Papa Software
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                          -P10.00
                        </span>
                        <span className="text-xs leading-normal tracking-normal text-grey-500">
                          16 Aug 2024
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Budgets;
