import iconBillDue from "../../assets/images/icon-bill-due.svg";
import iconBillPaid from "../../assets/images/icon-bill-paid.svg";
import { RecurringBill } from "../../types";
import {
  getDayWithSuffix,
  getIconByCategory,
  getThemeByCategory,
  isDueSoon,
  isOverdue,
} from "../../utils";

interface RecurringBillItemProps {
  bill: RecurringBill;
}

const RecurringBillItem = ({ bill }: RecurringBillItemProps) => {
  return (
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
  );
};

export default RecurringBillItem;
