import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Transaction } from "../../types";
import CustomFormSelect from "../CustomFormSelect";

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
  const [date, setDate] = useState<Moment | null>(moment());
  const [amount, setAmount] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("Expense");

  // State to handle errors
  const [errors, setErrors] = useState({
    name: "",
    amount: "",
    date: "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

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

      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", amount: "", date: "" };

    if (!name.trim()) {
      newErrors.name = "Transaction name is required.";
      valid = false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount.";
      valid = false;
    }
    if (!date) {
      newErrors.date = "Date is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleClose = () => {
    setErrors({ name: "", amount: "", date: "" });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
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
      setName("");
      setCategory("General");
      setDate(moment());
      setAmount("");
      setTransactionType("Expense");
      setErrors({ name: "", amount: "", date: "" }); // Clear errors
      onClose();
    }
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black/50 transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-screen min-h-[480px] w-full flex-col items-center justify-center px-5 py-20"
      >
        <div
          ref={modalRef}
          className={`flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6 transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-5"}`}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Add New Transaction
              </h2>
              <button
                onClick={handleClose}
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
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${errors.name ? "border-red" : "border-beige-500"}`}
                  placeholder={`e.g. ${placeholder}`}
                />
                {errors.name && (
                  <span className="text-xs leading-normal text-red">
                    {errors.name}
                  </span>
                )}
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
                {errors.date && (
                  <span className="text-red-500 text-xs">{errors.date}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${errors.amount ? "border-red" : "border-beige-500"}`}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                {errors.amount && (
                  <span className="text-xs leading-normal text-red">
                    {errors.amount}
                  </span>
                )}
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
