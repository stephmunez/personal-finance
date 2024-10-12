import { useEffect, useState } from "react";
import BudgetsList from "../../components/BudgetsList";
import BudgetsSummary from "../../components/BudgetsSummary";

// Interfaces for Budget and Transaction types
interface Budget {
  _id: string;
  category: string;
  maximum: number;
  theme: string;
}

interface Transaction {
  category: string;
  amount: number;
  date: string;
  name: string;
}

// Define order of categories for sorting budgets
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
  // State to manage budgets, transactions, and total spent per category
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSpent, setTotalSpent] = useState<{ [key: string]: number }>({});

  // Fetch budgets and transactions on component mount
  useEffect(() => {
    const fetchBudgetsAndTransactions = async () => {
      try {
        // Fetch and sort budgets by defined category order
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

        // Fetch transactions and calculate total spent for each category
        const transactionsResponse = await fetch(
          "http://localhost:4000/api/v1/transactions",
        );
        const transactionsData = await transactionsResponse.json();
        if (transactionsResponse.ok) {
          const transactions = transactionsData.transactions;
          const spent = transactions.reduce(
            (acc: { [key: string]: number }, transaction: Transaction) => {
              acc[transaction.category] =
                (acc[transaction.category] || 0) + transaction.amount;
              return acc;
            },
            {},
          );
          setTotalSpent(spent);
          setTransactions(transactions);
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
        <BudgetsSummary budgets={budgets} totalSpent={totalSpent} />
        <BudgetsList
          budgets={budgets}
          transactions={transactions}
          totalSpent={totalSpent}
        />
      </div>
    </main>
  );
};

export default Budgets;
