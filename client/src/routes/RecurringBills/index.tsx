import { useEffect, useState } from "react";
import iconRecurringBills from "../../assets/images/icon-recurring-bills.svg";
import RecurringBillsSearchBar from "../../components/RecurringBillsSearchBar";

interface RecurringBill {
  _id?: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  dueDate: number; // Represents the day of the month or week
  frequency: string;
  status: string;
}

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

  // Helper functions to calculate totals and filter/search bills
  const filterAndSortBills = (bills: RecurringBill[]) => {
    let filteredBills = bills;

    // Filter based on search query
    if (searchQuery) {
      filteredBills = filteredBills.filter((bill) =>
        bill.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort based on the selected sort option
    switch (sortOption) {
      case "A-Z":
        filteredBills.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        filteredBills.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Highest":
        filteredBills.sort((a, b) => b.amount - a.amount);
        break;
      case "Lowest":
        filteredBills.sort((a, b) => a.amount - b.amount);
        break;
      case "Oldest":
        filteredBills.sort((a, b) => a.dueDate - b.dueDate);
        break;
      case "Latest":
      default:
        filteredBills.sort((a, b) => b.dueDate - a.dueDate);
        break;
    }

    return filteredBills;
  };

  const totalAmount = recurringBills
    ? recurringBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)
    : "0.00";

  const totalPaid = recurringBills
    ? recurringBills
        .filter((bill) => bill.status === "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const totalUpcoming = recurringBills
    ? recurringBills
        .filter((bill) => bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const today = new Date();
  const todayDay = today.getDate();
  const currentDayOfWeek = today.getDay();
  const fiveDaysFromNow = new Date(today);
  fiveDaysFromNow.setDate(today.getDate() + 5);
  const upcomingDay = fiveDaysFromNow.getDate();

  const isDueSoon = (bill: RecurringBill) => {
    if (bill.frequency === "monthly") {
      return bill.dueDate > todayDay && bill.dueDate <= upcomingDay;
    } else if (bill.frequency === "weekly") {
      return (
        bill.dueDate > currentDayOfWeek &&
        bill.dueDate <= (currentDayOfWeek + 5) % 7
      );
    } else if (bill.frequency === "biweekly") {
      return (
        bill.dueDate > currentDayOfWeek &&
        bill.dueDate <= (currentDayOfWeek + 5) % 14
      );
    }
    return false;
  };

  const totalDueSoon = recurringBills
    ? recurringBills
        .filter((bill) => isDueSoon(bill) && bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

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
        <div className="flex w-full items-center gap-5 rounded-xl bg-grey-900 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src={iconRecurringBills} alt="recurring bills icon" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm leading-normal tracking-normal text-white">
              Total bills
            </h2>
            <span className="text-[2rem] font-bold leading-[1.2] tracking-normal text-white">
              P{totalAmount}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-5 rounded-xl bg-white p-5">
          <h2 className="text-base font-bold text-grey-900">Summary</h2>
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between border-b border-solid border-grey-500/15 pb-4">
              <span className="text-xs leading-normal tracking-normal text-grey-500">
                Paid
              </span>
              <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                {recurringBills &&
                  recurringBills.filter((bill) => bill.status === "paid")
                    .length}
                (P{totalPaid})
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-solid border-grey-500/15 pb-4">
              <span className="text-xs leading-normal tracking-normal text-grey-500">
                Total Upcoming
              </span>
              <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                {
                  recurringBills?.filter((bill) => bill.status !== "paid")
                    .length
                }{" "}
                (P{totalUpcoming})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs leading-normal tracking-normal text-red">
                Due Soon
              </span>
              <span className="text-xs font-bold leading-normal tracking-normal text-red">
                {
                  recurringBills?.filter(
                    (bill) => isDueSoon(bill) && bill.status !== "paid",
                  ).length
                }{" "}
                (P{totalDueSoon})
              </span>
            </div>
          </div>
        </div>
        <div className="flex min-h-80 flex-col gap-6 rounded-xl bg-white px-5 py-6">
          <RecurringBillsSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          <ul>
            {recurringBills &&
              filterAndSortBills(recurringBills).map((recurring) => (
                <li key={recurring._id} className="flex items-center gap-4 p-4">
                  <img
                    src={recurring.avatar}
                    alt={recurring.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-grey-900">{recurring.name}</p>
                    <p className="text-sm text-grey-500">P{recurring.amount}</p>
                  </div>
                  <div>
                    <p
                      className={`${
                        recurring.status === "paid"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {recurring.status}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default RecurringBills;
