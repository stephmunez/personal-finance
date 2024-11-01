import { useEffect, useState } from "react";
import { Pot, Transaction } from "../../types";

interface OverviewSummaryProps {
  transactions: Transaction[];
  pots: Pot[];
}

const OverviewSummary = ({ transactions, pots }: OverviewSummaryProps) => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

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

      pots.forEach((pot) => {
        potsTotal += pot.total;
      });

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setBalance(income - expenses - potsTotal);
    };

    calculateTotals(transactions);
  }, [transactions]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl bg-grey-900 p-5">
        <span className="text-sm leading-normal text-white">
          Current Balance
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-white">
          P{balance.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-white p-5">
        <span className="text-sm leading-normal text-grey-500">
          Total Income
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
          P{totalIncome.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-white p-5">
        <span className="text-sm leading-normal text-grey-500">
          Total Expenses
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
          P{totalExpenses.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OverviewSummary;
