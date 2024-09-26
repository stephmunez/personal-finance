import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("http://localhost:4000/api/v1/transactions");
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setTransactions(data.transactions); // Access data.transactions array
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main>
      {transactions &&
        transactions.map((transaction) => (
          <div key={transaction._id}>
            <img src={transaction.avatar} alt={transaction.name} />
            <p>{transaction.name}</p>
            <p>{transaction.category}</p>
            <p>{new Date(transaction.date).toLocaleDateString()}</p>
            <p>{transaction.amount}</p>
            <p>{transaction.recurring ? "Recurring" : "One-time"}</p>
          </div>
        ))}
    </main>
  );
};

export default Transactions;
