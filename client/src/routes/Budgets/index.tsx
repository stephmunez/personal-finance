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
    <main>
      {budgets &&
        budgets.map((budget) => (
          <div key={budget._id}>
            <p>{budget.category}</p>
          </div>
        ))}
    </main>
  );
};

export default Budgets;
