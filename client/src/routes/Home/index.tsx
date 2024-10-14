import { useEffect, useState } from "react";
import OverviewSummary from "../../components/OverviewSummary";
import { Transaction } from "../../types";

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const calculateTotals = (transactions: Transaction[]) => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setBalance(income - expenses);
  };

  useEffect(() => {
    const fetchRecurringBills = async () => {
      const response = await fetch("http://localhost:4000/api/v1/transactions");
      const data = await response.json();

      if (response.ok) {
        calculateTotals(data.transactions);
      }
    };

    fetchRecurringBills();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Overview
        </h1>
      </div>
      <OverviewSummary
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />
    </main>
  );
};

export default Home;
