import { useEffect, useRef, useState } from "react";
import iconBillPaid from "../../assets/images/icon-bill-paid.svg";
import iconEllipsis from "../../assets/images/icon-ellipsis.svg";
import { Pot } from "../../types";

interface PotsListProps {
  pots: Pot[] | null;
  onEdit: (pot: Pot) => void;
  onDelete: (pot: Pot) => void;
  onAdd: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
}

const PotsList = ({
  pots,
  onEdit,
  onDelete,
  onAdd,
  onWithdraw,
}: PotsListProps) => {
  const [selectedPot, setSelectedPot] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  const handlePotClick = (potId: string) => {
    if (selectedPot === potId) {
      setSelectedPot(null);
    } else {
      setSelectedPot(potId);
    }
  };

  useEffect(() => {
    if (pots) {
      setLoading(false);
    }
  }, [pots]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedPot(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 xl:flex-row xl:flex-wrap">
      {loading ? (
        // Render the skeletons while loading
        Array.from({ length: 2 }).map((_, i) => (
          <div
            className="relative flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6 xl:w-[48%]"
            key={i}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 w-4 animate-pulse rounded-full bg-grey-100"></div>
                <h2 className="h-6 w-32 animate-pulse rounded bg-grey-100"></h2>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 py-3">
              <div className="flex w-full items-center justify-between">
                <span className="h-4 w-24 animate-pulse rounded bg-grey-100"></span>
                <span className="h-8 w-32 animate-pulse rounded bg-grey-100"></span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-2 w-full rounded-[4px] bg-beige-100">
                  <div className="h-2 rounded-[4px] bg-grey-100"></div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="h-4 w-12 animate-pulse rounded bg-grey-100"></span>
                  <span className="h-4 w-24 animate-pulse rounded bg-grey-100"></span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <button className="flex h-14 flex-1 animate-pulse items-center justify-center rounded-lg bg-grey-100">
                <span className="h-4 w-24 animate-pulse rounded bg-grey-100"></span>
              </button>
              <button className="flex h-14 flex-1 animate-pulse items-center justify-center rounded-lg bg-grey-100">
                <span className="h-4 w-24 animate-pulse rounded bg-grey-100"></span>
              </button>
            </div>
          </div>
        ))
      ) : pots && pots.length > 0 ? (
        pots.map((pot) => (
          <div
            key={pot._id}
            className="relative flex w-full flex-col gap-8 rounded-xl bg-white px-5 py-6 md:p-6 xl:w-[48%]"
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
              <button
                className="flex h-4 w-4 items-center justify-center"
                onClick={() => handlePotClick(pot._id || "")}
              >
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
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-full rounded-[4px] bg-beige-100">
                    <div
                      className="h-2 rounded-[4px]"
                      style={{
                        backgroundColor: pot.theme,
                        width: `${Math.min((pot.total / pot.target) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  {pot.total >= pot.target && (
                    <span className="flex items-center gap-2 text-xs leading-normal text-green">
                      <img src={iconBillPaid} alt="bill paid icon" />
                      You have reached your pot goal!
                    </span>
                  )}
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold leading-normal tracking-normal text-grey-500">
                    {`${Math.min((pot.total / pot.target) * 100, 100).toFixed(1)}%`}
                  </span>
                  <span className="text-xs leading-normal tracking-normal text-grey-500">
                    Target of P{pot.target}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <button
                className="flex h-14 flex-1 items-center justify-center rounded-lg bg-beige-100 text-sm font-bold leading-normal tracking-normal text-grey-900"
                onClick={() => onAdd(pot)}
              >
                + Add Money
              </button>
              <button
                className="flex h-14 flex-1 items-center justify-center rounded-lg bg-beige-100 text-sm font-bold leading-normal tracking-normal text-grey-900"
                onClick={() => onWithdraw(pot)}
              >
                Withdraw
              </button>
            </div>

            <div
              ref={dropdownRef}
              aria-hidden={!selectedPot}
              className={`absolute right-5 top-12 z-10 flex cursor-auto flex-col gap-3 rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)] transition-opacity duration-300 ${
                selectedPot === pot._id ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                className="text-left text-sm leading-normal text-grey-900"
                onClick={() => onEdit(pot)}
              >
                Edit Pot
              </button>
              <div className="pointer-events-none h-px w-full bg-grey-100"></div>
              <button
                className="text-left text-sm leading-normal text-red"
                onClick={() => onDelete(pot)}
              >
                Delete Pot
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="w-full text-center text-[0.875rem] leading-normal tracking-normal text-grey-500">
          No pots available.
        </p>
      )}
    </div>
  );
};

export default PotsList;
