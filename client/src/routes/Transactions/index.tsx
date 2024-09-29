import { styled } from "@mui/material/styles";
import usePagination from "@mui/material/usePagination";
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

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
});

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        category: categoryFilter,
        sort: sortOption,
      });

      const response = await fetch(
        `http://localhost:4000/api/v1/transactions?${queryParams}`,
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      }
    };

    fetchTransactions();
  }, [currentPage, searchQuery, categoryFilter, sortOption]);

  // Pagination logic
  const { items } = usePagination({
    count: totalPages,
    page: currentPage,
    onChange: (_, page) => setCurrentPage(page),
  });

  return (
    <main>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}
        >
          <option value="All">All</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Groceries">Groceries</option>
          <option value="Dining Out">Dining Out</option>
          <option value="Transportation">Transportation</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Education">Education</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Shopping">Shopping</option>
          <option value="General">General</option>
        </select>
        <select
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
        >
          <option value="Latest">Latest</option>
          <option value="Oldest">Oldest</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Highest">Highest</option>
          <option value="Lowest">Lowest</option>
        </select>
      </div>

      {transactions.map((transaction) => (
        <div key={transaction._id}>
          {/* <img src={transaction.avatar} alt={transaction.name} /> */}
          <p>{transaction.name}</p>
          <p>{transaction.category}</p>
          <p>{new Date(transaction.date).toLocaleDateString()}</p>
          <p>{transaction.amount}</p>
          <p>{transaction.recurring ? "Recurring" : "One-time"}</p>
        </div>
      ))}

      <nav>
        <List>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  className={`${selected ? "font-bold" : ""}`}
                  onClick={() => {
                    if (page !== null) {
                      setCurrentPage(page);
                    }
                  }}
                >
                  {page}
                </button>
              );
            } else {
              children = (
                <button type="button" {...item}>
                  {type}
                </button>
              );
            }

            return <li key={index}>{children}</li>;
          })}
        </List>
      </nav>
    </main>
  );
};

export default Transactions;
