import { useEffect, useState } from "react";
import OverviewPots from "../../components/OverviewPots";
import OverviewSummary from "../../components/OverviewSummary";
import OverviewTransactions from "../../components/OverviewTransactions";
import { Pot, Transaction } from "../../types";

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pots, setPots] = useState<Pot[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("http://localhost:4000/api/v1/transactions");
      const data = await response.json();

      if (response.ok) {
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

    fetchTransactions();
    fetchPots();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Overview
        </h1>
      </div>
      <OverviewSummary transactions={transactions} />
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          <OverviewPots pots={pots} />
          <OverviewTransactions transactions={transactions} />
        </div>
      </div>
    </main>
  );
};

export default Home;
