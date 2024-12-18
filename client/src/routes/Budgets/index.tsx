import { useEffect, useState } from "react";
import BudgetsList from "../../components/BudgetsList";
import BudgetsSummary from "../../components/BudgetsSummary";
import CreateBudgetModal from "../../components/CreateBudgetModal";
import DeleteBudgetModal from "../../components/DeleteBudgetModal";
import EditBudgetModal from "../../components/EditBudgetModal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Budget, Transaction } from "../../types";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const { user } = useAuthContext();

  // Fetch budgets and transactions on component mount

  const fetchBudgetsAndTransactions = async () => {
    if (!user) return;

    try {
      // Fetch and sort budgets by defined category order
      const budgetsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/budgets`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
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

        const uniqueCategories = Array.from(
          new Set(sortedBudgets.map((budget: Budget) => budget.category)),
        ) as string[];
        setExistingCategories(uniqueCategories);
      }

      // Fetch transactions and filter only negative amounts
      const transactionsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      const transactionsData = await transactionsResponse.json();
      if (transactionsResponse.ok) {
        const transactions = transactionsData.transactions.filter(
          (transaction: Transaction) => transaction.amount < 0,
        );
        const spent = transactions.reduce(
          (acc: { [key: string]: number }, transaction: Transaction) => {
            acc[transaction.category] =
              (acc[transaction.category] || 0) + Math.abs(transaction.amount);
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

  useEffect(() => {
    if (user) {
      fetchBudgetsAndTransactions();
    }
  }, [user]);

  const createBudget = async (newBudget: Budget) => {
    if (!user) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newBudget),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCreateModalOpen(false);
        await fetchBudgetsAndTransactions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const editBudget = async (updatedBudget: Budget) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/budgets/${updatedBudget._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedBudget),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsEditModalOpen(false);
        await fetchBudgetsAndTransactions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const deleteBudget = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/budgets/${selectedBudget?._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.ok) {
        setIsDeleteModalOpen(false);
        await fetchBudgetsAndTransactions();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const openEditModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDeleteModalOpen(true);
  };

  return (
    <main className="relative flex w-full flex-col gap-8 px-4 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8 xl:py-8">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Budgets
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add New
        </button>
      </div>
      <div className="flex w-full flex-col gap-6 xl:max-h-[calc(100vh-120px)] xl:min-h-[690px] xl:flex-row xl:overflow-hidden">
        {budgets && budgets.length ? (
          <>
            <BudgetsSummary budgets={budgets} totalSpent={totalSpent} />

            <BudgetsList
              budgets={budgets}
              transactions={transactions}
              totalSpent={totalSpent}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </>
        ) : (
          <p className="w-full text-center text-sm leading-normal text-grey-500">
            No budgets to display.
          </p>
        )}
      </div>

      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBudget={createBudget}
        existingCategories={existingCategories}
      />
      <EditBudgetModal
        isOpen={isEditModalOpen}
        selectedBudget={selectedBudget}
        onClose={() => setIsEditModalOpen(false)}
        onEditBudget={editBudget}
        existingCategories={existingCategories}
      />
      <DeleteBudgetModal
        isOpen={isDeleteModalOpen}
        selectedBudget={selectedBudget}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteBudget={deleteBudget}
      />
    </main>
  );
};

export default Budgets;
