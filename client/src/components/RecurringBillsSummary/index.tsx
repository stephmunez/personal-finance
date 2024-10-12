import iconRecurringBills from "../../assets/images/icon-recurring-bills.svg";
import { RecurringBill } from "../../types";
import { isDueSoon } from "../../utils";

interface RecurringBillsSummaryProps {
  recurringBills: RecurringBill[] | null;
}

const RecurringBillsSummary = ({
  recurringBills,
}: RecurringBillsSummaryProps) => {
  const bills = recurringBills || [];

  const totalAmount = bills
    ? bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)
    : "0.00";

  const totalPaid = bills
    ? bills
        .filter((bill) => bill.status === "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const totalUnpaid = bills
    ? bills
        .filter((bill) => bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  const totalDueSoon = bills
    ? bills
        .filter((bill) => isDueSoon(bill) && bill.status !== "paid")
        .reduce((sum, bill) => sum + bill.amount, 0)
        .toFixed(2)
    : "0.00";

  return (
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
                recurringBills.filter((bill) => bill.status === "paid").length}
              (P{totalPaid})
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-solid border-grey-500/15 pb-4">
            <span className="text-xs leading-normal tracking-normal text-grey-500">
              Total Unpaid
            </span>
            <span className="text-xs font-bold leading-normal tracking-normal text-grey-900">
              {recurringBills?.filter((bill) => bill.status !== "paid").length}{" "}
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
    </div>
  );
};

export default RecurringBillsSummary;
