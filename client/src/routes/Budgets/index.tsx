import { useEffect, useState } from "react";

interface Budget {
  _id: string;
  category: string;
  maximum: number;
  theme: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      const response = await fetch("http://localhost:4000/api/v1/budgets");
      const data = await response.json();

      if (response.ok) {
        setBudgets(data.budgets);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 py-6">
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
    </main>
  );
};

export default Budgets;
