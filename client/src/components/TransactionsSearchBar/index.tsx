import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import iconFilterMobile from "../../assets/images/icon-filter-mobile.svg";
import iconSearch from "../../assets/images/icon-search.svg";
import iconSortMobile from "../../assets/images/icon-sort-mobile.svg";
import CustomSearchSelect from "../CustomSearchSelect";

interface TransactionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
}

const TransactionSearchBar = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
}: TransactionSearchBarProps) => {
  // State to manage dropdown select visibility
  const [openSelect, setOpenSelect] = useState<"category" | "sort" | null>(
    null,
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [placeholderText, setPlaceholderText] = useState("Search transaction");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce function to update search query
  const handleSearchChange = debounce((query: string) => {
    setDebouncedSearchQuery(query);
  }, 300); // Adjust the delay as needed

  // Effect to update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current) {
        const inputWidth = inputRef.current.offsetWidth;

        if (inputWidth < 150) {
          setPlaceholderText("Search");
        } else if (inputWidth < 200) {
          setPlaceholderText("Search tran...");
        } else {
          setPlaceholderText("Search transaction");
        }
      }
    };

    // Initial check
    handleResize();
    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerSearch = () => {
    if (inputRef.current) {
      const query = inputRef.current.value;
      handleSearchChange(query);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-[71%] md:w-1/4">
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 transform"
          onClick={triggerSearch}
        >
          <img src={iconSearch} alt="Search" />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          defaultValue={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-solid border-beige-500 py-3 pl-5 pr-10 text-[0.875rem] leading-normal text-grey-900 outline-none placeholder:text-beige-500"
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center gap-6 md:w-[70%] md:flex-row-reverse md:justify-start">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm leading-normal text-grey-500 md:block">
            Category
          </span>
          <CustomSearchSelect
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
            isOpen={openSelect === "category"}
            setIsOpen={() =>
              setOpenSelect(openSelect === "category" ? null : "category")
            }
            placeholder="Select category"
            placeholderImage={iconFilterMobile}
            buttonClass="md:w-44"
            dropDownClass="md:w-44"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm leading-normal text-grey-500 md:block">
            Sort by
          </span>
          <CustomSearchSelect
            options={["Latest", "Oldest", "A-Z", "Z-A", "Highest", "Lowest"]}
            value={sortOption}
            onChange={setSortOption}
            isOpen={openSelect === "sort"}
            setIsOpen={() =>
              setOpenSelect(openSelect === "sort" ? null : "sort")
            }
            placeholder="Sort by"
            placeholderImage={iconSortMobile}
            buttonClass="md:w-28"
            dropDownClass="md:w-28"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionSearchBar;
