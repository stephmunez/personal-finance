import { useEffect, useState } from "react";
import OverviewBudgets from "../../components/OverviewBudgets";
import OverviewPots from "../../components/OverviewPots";
import OverviewRecurringBills from "../../components/OverviewRecurringBills";
import OverviewSummary from "../../components/OverviewSummary";
import OverviewTransactions from "../../components/OverviewTransactions";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Budget, Pot, RecurringBill, Transaction } from "../../types";

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

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pots, setPots] = useState<Pot[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [totalSpent, setTotalSpent] = useState<{ [key: string]: number }>({});
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      const response = await fetch(`${process.env.API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
      if (!user) return;

      const response = await fetch(`${process.env.API_URL}/pots`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setPots(data.pots);
      }
    };

    const fetchBudgets = async () => {
      if (!user) return;

      const response = await fetch(`${process.env.API_URL}/budgets`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
      if (!user) return;

      const response = await fetch(`${process.env.API_URL}/recurring-bills`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setRecurringBills(data.recurringBills);
      }
    };

    if (user) {
      fetchTransactions();
      fetchPots();
      fetchBudgets();
      fetchRecurringBills();
    }
  }, [user]);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8 xl:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
          Overview
        </h1>
      </div>
      <OverviewSummary transactions={transactions} pots={pots} />
      <div className="flex w-full flex-col gap-6 xl:flex-row">
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
