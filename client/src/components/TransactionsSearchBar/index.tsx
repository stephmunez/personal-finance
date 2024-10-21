import { debounce } from "lodash";
import { useEffect, useState } from "react";
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

  // Debounce function to update search query
  const handleSearchChange = debounce((query: string) => {
    setDebouncedSearchQuery(query);
  }, 300); // Adjust the delay as needed

  // Effect to update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  return (
    <div className="flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-[71%]">
        <img
          src={iconSearch}
          alt="Search"
          className="absolute right-5 top-1/2 -translate-y-1/2 transform"
        />
        <input
          type="text"
          placeholder="Search transaction"
          defaultValue={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-solid border-beige-500 px-5 py-3 text-[0.875rem] leading-normal text-grey-900 outline-none placeholder:text-beige-500"
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center gap-6">
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
        />
        <CustomSearchSelect
          options={["Latest", "Oldest", "A-Z", "Z-A", "Highest", "Lowest"]}
          value={sortOption}
          onChange={setSortOption}
          isOpen={openSelect === "sort"}
          setIsOpen={() => setOpenSelect(openSelect === "sort" ? null : "sort")}
          placeholder="Sort by"
          placeholderImage={iconSortMobile}
        />
      </div>
    </div>
  );
};

export default TransactionSearchBar;
