import { useEffect, useState } from "react";
import RecurringBillsList from "../../components/RecurringBillsList";
import RecurringBillsSearchBar from "../../components/RecurringBillsSearchBar";
import RecurringBillsSummary from "../../components/RecurringBillsSummary";
import { RecurringBill } from "../../types";

const RecurringBills = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Latest");

  useEffect(() => {
    const fetchRecurringBills = async () => {
      const response = await fetch(
        "http://localhost:4000/api/v1/recurring-bills",
      );
      const data = await response.json();

      if (response.ok) {
        setRecurringBills(data.recurringBills);
      }
    };

    fetchRecurringBills();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Recurring Bills
        </h1>
        <button
          type="button"
          className="h-14 w-40 rounded-lg bg-black text-[0.875rem] font-bold leading-normal tracking-normal text-white"
        >
          + Add New Bill
        </button>
      </div>
      <div className="flex w-full flex-col gap-6">
        <RecurringBillsSummary recurringBills={recurringBills} />
        <div className="flex min-h-80 flex-col gap-6 rounded-xl bg-white px-5 py-6">
          <RecurringBillsSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          <RecurringBillsList
            recurringBills={recurringBills}
            searchQuery={searchQuery}
            sortOption={sortOption}
          />
        </div>
      </div>
    </main>
  );
};

export default RecurringBills;
