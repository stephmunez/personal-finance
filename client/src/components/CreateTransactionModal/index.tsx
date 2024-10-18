import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Moment } from "moment";
import { FormEvent, useEffect, useState } from "react";
import CustomDropdown from "../CustomDropdown";

import { Transaction } from "../../types";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: Transaction) => void;
}

const CreateTransactionModal = ({
  isOpen,
  onClose,
  onCreateTransaction,
}: CreateTransactionModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState<Moment | null>(null);
  const [amount, setAmount] = useState(0);

  const categories = [
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
  ];

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup when the modal is closed
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (name && category && date && amount) {
      const formattedDate = date?.toISOString();
      onCreateTransaction({
        name,
        category,
        date: formattedDate!,
        amount: Number(amount),
      });
      onClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black/50">
      <div className="flex h-screen min-h-[480px] w-full flex-col items-center justify-center px-5 py-20">
        <div>
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label>Category</label>
              <CustomDropdown
                options={categories}
                value={category}
                onChange={setCategory}
              />
            </div>
            <div>
              <label>Date</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                />
              </LocalizationProvider>
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 w-full rounded-md py-2 text-white"
            >
              Add Transaction
            </button>
          </form>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
