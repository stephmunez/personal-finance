import { useEffect, useRef, useState } from "react";
import { Transaction } from "../../types";
import { getIconByCategory, getThemeByCategory } from "../../utils";

interface TransactionListProps {
  transactions: Transaction[] | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const transactionListRef = useRef<HTMLUListElement | null>(null);

  const handleTransactionClick = (transactionId: string) => {
    setSelectedTransaction((prev) =>
      prev === transactionId ? null : transactionId,
    );
  };

  useEffect(() => {
    if (transactions) {
      setLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        transactionListRef.current &&
        !transactionListRef.current.contains(event.target as Node)
      ) {
        setSelectedTransaction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {loading ? (
        // Skeleton loaders while data is loading
        <ul className="animate-pulse">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className={`relative flex cursor-auto flex-col items-start justify-between py-4 ${
                index !== 4 ? "border-b border-solid border-grey-100" : ""
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-grey-100"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-24 rounded bg-grey-100"></div>
                    <div className="h-3 w-16 rounded bg-grey-100"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="h-4 w-16 rounded bg-grey-100"></div>
                  <div className="h-3 w-20 rounded bg-grey-100"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : transactions && transactions.length > 0 ? (
        <ul ref={transactionListRef}>
          {transactions.map((transaction, i) => (
            <li
              key={transaction._id}
              className={`relative flex cursor-auto flex-col items-start justify-between py-4 ${
                i !== transactions.length - 1
                  ? "border-b border-solid border-grey-100"
                  : ""
              }`}
              onClick={() => handleTransactionClick(transaction._id || "")}
            >
              <div className="flex w-full items-center justify-between">
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
              </div>

              <div
                className={`absolute right-0 top-1/2 z-10 flex cursor-auto flex-col gap-3 rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)] transition-opacity duration-300 ${
                  selectedTransaction === transaction._id
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                }`}
              >
                <button
                  className="text-left text-sm leading-normal text-grey-900"
                  onClick={() => onEdit(transaction)}
                >
                  Edit Transaction
                </button>
                <div className="pointer-events-none h-px w-full bg-grey-100"></div>
                <button
                  className="text-left text-sm leading-normal text-red"
                  onClick={() => onDelete(transaction)}
                >
                  Delete Transaction
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm leading-normal text-grey-500">
          No transactions available.
        </p>
      )}
    </>
  );
};

export default TransactionList;
