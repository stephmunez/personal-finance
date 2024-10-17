import { useEffect, useState } from "react";
import PotsList from "../../components/PotsList";
import { Pot } from "../../types";

const Pots = () => {
  const [pots, setPots] = useState<Pot[] | null>(null);

  useEffect(() => {
    const fetchPots = async () => {
      const response = await fetch("http://localhost:4000/api/v1/pots");
      const data = await response.json();

      if (response.ok) {
        setPots(data.pots);
      }
    };

    fetchPots();
  }, []);

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Pots
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
        >
          + Add New
        </button>
      </div>
      <PotsList pots={pots} />
    </main>
  );
};

export default Pots;
