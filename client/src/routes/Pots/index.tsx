import { useEffect, useState } from "react";
import AddToPot from "../../components/AddToPotModal";
import CreatePotModal from "../../components/CreatePotModal";
import DeletePotModal from "../../components/DeletePotModal";
import EditPotModal from "../../components/EditPotModal";
import PotsList from "../../components/PotsList";
import WithdrawFromPot from "../../components/WithdrawFromPotModal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Pot } from "../../types";
import { getNameByColor } from "../../utils";

const Pots = () => {
  const [pots, setPots] = useState<Pot[] | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAddToPotModalOpen, setIsAddToPotModalOpen] =
    useState<boolean>(false);
  const [isWithdrawFromPotModalOpen, setIsWithdrawFromPotModalOpen] =
    useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [existingColors, setExistingColors] = useState<string[]>([]);
  const { user } = useAuthContext();

  const fetchPots = async () => {
    if (!user) return;
    const response = await fetch(`${process.env.API_URL}/pots`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await response.json();

    if (response.ok) {
      setPots(data.pots);

      const uniqueColors = Array.from(
        new Set(data.pots.map((pot: Pot) => getNameByColor(pot.theme))),
      ) as string[];
      setExistingColors(uniqueColors);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPots();
    }
  }, [user]);

  const createPot = async (newPot: Pot) => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.API_URL}/pots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newPot),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCreateModalOpen(false);
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

  const editPot = async (updatedPot: Pot) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${process.env.API_URL}/pots/${updatedPot._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
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

  const deletePot = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${process.env.API_URL}/pots/${selectedPot?._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.ok) {
        setIsDeleteModalOpen(false);
        await fetchPots();
      } else {
        const data = await response.json();
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

  const openAddToPotModal = (pot: Pot) => {
    setSelectedPot(pot);
    setIsAddToPotModalOpen(true);
  };
  const openWithdrawFromPotModal = (pot: Pot) => {
    setSelectedPot(pot);
    setIsWithdrawFromPotModalOpen(true);
  };

  return (
    <main className="flex w-full flex-col gap-8 px-4 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8 xl:py-8">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Pots
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add New
        </button>
      </div>
      <PotsList
        pots={pots}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onAdd={openAddToPotModal}
        onWithdraw={openWithdrawFromPotModal}
      />

      <CreatePotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePot={createPot}
        existingColors={existingColors}
      />
      <EditPotModal
        isOpen={isEditModalOpen}
        selectedPot={selectedPot}
        onClose={() => setIsEditModalOpen(false)}
        onEditPot={editPot}
        existingColors={existingColors}
      />
      <DeletePotModal
        isOpen={isDeleteModalOpen}
        selectedPot={selectedPot}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeletePot={deletePot}
      />
      <AddToPot
        isOpen={isAddToPotModalOpen}
        selectedPot={selectedPot}
        onClose={() => setIsAddToPotModalOpen(false)}
        onAddToPot={editPot}
      />
      <WithdrawFromPot
        isOpen={isWithdrawFromPotModalOpen}
        selectedPot={selectedPot}
        onClose={() => setIsWithdrawFromPotModalOpen(false)}
        onWithdrawFromPot={editPot}
      />
    </main>
  );
};

export default Pots;
