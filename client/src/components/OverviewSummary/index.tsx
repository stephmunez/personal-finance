interface OverviewSummaryProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

const OverviewSummary = ({
  balance,
  totalIncome,
  totalExpenses,
}: OverviewSummaryProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl bg-grey-900 p-5">
        <span className="text-sm leading-normal text-white">
          Current Balance
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-white">
          P{balance.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-white p-5">
        <span className="text-sm leading-normal text-grey-500">
          Total Income
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
          P{totalIncome.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-white p-5">
        <span className="text-sm leading-normal text-grey-500">
          Current Balance
        </span>
        <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
          P{totalExpenses.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OverviewSummary;
