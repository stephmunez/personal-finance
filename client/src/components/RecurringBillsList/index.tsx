import { RecurringBill } from "../../types";
import RecurringBillItem from "../RecurringBillItem";

interface RecurringBillsListProps {
  recurringBills: RecurringBill[] | null;
  searchQuery: string;
  sortOption: string;
  onEdit: (bill: RecurringBill) => void;
  onDelete: (bill: RecurringBill) => void;
}

const RecurringBillsList = ({
  recurringBills = [],
  searchQuery,
  sortOption,
  onEdit,
  onDelete,
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
        filteredBills.sort(
          (a, b) => new Date(a.dueDate).getDay() - new Date(b.dueDate).getDay(),
        );
        break;
      case "Oldest":
        filteredBills.sort(
          (a, b) => new Date(b.dueDate).getDay() - new Date(a.dueDate).getDay(),
        );
        break;
      default:
        filteredBills.sort(
          (a, b) => new Date(b.dueDate).getDay() - new Date(a.dueDate).getDay(),
        );
        break;
    }

    return filteredBills;
  };

  return (
    <ul>
      {recurringBills && recurringBills.length > 0 ? (
        filterAndSortBills(recurringBills).length > 0 ? (
          filterAndSortBills(recurringBills).map((bill, i) => (
            <RecurringBillItem
              key={bill._id}
              bill={bill}
              className={`${i !== recurringBills.length - 1 ? "border-b border-grey-100" : ""}`}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <li className="text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
            No matching bills found.
          </li>
        )
      ) : (
        <li className="text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
          No recurring bills yet.
        </li>
      )}
    </ul>
  );
};

export default RecurringBillsList;
