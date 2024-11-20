import { useEffect, useState } from "react";
import OverviewBudgets from "../../components/OverviewBudgets";
import OverviewPots from "../../components/OverviewPots";
import OverviewRecurringBills from "../../components/OverviewRecurringBills";
import OverviewSummary from "../../components/OverviewSummary";
import OverviewTransactions from "../../components/OverviewTransactions";
import { Budget, Pot, RecurringBill, Transaction } from "../../types";

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pots, setPots] = useState<Pot[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [totalSpent, setTotalSpent] = useState<{ [key: string]: number }>({});

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

  useEffect(() => {
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

    const fetchTransactions = async () => {
      const response = await fetch("http://localhost:4000/api/v1/transactions");
      const data = await response.json();

      if (response.ok) {
        const transactions = data.transactions;
        const spent = transactions.reduce(
          (acc: { [key: string]: number }, transaction: Transaction) => {
            if (transaction.amount < 0) {
              acc[transaction.category] =
                (acc[transaction.category] || 0) + Math.abs(transaction.amount);
            }
            return acc;
          },
          {},
        );
        setTotalSpent(spent);
        setTransactions(data.transactions);
      }
    };

    const fetchPots = async () => {
      const response = await fetch("http://localhost:4000/api/v1/pots");
      const data = await response.json();

      if (response.ok) {
        setPots(data.pots);
      }
    };

    const fetchBudgets = async () => {
      const response = await fetch("http://localhost:4000/api/v1/budgets");
      const data = await response.json();

      if (response.ok) {
        const sortedBudgets = data.budgets.sort((a: Budget, b: Budget) => {
          return (
            categoryOrder.indexOf(a.category) -
            categoryOrder.indexOf(b.category)
          );
        });

        setBudgets(sortedBudgets);
      }
    };

    const fetchRecurringBills = async () => {
      const response = await fetch(
        "http://localhost:4000/api/v1/recurring-bills",
      );
      const data = await response.json();

      if (response.ok) {
        setRecurringBills(data.recurringBills);
      }
    };

    fetchTransactions();
    fetchPots();
    fetchBudgets();
    fetchRecurringBills();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
          Overview
        </h1>
      </div>
      <OverviewSummary transactions={transactions} pots={pots} />
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-4 md:gap-6">
          <OverviewPots pots={pots} />
          <OverviewTransactions transactions={transactions} />
        </div>
        <div className="flex w-full flex-col gap-4 md:gap-6">
          <OverviewBudgets budgets={budgets} totalSpent={totalSpent} />
          <OverviewRecurringBills recurringBills={recurringBills} />
        </div>
      </div>
    </main>
  );
};

export default Home;
