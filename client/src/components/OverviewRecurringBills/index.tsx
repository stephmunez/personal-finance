import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import { RecurringBill } from "../../types";
import { isDueSoon } from "../../utils";

interface OverviewRecurringBillsProps {
  recurringBills: RecurringBill[] | null;
}

const OverviewRecurringBills = ({
  recurringBills,
}: OverviewRecurringBillsProps) => {
  const bills = recurringBills || [];

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
    <section className="flex flex-col gap-8 rounded-xl bg-white px-5 py-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
          Recurring Bills
        </h2>
        <Link
          to={"/recurring-bills"}
          className="flex items-center gap-3 text-sm leading-normal text-grey-500"
        >
          See Details <img src={iconCaretRight} alt="caret right icon" />
        </Link>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between rounded-lg border-l-4 border-solid border-green bg-beige-100 px-4 py-5">
          <span className="text-sm leading-normal tracking-normal text-grey-500">
            Paid Bills
          </span>
          <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
            P{totalPaid}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border-l-4 border-solid border-yellow bg-beige-100 px-4 py-5">
          <span className="text-sm leading-normal tracking-normal text-grey-500">
            Total Unpaid
          </span>
          <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
            P{totalUnpaid}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border-l-4 border-solid border-cyan bg-beige-100 px-4 py-5">
          <span className="text-sm leading-normal tracking-normal text-grey-500">
            Due Soon
          </span>
          <span className="text-sm font-bold leading-normal tracking-normal text-grey-900">
            P{totalDueSoon}
          </span>
        </div>
      </div>
    </section>
  );
};

export default OverviewRecurringBills;
