import { debounce } from "lodash";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateTransactionModal from "../../components/CreateTransactionModal";
import DeleteTransactionModal from "../../components/DeleteTransactionModal";
import EditTransactionModal from "../../components/EditTransactionModal";
import TransactionsList from "../../components/TransactionsList";
import TransactionsPagination from "../../components/TransactionsPagination";
import TransactionSearchBar from "../../components/TransactionsSearchBar";
import { Transaction } from "../../types";

const Transactions = () => {
  // React Router hooks to manage navigation and location
  const location = useLocation();
  const navigate = useNavigate();
  const parsedParams = queryString.parse(location.search);

  // States for managing transactions, filters, pagination, and modals
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const itemsPerPage = 10;

  // Ref to handle scrolling
  const mainRef = useRef<HTMLDivElement>(null);

  // Cache state for storing previously fetched results
  const [cache, setCache] = useState<
    Map<string, { transactions: Transaction[]; totalPages: number }>
  >(new Map());

  // Debounced function for updating search query
  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 30),
    [],
  );

  // Fetch transactions from the API
  const fetchTransactions = async (forceRefresh = false) => {
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      search: searchQuery,
      category: categoryFilter,
      sort: sortOption,
    });

    const cacheKey = queryParams.toString();

    if (!forceRefresh && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setTransactions(cachedData!.transactions);
      setTotalPages(cachedData!.totalPages);
    } else {
      const response = await fetch(
        `http://localhost:4000/api/v1/transactions?${queryParams}`,
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);

        if (!forceRefresh) {
          setCache((prevCache) =>
            new Map(prevCache).set(cacheKey, {
              transactions: data.transactions,
              totalPages: data.totalPages,
            }),
          );
        }

        if (data.transactions.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
      }
    }
  };

  // Sync state with URL parameters
  useEffect(() => {
    const params = {
      page: currentPage !== 1 ? currentPage.toString() : undefined,
      search: searchQuery ? searchQuery : undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      sort: sortOption !== "Latest" ? sortOption : undefined,
    };

    const queryParams = queryString.stringify(params);
    navigate(
      { pathname: location.pathname, search: queryParams },
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

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery, categoryFilter, sortOption]);

  // Functions to handle Create, Edit, and Delete operations
  const createTransaction = async (newTransaction: Transaction) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTransaction),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCache(new Map()); // Clear cache on create
        setIsCreateModalOpen(false);
        await fetchTransactions(true); // Force refresh
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const editTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/transactions/${updatedTransaction._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTransaction),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCache(new Map()); // Clear cache on edit
        setIsEditModalOpen(false);
        await fetchTransactions(true); // Force refresh
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const deleteTransaction = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/transactions/${selectedTransaction?._id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setCache(new Map()); // Clear cache on delete
        setIsDeleteModalOpen(false);
        await fetchTransactions(true); // Force refresh
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

  // Functions to open modals
  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  // Scroll to top function
  const scrollToTop = () => {
    mainRef.current?.scrollIntoView({ behavior: "smooth" });
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

        <TransactionsList
          transactions={transactions}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />

        {transactions.length > 0 && (
          <TransactionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            scrollToTop={scrollToTop}
          />
        )}
      </div>

      {/* Modal Components */}
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

      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        selectedTransaction={selectedTransaction}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteTransaction={deleteTransaction}
      />
    </main>
  );
};

export default Transactions;
