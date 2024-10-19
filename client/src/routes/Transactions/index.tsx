import { debounce } from "lodash";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateTransactionModal from "../../components/CreateTransactionModal";
import EditTransactionModal from "../../components/EditTransactionModal";
import TransactionsList from "../../components/TransactionsList";
import TransactionsPagination from "../../components/TransactionsPagination";
import TransactionSearchBar from "../../components/TransactionsSearchBar";
import { Transaction } from "../../types";

const Transactions = () => {
  // Hooks to get location and navigation functions from React Router
  const location = useLocation();
  const navigate = useNavigate();
  const parsedParams = queryString.parse(location.search);

  // State for managing transactions and filters
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(
    parsedParams.search ? String(parsedParams.search) : "",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(
    parsedParams.category ? String(parsedParams.category) : "All",
  );
  const [sortOption, setSortOption] = useState<string>(
    parsedParams.sort ? String(parsedParams.sort) : "Latest",
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parsedParams.page ? Number(parsedParams.page) : 1,
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Ref to manage scrolling
  const mainRef = useRef<HTMLDivElement>(null);

  // Cache to store previously fetched results
  const [cache, setCache] = useState<
    Map<string, { transactions: Transaction[]; totalPages: number }>
  >(new Map());

  // Debounced function to update search query
  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 30),
    [],
  );

  // Fetch transactions based on filters
  useEffect(() => {
    const fetchTransactions = async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        category: categoryFilter,
        sort: sortOption,
      });

      const cacheKey = queryParams.toString();

      // Check if data is cached
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setTransactions(cachedData!.transactions);
        setTotalPages(cachedData!.totalPages);
      } else {
        // Fetch from API if not cached
        const response = await fetch(
          `http://localhost:4000/api/v1/transactions?${queryParams}`,
        );
        const data = await response.json();

        if (response.ok) {
          setTransactions(data.transactions);
          setTotalPages(data.totalPages);

          // Cache the new data
          setCache((prevCache) =>
            new Map(prevCache).set(cacheKey, {
              transactions: data.transactions,
              totalPages: data.totalPages,
            }),
          );
        }
      }
    };

    fetchTransactions();
  }, [currentPage, searchQuery, categoryFilter, sortOption, cache]);

  // Sync state changes with the URL
  useEffect(() => {
    const params = {
      page: currentPage !== 1 ? currentPage.toString() : undefined,
      search: searchQuery ? searchQuery : undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      sort: sortOption !== "Latest" ? sortOption : undefined,
    };

    const queryParams = queryString.stringify(params);
    navigate(
      {
        pathname: location.pathname,
        search: queryParams,
      },
      { replace: true },
    );
  }, [
    currentPage,
    searchQuery,
    categoryFilter,
    sortOption,
    navigate,
    location.pathname,
  ]);

  const createTransaction = async (newTransaction: Transaction) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const updatedTransactions = [data, ...transactions];

        // Sort the transactions based on the date
        const sortedTransactions = updatedTransactions.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setTransactions(sortedTransactions);
        setTotalPages((prevTotalPages) =>
          Math.ceil((prevTotalPages * itemsPerPage + 1) / itemsPerPage),
        );
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      // Narrowing the type of error
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const editTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/transactions/${updatedTransaction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTransaction),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Find the index of the updated transaction in the current state
        const updatedTransactions = transactions.map((transaction) =>
          transaction._id === updatedTransaction._id
            ? data.transaction
            : transaction,
        );

        const sortedTransactions = updatedTransactions.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // Update the state with the new transactions
        setTransactions(sortedTransactions);

        // Close the edit modal
        setIsEditModalOpen(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  // Scroll to top of page
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main
      ref={mainRef}
      className="relative flex flex-col gap-8 px-4 pb-20 pt-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Transactions
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add New
        </button>
      </div>
      <div className="flex flex-col gap-6 rounded-xl bg-white px-5 py-6">
        <TransactionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={debouncedSetSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <TransactionsList transactions={transactions} onEdit={openEditModal} />
        {transactions.length > 0 ? (
          <TransactionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            scrollToTop={scrollToTop}
          />
        ) : (
          ""
        )}
      </div>
      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTransaction={createTransaction}
      />
      <EditTransactionModal
        isOpen={isEditModalOpen}
        selectedTransaction={selectedTransaction}
        onClose={() => setIsEditModalOpen(false)}
        onEditTransaction={editTransaction}
      />
    </main>
  );
};

export default Transactions;
