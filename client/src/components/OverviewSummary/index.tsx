import { useEffect, useState } from "react";
import { Pot, Transaction } from "../../types";

interface OverviewSummaryProps {
  transactions: Transaction[] | null;
  pots: Pot[] | null;
}

const OverviewSummary = ({ transactions, pots }: OverviewSummaryProps) => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateTotals = (transactions: Transaction[]) => {
      let income = 0;
      let expenses = 0;
      let potsTotal = 0;

      transactions.forEach((transaction) => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        } else {
          expenses += Math.abs(transaction.amount);
        }
      });

      if (pots) {
        pots.forEach((pot) => {
          potsTotal += pot.total;
        });
      }

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setBalance(income - expenses - potsTotal);

      if (transactions && pots) {
        setLoading(false);
      }
    };

    if (transactions) {
      calculateTotals(transactions);
    }
  }, [transactions, pots]);

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-6">
      <div className="flex w-full flex-col gap-3 rounded-xl bg-grey-900 p-5 md:p-6">
        <span className="text-sm leading-normal text-white">
          Current Balance
        </span>
        {loading ? (
          <div className="h-10 w-32 animate-pulse rounded bg-grey-100"></div>
        ) : (
          <span className="text-[2rem] font-bold leading-[1.2] text-white">
            P{balance.toFixed(2)}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 md:p-6">
        <span className="text-sm leading-normal text-grey-500">
          Total Income
        </span>
        {loading ? (
          <div className="h-10 w-32 animate-pulse rounded bg-grey-100"></div>
        ) : (
          <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
            P{totalIncome.toFixed(2)}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 md:p-6">
        <span className="text-sm leading-normal text-grey-500">
          Total Expenses
        </span>
        {loading ? (
          <div className="h-10 w-32 animate-pulse rounded bg-grey-100"></div>
        ) : (
          <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
            P{totalExpenses.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

export default OverviewSummary;
