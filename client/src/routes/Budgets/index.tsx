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

interface Transaction {
  category: string;
  amount: number;
  date: string; // Assuming the date is a string, you might need to adjust based on your data structure
  name: string; // Assuming you have a name field for transactions
}

const categoryOrder = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
];

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSpent, setTotalSpent] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchBudgetsAndTransactions = async () => {
      try {
        // Fetch budgets
        const budgetsResponse = await fetch(
          "http://localhost:4000/api/v1/budgets",
        );
        const budgetsData = await budgetsResponse.json();
        if (budgetsResponse.ok) {
          const sortedBudgets = budgetsData.budgets.sort(
            (a: Budget, b: Budget) => {
              return (
                categoryOrder.indexOf(a.category) -
                categoryOrder.indexOf(b.category)
              );
            },
          );
          setBudgets(sortedBudgets);
        }

        // Fetch transactions
        const transactionsResponse = await fetch(
          "http://localhost:4000/api/v1/transactions",
        );
        const transactionsData = await transactionsResponse.json();
        if (transactionsResponse.ok) {
          const transactions = transactionsData.transactions;

          // Calculate total spent for each category
          const spent = transactions.reduce(
            (acc: { [key: string]: number }, transaction: Transaction) => {
              if (acc[transaction.category]) {
                acc[transaction.category] += transaction.amount;
              } else {
                acc[transaction.category] = transaction.amount;
              }
              return acc;
            },
            {},
          );

          setTotalSpent(spent);
          setTransactions(transactions); // Store the transactions
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchBudgetsAndTransactions();
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
        <div className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6">
          <div>{/* pie chart goes here */}</div>
          <div className="flex w-full flex-col gap-6">
            <h2 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
              Spending Summary
            </h2>
            <ul className="flex w-full flex-col gap-4">
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
                        style={{ backgroundColor: budget.theme }}
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
        <div className="flex w-full flex-col gap-6">
          {budgets &&
            budgets.map((budget) => {
              // Filter the latest three transactions for this budget category
              const latestTransactions = transactions
                .filter(
                  (transaction) => transaction.category === budget.category,
                )
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 3); // Get the latest three transactions

              return (
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
                        style={{
                          backgroundColor: budget.theme,
                          width: `${((Math.abs(totalSpent[budget.category]) || 0) / Math.abs(budget.maximum)) * 100}%`,
                        }}
                        className="h-full rounded-[4px]"
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
                          {Math.abs(
                            budget.maximum +
                              (Number(totalSpent[budget.category]) || 0),
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
                            key={transaction.name + transaction.date} // Use a unique key
                            className={`flex w-full items-center justify-between border-b border-solid border-grey-500/15 pb-3`}
                          >
                            <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                              {transaction.name}
                            </span>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                                P{transaction.amount.toFixed(2)}
                              </span>
                              <span className="text-xs leading-normal tracking-normal text-grey-500">
                                {new Date(transaction.date).toLocaleDateString(
                                  "en-PH",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-grey-500">
                          No transactions
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
};

export default Budgets;
