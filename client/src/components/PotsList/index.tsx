import iconEllipsis from "../../assets/images/icon-ellipsis.svg";
import { Pot } from "../../types";

interface PotsListProps {
  pots: Pot[] | null;
}

const PotsList = ({ pots }: PotsListProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      {pots && pots.length > 0 ? (
        pots.map((pot) => (
          <div
            key={pot._id}
            className="flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: pot.theme }}
                ></div>
                <h2 className="text-xl font-bold leading-[1.2] tracking-normal text-grey-900">
                  {pot.name}
                </h2>
              </div>
              <button className="flex h-4 w-4 items-center justify-center">
                <img src={iconEllipsis} alt="ellipsis icon" />
              </button>
            </div>
            <div className="flex w-full flex-col gap-4 py-3">
              <div className="flex w-full items-center justify-between">
                <span className="text-[0.875rem] leading-normal tracking-normal text-grey-500">
                  Total Saved
                </span>
                <span className="text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900">
                  {`${pot.total < 0 ? "P0.00" : "P" + pot.total.toFixed(2)}`}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-2 w-full rounded-[4px] bg-beige-100">
                  <div
                    className="h-2 rounded-[4px]"
                    style={{
                      backgroundColor: pot.theme,
                      width: `${(pot.total / pot.target) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold leading-normal tracking-normal text-grey-500">
                    {((pot.total / pot.target) * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs leading-normal tracking-normal text-grey-500">
                    Target of P{pot.target}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <button className="flex h-14 flex-1 items-center justify-center rounded-lg bg-beige-100 text-sm font-bold leading-normal tracking-normal text-grey-900">
                + Add Money
              </button>
              <button className="flex h-14 flex-1 items-center justify-center rounded-lg bg-beige-100 text-sm font-bold leading-normal tracking-normal text-grey-900">
                Withdraw
              </button>
            </div>
          </div>
        ))
      ) : (
        <li className="text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
          No pots yet.
        </li>
      )}
    </div>
  );
};

export default PotsList;
