import { debounce } from "lodash";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TransactionsList from "../../components/TransactionsList";
import TransactionsPagination from "../../components/TransactionsPagination";
import TransactionSearchBar from "../../components/TransactionsSearchBar";
import { Transaction } from "../../types/Transaction";

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedParams = queryString.parse(location.search);

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
  const mainRef = useRef<HTMLDivElement>(null);

  const [cache, setCache] = useState<
    Map<string, { transactions: Transaction[]; totalPages: number }>
  >(new Map());

  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 300),
    [],
  );

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
      if (cache.has(cacheKey)) {
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
          // Cache the response
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

  // Update the URL whenever state changes
  useEffect(() => {
    const params = {
      page: currentPage !== 1 ? currentPage.toString() : undefined,
      search: searchQuery ? searchQuery : undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      sort: sortOption !== "Latest" ? sortOption : undefined,
    };

    const queryParams = queryString.stringify(params);
    navigate({
      pathname: location.pathname,
      search: queryParams,
    });
  }, [
    currentPage,
    searchQuery,
    categoryFilter,
    sortOption,
    navigate,
    location.pathname,
  ]);

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
          setSearchQuery={debouncedSetSearchQuery} // Use debounced setter
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
