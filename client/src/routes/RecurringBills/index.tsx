import { useEffect, useState } from "react";
import CreateRecurringBillModal from "../../components/CreateRecurringBillModal";
import DeleteRecurringBillModal from "../../components/DeleteRecurringBillModal";
import EditRecurringBillModal from "../../components/EditRecurringBillModal";
import RecurringBillsList from "../../components/RecurringBillsList";
import RecurringBillsSearchBar from "../../components/RecurringBillsSearchBar";
import RecurringBillsSummary from "../../components/RecurringBillsSummary";
import { useAuthContext } from "../../hooks/useAuthContext";
import { RecurringBill } from "../../types";

const RecurringBills = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRecurringBill, setSelectedRecurringBill] =
    useState<RecurringBill | null>(null);
  const { user } = useAuthContext();

  const fetchRecurringBills = async () => {
    if (!user) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/recurring-bills`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      },
    );
    const data = await response.json();

    if (response.ok) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const filteredBills = data.recurringBills.filter(
        (bill: RecurringBill) => {
          const billDate = new Date(bill.dueDate);
          return (
            billDate.getMonth() === currentMonth &&
            billDate.getFullYear() === currentYear
          );
        },
      );

      setRecurringBills(filteredBills);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecurringBills();
    }
  }, [user]);

  const createRecurringBill = async (newRecurringBill: RecurringBill) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recurring-bills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newRecurringBill),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsCreateModalOpen(false);
        await fetchRecurringBills();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const editRecurringBill = async (updatedRecurringBill: RecurringBill) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recurring-bills/${updatedRecurringBill._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedRecurringBill),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsEditModalOpen(false);
        await fetchRecurringBills();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      );
    }
  };

  const deleteRecurringBill = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recurring-bills/${selectedRecurringBill?._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.ok) {
        setIsDeleteModalOpen(false);
        await fetchRecurringBills();
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

  const openDeleteModal = (bill: RecurringBill) => {
    setSelectedRecurringBill(bill);
    setIsDeleteModalOpen(true);
  };
  const openEditModal = (bill: RecurringBill) => {
    setSelectedRecurringBill(bill);
    setIsEditModalOpen(true);
  };

  return (
    <main className="relative flex w-full flex-col gap-8 px-4 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8 xl:py-8">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Recurring <br className="min-[480px]:hidden" /> Bills
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add New
        </button>
      </div>
      <div className="flex w-full flex-col gap-6 xl:flex-row">
        <RecurringBillsSummary recurringBills={recurringBills} />
        {recurringBills && recurringBills.length ? (
          <>
            <div className="flex min-h-80 flex-col gap-6 rounded-xl bg-white px-5 py-6 md:p-8 xl:w-[66%]">
              <RecurringBillsSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
              <RecurringBillsList
                recurringBills={recurringBills}
                searchQuery={searchQuery}
                sortOption={sortOption}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </div>
          </>
        ) : (
          <p className="w-full text-center text-sm leading-normal text-grey-500">
            There are currently no recurring bills.
          </p>
        )}
      </div>

      <CreateRecurringBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRecurringBill={createRecurringBill}
      />
      <EditRecurringBillModal
        isOpen={isEditModalOpen}
        selectedRecurringBill={selectedRecurringBill}
        onClose={() => setIsEditModalOpen(false)}
        onEditRecurringBill={editRecurringBill}
      />
      <DeleteRecurringBillModal
        isOpen={isDeleteModalOpen}
        selectedRecurringBill={selectedRecurringBill}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteRecurringBill={deleteRecurringBill}
      />
    </main>
  );
};

export default RecurringBills;
