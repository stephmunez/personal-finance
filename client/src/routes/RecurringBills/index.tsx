import { useEffect, useState } from "react";
import iconRecurringBills from "../../assets/images/icon-recurring-bills.svg";
import iconSearch from "../../assets/images/icon-search.svg";

interface RecurringBill {
  _id?: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  dueDate: number; // Updated to a number representing the day of the month or week
  frequency: string;
  status: string;
}

const RecurringBills = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[] | null>(
    null,
  );

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
        <div>
          <div>
            <div className="relative w-[85%]">
              <img
                src={iconSearch}
                alt="Search"
                className="absolute right-5 top-1/2 -translate-y-1/2 transform"
              />
              <input
                type="text"
                placeholder="Search bills"
                className="w-full rounded-lg border border-solid border-beige-500 px-5 py-3 text-[0.875rem] leading-normal text-grey-900 outline-none placeholder:text-beige-500"
              />
            </div>
          </div>
        </div>
      </div>
      {recurringBills &&
        recurringBills.map((recurring) => (
          <div key={recurring._id}>
            <p>{recurring.name}</p>
          </div>
        ))}
    </main>
  );
};

export default RecurringBills;
