import { RecurringBill } from "../../types";
import RecurringBillItem from "../RecurringBillItem";

interface RecurringBillsListProps {
  recurringBills: RecurringBill[] | null;
  searchQuery: string;
  sortOption: string;
}

const RecurringBillsList = ({
  recurringBills = [],
  searchQuery,
  sortOption,
}: RecurringBillsListProps) => {
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

  return (
    <ul>
      {recurringBills &&
        filterAndSortBills(recurringBills).map((bill) => (
          <RecurringBillItem key={bill._id} bill={bill} />
        ))}
    </ul>
  );
};

export default RecurringBillsList;