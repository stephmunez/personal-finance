import { Transaction } from "../../types/Transaction";
import { getIconByCategory, getThemeByCategory } from "../../utils";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <ul>
      {transactions.map((transaction, i) => (
        <li
          key={transaction._id}
          className={`flex items-center justify-between py-4 ${
            i !== transactions.length - 1
              ? "border-b border-solid border-grey-100"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: getThemeByCategory(transaction.category),
              }}
            >
              <img
                className="h-4 w-4"
                src={getIconByCategory(transaction.category)}
                alt={`${transaction.category} icon`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.875rem] font-bold leading-normal tracking-normal text-grey-900">
                {transaction.name}
              </span>
              <span className="text-[0.75rem] leading-normal tracking-normal text-grey-500">
                {transaction.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-[0.875rem] font-bold leading-normal tracking-normal ${
                transaction.amount > 0 ? "text-green" : "text-grey-900"
              }`}
            >
              {`${transaction.amount < 0 ? "-" : "+"}P${Math.abs(
                transaction.amount,
              ).toFixed(2)}`}
            </span>
            <span className="text-[0.75rem] leading-normal tracking-normal text-grey-500">
              {new Date(transaction.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(/ /g, " ")}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
