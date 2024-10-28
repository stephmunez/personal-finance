import { useEffect, useState } from "react";
import EditPotModal from "../../components/EditPotModal";
import PotsList from "../../components/PotsList";
import { Pot } from "../../types";

const Pots = () => {
  const [pots, setPots] = useState<Pot[] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

  const fetchPots = async () => {
    const response = await fetch("http://localhost:4000/api/v1/pots");
    const data = await response.json();

    if (response.ok) {
      setPots(data.pots);
    }
  };

  useEffect(() => {
    fetchPots();
  }, []);

  const editPot = async (updatedPot: Pot) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/pots/${updatedPot._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPot),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsEditModalOpen(false);
        await fetchPots();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const openEditModal = (pot: Pot) => {
    setSelectedPot(pot);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (pot: Pot) => {
    setSelectedPot(pot);
    setIsDeleteModalOpen(true);
  };

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
      <PotsList pots={pots} onEdit={openEditModal} onDelete={openDeleteModal} />
      <EditPotModal
        isOpen={isEditModalOpen}
        selectedPot={selectedPot}
        onClose={() => setIsEditModalOpen(false)}
        onEditPot={editPot}
      />
    </main>
  );
};

export default Pots;
