import { useEffect, useState } from "react";
import DeleteRecurringBillModal from "../../components/DeleteRecurringBillModal";
import EditRecurringBillModal from "../../components/EditRecurringBillModal";
import RecurringBillsList from "../../components/RecurringBillsList";
import RecurringBillsSearchBar from "../../components/RecurringBillsSearchBar";
import RecurringBillsSummary from "../../components/RecurringBillsSummary";
import { RecurringBill } from "../../types";

const RecurringBills = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Latest");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRecurringBill, setSelectedRecurringBill] =
    useState<RecurringBill | null>(null);

  const fetchRecurringBills = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/recurring-bills",
    );
    const data = await response.json();

    if (response.ok) {
      setRecurringBills(data.recurringBills);
    }
  };

  useEffect(() => {
    fetchRecurringBills();
  }, []);

  const editRecurringBill = async (updatedRecurringBill: RecurringBill) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/recurring-bills/${updatedRecurringBill._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/recurring-bills/${selectedRecurringBill?._id}`,
        {
          method: "DELETE",
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
    <main className="relative flex w-full flex-col gap-8 px-4 pb-20 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="leading[1.2] text-[2rem] font-bold tracking-normal text-grey-900">
          Recurring <br className="min-[480px]:hidden" /> Bills
        </h1>
        <button
          type="button"
          className="h-14 rounded-lg bg-black p-4 text-[0.875rem] font-bold leading-normal tracking-normal text-white"
        >
          + Add New
        </button>
      </div>
      <div className="flex w-full flex-col gap-6">
        <RecurringBillsSummary recurringBills={recurringBills} />

        {recurringBills && recurringBills.length > 1 && (
          <div className="flex min-h-80 flex-col gap-6 rounded-xl bg-white px-5 py-6">
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
        )}
      </div>

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
