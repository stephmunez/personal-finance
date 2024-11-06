import { useEffect, useRef, useState } from "react";
import iconBillDue from "../../assets/images/icon-bill-due.svg";
import iconBillPaid from "../../assets/images/icon-bill-paid.svg";
import iconEllipsis from "../../assets/images/icon-ellipsis.svg";
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
  className?: string;
  onEdit: (bill: RecurringBill) => void;
  onDelete: (bill: RecurringBill) => void;
}

const RecurringBillItem = ({
  bill,
  className,
  onDelete,
  onEdit,
}: RecurringBillItemProps) => {
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleBillClick = (billId: string) => {
    setSelectedBill((prev) => (prev === billId ? null : billId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedBill(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li
      key={bill._id}
      className={`relative flex flex-col gap-2 p-4 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
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
        <button onClick={() => handleBillClick(bill._id || "")}>
          <img src={iconEllipsis} alt="ellipsis icon" />
        </button>
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

      <div
        className={`absolute right-0 top-1/2 z-10 flex cursor-auto flex-col gap-3 rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)] transition-opacity duration-300 ${
          selectedBill === bill._id
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
        ref={menuRef}
      >
        <button
          className="text-left text-sm leading-normal text-grey-900"
          onClick={() => onEdit(bill)}
        >
          Edit Recurring Bill
        </button>
        <div className="pointer-events-none h-px w-full bg-grey-100"></div>
        <button
          className="text-left text-sm leading-normal text-red"
          onClick={() => onDelete(bill)}
        >
          Delete Recurring Bill
        </button>
      </div>
    </li>
  );
};

export default RecurringBillItem;
