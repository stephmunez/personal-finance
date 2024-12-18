import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";
import iconPot from "../../assets/images/icon-pot.svg";
import { Pot } from "../../types";

interface OverviewPotsProps {
  pots: Pot[] | null;
}

const OverviewPots = ({ pots }: OverviewPotsProps) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [topPots, setTopPots] = useState<Pot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateTotalSaved = (pots: Pot[]) => {
      const total = pots.reduce((sum, pot) => sum + pot.total, 0);
      setTotalSaved(total);
    };

    const getTopPots = (pots: Pot[]) => {
      const sortedPots = [...pots].sort((a, b) => b.total - a.total);
      const topFourPots = sortedPots.slice(0, 4);
      setTopPots(topFourPots);
    };

    if (pots) {
      calculateTotalSaved(pots);
      getTopPots(pots);
    }

    if (pots) {
      setLoading(false);
    }
  }, [pots]);

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white px-5 py-6 md:p-8">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-[1.2] text-grey-900">Pots</h2>
        <Link
          to={"/pots"}
          className="flex items-center gap-3 text-sm leading-normal text-grey-500"
        >
          See Details <img src={iconCaretRight} alt="caret right icon" />
        </Link>
      </div>
      <div className="flex w-full flex-col gap-5 md:flex-row">
        <div className="flex w-full flex-col gap-5 rounded-xl bg-beige-100 p-4 @container md:w-2/5 xl:justify-center">
          <div className="flex items-center gap-4">
            <div className="hidden h-10 w-10 min-w-10 items-center justify-center @[150px]:flex">
              <img src={iconPot} alt="pot icon" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="break-words text-sm leading-normal text-grey-500">
                Total Saved
              </h3>
              {loading ? (
                <div className="h-10 w-full animate-pulse rounded bg-grey-100"></div>
              ) : (
                <span className="break-words text-[2rem] font-bold leading-[1.2] tracking-normal text-grey-900 xl:text-xl">
                  P{totalSaved.toFixed(0)}
                </span>
              )}
            </div>
          </div>
        </div>
        <ul className="flex w-full flex-wrap gap-4 md:w-3/5">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex flex-[1_1_calc(50%-16px)] gap-4">
                <div className="bg-grey-200 h-full w-1 animate-pulse rounded-lg"></div>
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-20 animate-pulse rounded bg-grey-100"></div>
                  <div className="h-5 w-16 animate-pulse rounded bg-grey-100"></div>
                </div>
              </li>
            ))
          ) : topPots && topPots.length ? (
            topPots.map((pot) => (
              <li
                key={pot._id}
                className="flex flex-[1_1_calc(50%-16px)] items-center gap-4"
              >
                <div
                  className="h-full w-1 rounded-lg"
                  style={{ backgroundColor: pot.theme }}
                ></div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs leading-normal text-grey-500">
                    {pot.name}
                  </h4>
                  <span className="text-sm font-bold leading-normal text-grey-900">
                    P{pot.total.toFixed(0)}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="w-full text-center text-sm leading-normal text-grey-500">
              No pots available.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default OverviewPots;
