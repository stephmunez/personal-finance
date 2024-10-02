import { useEffect, useRef, useState } from "react";
import TransactionsList from "../../components/TransactionsList";
import TransactionsPagination from "../../components/TransactionsPagination";
import TransactionSearchBar from "../../components/TransactionsSearchBar";
import { Transaction } from "../../types/Transaction";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;
  const mainRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main ref={mainRef} className="flex flex-col gap-8 px-4 pb-20 pt-6">
      <h1 className="my-2 text-[2rem] font-bold leading-[1.20] tracking-normal">
        Transactions
      </h1>
      <div className="flex flex-col gap-6 rounded-xl bg-white px-5 py-6">
        <TransactionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <TransactionsList transactions={transactions} />
        <TransactionsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          scrollToTop={scrollToTop}
        />
      </div>
    </main>
  );
};

export default Transactions;
