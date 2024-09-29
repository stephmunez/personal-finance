import usePagination from "@mui/material/usePagination";
import { useEffect, useState } from "react";
import iconFilterMobile from "../../assets/images/icon-filter-mobile.svg";
import iconSearch from "../../assets/images/icon-search.svg";
import iconSortMobile from "../../assets/images/icon-sort-mobile.svg";
import CustomSelect from "../../components/CustomSelect";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
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

  const handleToggle = (selectName: string) => {
    setOpenSelect((prev) => (prev === selectName ? null : selectName));
  };

  return (
    <main className="flex flex-col gap-8 px-4 pb-20 pt-6">
      <h1 className="my-2 text-[2rem] font-bold leading-[1.20] tracking-normal">
        Transactions
      </h1>
      <div className="flex flex-col gap-6 rounded-xl bg-white px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="relative w-[71%]">
            <img
              src={iconSearch}
              alt="Search"
              className="absolute right-5 top-1/2 -translate-y-1/2 transform"
            />
            <input
              type="text"
              placeholder="Search transaction"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-solid border-beige-500 px-5 py-3 text-[0.875rem] leading-normal text-grey-900 outline-none placeholder:text-beige-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <CustomSelect
              options={[
                "All",
                "Entertainment",
                "Bills",
                "Groceries",
                "Dining Out",
                "Transportation",
                "Personal Care",
                "Education",
                "Lifestyle",
                "Shopping",
                "General",
              ]}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Select category"
              placeholderImage={iconFilterMobile}
              isOpen={openSelect === "category"}
              setIsOpen={() => handleToggle("category")}
            />

            <CustomSelect
              options={["Latest", "Oldest", "A-Z", "Z-A", "Highest", "Lowest"]}
              value={sortOption}
              onChange={setSortOption}
              placeholder="Sort by"
              placeholderImage={iconSortMobile}
              isOpen={openSelect === "sort"}
              setIsOpen={() => handleToggle("sort")}
            />
          </div>
        </div>

        <ul>
          {transactions.map((transaction) => (
            <li key={transaction._id}>
              {/* <img src={transaction.avatar} alt={transaction.name} /> */}
              <p>{transaction.name}</p>
              <p>{transaction.category}</p>
              <p>{new Date(transaction.date).toLocaleDateString()}</p>
              <p>{transaction.amount}</p>
              <p>{transaction.recurring ? "Recurring" : "One-time"}</p>
            </li>
          ))}
        </ul>

        <nav>
          <ul className="flex items-center justify-between">
            <li>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            <div className="flex flex-1 justify-center">
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
                }

                return <li key={index}>{children}</li>;
              })}
            </div>

            <li>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
};

export default Transactions;
