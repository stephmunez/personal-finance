import { useState } from "react";
import iconSearch from "../../assets/images/icon-search.svg";
import iconSortMobile from "../../assets/images/icon-sort-mobile.svg";
import CustomSelect from "../CustomSearchSelect";

interface RecurringBillsSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
}

const RecurringBillsSearchBar = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
}: RecurringBillsSearchBarProps) => {
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const toggleSortOpen = () => setIsSortOpen((prev) => !prev);

  return (
    <div className="flex items-center justify-between">
      <div className="relative w-[85%] md:w-1/2">
        <img
          src={iconSearch}
          alt="Search"
          className="absolute right-5 top-1/2 -translate-y-1/2 transform"
        />
        <input
          type="text"
          placeholder="Search recurring bill"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-solid border-beige-500 px-5 py-3 text-[0.875rem] leading-normal text-grey-900 outline-none placeholder:text-beige-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm leading-normal text-grey-500 md:block">
          Sort by
        </span>
        <CustomSelect
          options={["Latest", "Oldest", "A-Z", "Z-A", "Highest", "Lowest"]}
          value={sortOption}
          onChange={setSortOption}
          isOpen={isSortOpen}
          setIsOpen={toggleSortOpen}
          placeholder="Sort by"
          placeholderImage={iconSortMobile}
          buttonClass="md:w-28"
        />
      </div>
    </div>
  );
};

export default RecurringBillsSearchBar;
