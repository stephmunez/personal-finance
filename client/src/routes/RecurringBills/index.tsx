import { useEffect, useState } from "react";
import iconBillDue from "../../assets/images/icon-bill-due.svg";
import iconBillPaid from "../../assets/images/icon-bill-paid.svg";
import iconBills from "../../assets/images/icon-bills.svg";
import iconDiningOut from "../../assets/images/icon-dining-out.svg";
import iconEducation from "../../assets/images/icon-education.svg";
import iconEntertainment from "../../assets/images/icon-entertainment.svg";
import iconGeneral from "../../assets/images/icon-general.svg";
import iconGroceries from "../../assets/images/icon-groceries.svg";
import iconLifestyle from "../../assets/images/icon-lifestyle.svg";
import iconPersonalCare from "../../assets/images/icon-personal-care.svg";
import iconRecurringBills from "../../assets/images/icon-recurring-bills.svg";
import iconShopping from "../../assets/images/icon-shopping.svg";
import iconTransportation from "../../assets/images/icon-transportation.svg";
import RecurringBillsSearchBar from "../../components/RecurringBillsSearchBar";

interface RecurringBill {
  _id?: string;
  avatar: string;
  name: string;
  category: string;
  amount: number;
  dueDate: number;
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
      case "Latest":
        filteredBills.sort((a, b) => a.dueDate - b.dueDate);
        break;
      case "Oldest":
        filteredBills.sort((a, b) => b.dueDate - a.dueDate);
        break;
      default:
        filteredBills.sort((a, b) => a.dueDate - b.dueDate);
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

  const totalUnpaid = recurringBills
    ? recurringBills
        .filter((bill) => bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
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

  const isOverdue = (bill: RecurringBill) => {
    let dueDate;

    if (bill.frequency === "monthly") {
      dueDate = new Date(todayYear, todayMonth, bill.dueDate);
    } else if (bill.frequency === "weekly") {
      const daysToNextDue = (7 + bill.dueDate - todayDay) % 7;
      dueDate = new Date(todayYear, todayMonth, todayDay + daysToNextDue);
    } else if (bill.frequency === "biweekly") {
      const daysToNextDue = (14 + bill.dueDate - todayDay) % 14;
      dueDate = new Date(todayYear, todayMonth, todayDay + daysToNextDue);
    } else {
      return false;
    }

    return dueDate < today;
  };

  const totalDueSoon = recurringBills
    ? recurringBills
        .filter((bill) => isDueSoon(bill) && bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const getDayWithSuffix = (dueDate: number) => {
    if (dueDate > 3 && dueDate < 21) return `${dueDate}th`;
    switch (dueDate % 10) {
      case 1:
        return `${dueDate}st`;
      case 2:
        return `${dueDate}nd`;
      case 3:
        return `${dueDate}rd`;
      default:
        return `${dueDate}th`;
    }
  };

  const getIconByCategory = (category: string) => {
    switch (category) {
      case "Entertainment":
        return iconEntertainment;
      case "Bills":
        return iconBills;
      case "Groceries":
        return iconGroceries;
      case "Dining Out":
        return iconDiningOut;
      case "Transportation":
        return iconTransportation;
      case "Personal Care":
        return iconPersonalCare;
      case "Education":
        return iconEducation;
      case "Lifestyle":
        return iconLifestyle;
      case "Shopping":
        return iconShopping;
      case "General":
        return iconGeneral;
      default:
        return "";
    }
  };

  const getThemeByCategory = (category: string) => {
    switch (category) {
      case "Entertainment":
        return "#277C78";
      case "Bills":
        return "#82C9D7";
      case "Groceries":
        return "#C94736";
      case "Dining Out":
        return "#CAB361";
      case "Transportation":
        return "#3F82B2";
      case "Personal Care":
        return "#626070";
      case "Education":
        return "#93674F";
      case "Lifestyle":
        return "#826CB0";
      case "Shopping":
        return "#BE6C49";
      case "General":
        return "#97A0AC";
      default:
        return "";
    }
  };

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
                Total Unpaid
              </span>
              <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
                {
                  recurringBills?.filter((bill) => bill.status !== "paid")
                    .length
                }{" "}
                (P{totalUnpaid})
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
              filterAndSortBills(recurringBills).map((bill) => (
                <li key={bill._id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: getThemeByCategory(bill.category),
                      }}
                    >
                      <img
                        className="h-4 w-4"
                        src={getIconByCategory(bill.category)}
                        alt={`${bill.category} icon`}
                      />
                    </div>
                    <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
                      {bill.name}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs capitalize leading-normal tracking-normal text-green">
                        {bill.frequency} - {getDayWithSuffix(bill.dueDate)}
                      </span>
                      <span>
                        {bill.status === "paid" ? (
                          <img src={iconBillPaid} alt="bill paid icon" />
                        ) : (isDueSoon(bill) && bill.status !== "paid") ||
                          (isOverdue(bill) && bill.status !== "paid") ? (
                          <img src={iconBillDue} alt="bill due icon" />
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                    <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
                      P{bill.amount.toFixed(2)}
                    </span>
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
