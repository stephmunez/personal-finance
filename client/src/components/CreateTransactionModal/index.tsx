import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Moment } from "moment";
import { FormEvent, useEffect, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import CustomFormSelect from "../CustomFormSelect";

import { Transaction } from "../../types";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: Transaction) => void;
}

const transactionPlaceholders = [
  "Groceries from the supermarket",
  "Monthly rent payment",
  "Dinner at a restaurant",
  "Taxi ride",
  "Subscription service",
  "Gym membership",
  "Online shopping",
  "Electricity bill",
  "Movie tickets",
  "New shoes",
];

const CreateTransactionModal = ({
  isOpen,
  onClose,
  onCreateTransaction,
}: CreateTransactionModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState<Moment | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("Expense");

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const randomPlaceholder =
        transactionPlaceholders[
          Math.floor(Math.random() * transactionPlaceholders.length)
        ];

      setPlaceholder(randomPlaceholder);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (name && category && date && amount) {
      const formattedDate = date?.toISOString();
      const formattedAmount =
        transactionType === "Expense"
          ? -Math.abs(Number(amount))
          : Number(amount);
      onCreateTransaction({
        name,
        category,
        date: formattedDate!,
        amount: formattedAmount,
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
        <div className="flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Add New Transaction
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center"
              >
                <img
                  className="h-full w-full"
                  src={iconCloseModal}
                  alt="close modal icon"
                />
              </button>
            </div>
            <p className="text-sm leading-normal text-grey-500">
              Choose a category, set the transaction date, and enter the amount
              to keep your finances organized and easily track your spending.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Transaction Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-beige-500 px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none"
                  placeholder={`e.g. ${placeholder}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Category
                </label>
                <CustomFormSelect
                  options={categories}
                  value={category}
                  onChange={setCategory}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Type of Transaction
                </label>
                <CustomFormSelect
                  options={["Income", "Expense"]}
                  value={transactionType}
                  onChange={setTransactionType}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Date
                </label>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          sx: {
                            padding: "0px",
                            borderRadius: "8px",
                          },
                        },
                        inputProps: {
                          sx: {
                            padding: "12px 20px",
                            fontFamily: "Public Sans",
                            fontSize: "14px",
                            borderRadius: "8px",
                          },
                        },
                      },
                      openPickerButton: {
                        color: "primary",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 100"
                  className="w-full rounded-lg border border-beige-500 px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
