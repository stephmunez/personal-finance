import { useEffect, useState } from "react";
import OverviewSummary from "../../components/OverviewSummary";
import { Transaction } from "../../types";

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("http://localhost:4000/api/v1/transactions");
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Overview
        </h1>
      </div>
      <OverviewSummary transactions={transactions} />
    </main>
  );
};

export default Home;
