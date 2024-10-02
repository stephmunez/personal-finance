import { useState } from "react";
import iconFilterMobile from "../../assets/images/icon-filter-mobile.svg";
import iconSearch from "../../assets/images/icon-search.svg";
import iconSortMobile from "../../assets/images/icon-sort-mobile.svg";
import CustomSelect from "../../components/CustomSelect";

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
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const toggleCategoryOpen = () => setIsCategoryOpen((prev) => !prev);
  const toggleSortOpen = () => setIsSortOpen((prev) => !prev);

  return (
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
          isOpen={isCategoryOpen}
          setIsOpen={toggleCategoryOpen}
          placeholder="Select category"
          placeholderImage={iconFilterMobile}
        />
        <CustomSelect
          options={["Latest", "Oldest", "A-Z", "Z-A", "Highest", "Lowest"]}
          value={sortOption}
          onChange={setSortOption}
          isOpen={isSortOpen}
          setIsOpen={toggleSortOpen}
          placeholder="Sort by"
          placeholderImage={iconSortMobile}
        />
      </div>
    </div>
  );
};

export default TransactionSearchBar;
