import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import { Transaction } from "../../types";
import { getIconByCategory, getThemeByCategory } from "../../utils";

interface OverviewTransactionsProps {
  transactions: Transaction[] | null;
}

const OverviewTransactions = ({ transactions }: OverviewTransactionsProps) => {
  const [recentTransactions, setRecentTransactions] = useState<
    Transaction[] | null
  >(null);

  useEffect(() => {
    if (transactions) {
      // Sort transactions by date (newest first) and take the 5 most recent ones
      const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentTransactions(sortedTransactions);
    }
  }, [transactions]);

  return (
    <section className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
          Transactions
        </h2>
        <Link
          to={"/transactions"}
          className="flex items-center gap-3 text-sm leading-normal text-grey-500"
        >
          View All <img src={iconCaretRight} alt="caret right icon" />
        </Link>
      </div>
      <ul className="flex w-full flex-col gap-5">
        {recentTransactions ? (
          recentTransactions.map((transaction, i) => (
            <li
              key={transaction._id}
              className={`flex items-center justify-between ${
                i !== recentTransactions.length - 1
                  ? "border-b border-solid border-grey-500/15 pb-5"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: getThemeByCategory(transaction.category),
                  }}
                >
                  <img
                    src={getIconByCategory(transaction.category)}
                    alt={`${transaction.category} icon`}
                  />
                </div>
                <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
                  {transaction.name}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-sm font-bold leading-normal ${
                    transaction.amount > 0 ? "text-green" : "text-grey-900"
                  }`}
                >
                  {`${transaction.amount < 0 ? "-" : "+"}P${Math.abs(
                    transaction.amount,
                  ).toFixed(2)}`}
                </span>
                <span className="text-xs leading-normal tracking-normal text-grey-500">
                  {moment(transaction.date).format("DD MMM YYYY")}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
            No pots yet.
          </li>
        )}
      </ul>
    </section>
  );
};

export default OverviewTransactions;
