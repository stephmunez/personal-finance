import { useEffect, useState } from "react";

interface RecurringBill {
  _id: string;
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

const RecurringBills = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[] | null>(
    null,
  );

  useEffect(() => {
    const fetchRecurringBills = async () => {
      const response = await fetch(
        "http://localhost:4000/api/v1/recurring-bills",
      );
      const data = await response.json();

      if (response.ok) {
        setRecurringBills(data.recurringBills);
      }
    };

    fetchRecurringBills();
  }, []);

  return (
    <main>
      {recurringBills &&
        recurringBills.map((recurring) => (
          <div key={recurring._id}>
            <p>{recurring.name}</p>
          </div>
        ))}
    </main>
  );
};

export default RecurringBills;
