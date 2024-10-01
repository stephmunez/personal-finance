import { useEffect, useState } from "react";

interface Pot {
  _id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

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
    <main>
      {pots &&
        pots.map((pot) => (
          <div key={pot._id}>
            <p>{pot.name}</p>
          </div>
        ))}
    </main>
  );
};

export default Pots;
