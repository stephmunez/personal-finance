import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Moment } from "moment";
import moment from "moment-timezone";
import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { RecurringBill } from "../../types";
import CustomFormSelect from "../CustomFormSelect";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface CreateRecurringBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecurringBill: (bill: RecurringBill) => void;
}

const recurringBillPlaceholders = [
  "Rent Payment",
  "Electricity Bill",
  "Internet Subscription",
  "Mobile Phone Plan",
  "Water Bill",
  "Gas Bill",
  "Credit Card Payment",
  "Health Insurance Premium",
  "Car Loan",
  "Streaming Service Subscription",
];

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

const CreateRecurringBillModal = ({
  isOpen,
  onClose,
  onCreateRecurringBill,
}: CreateRecurringBillModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<string>("Monthly");
  const [status, setStatus] = useState<string>("Due");
  const [dueDate, setDueDate] = useState<Moment | null>(null);
  const [placeholder, setPlaceholder] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    amount: "",
    dueDate: "",
    frequency: "",
    status: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const randomPlaceholder =
        recurringBillPlaceholders[
          Math.floor(Math.random() * recurringBillPlaceholders.length)
        ];
      setPlaceholder(randomPlaceholder);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close modal if clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      category: "",
      amount: "",
      dueDate: "",
      frequency: "",
      status: "",
    };

    if (!name.trim()) {
      newErrors.name = "RecurringBill name is required.";
      valid = false;
    }

    if (!category.trim()) {
      newErrors.category = "RecurringBill category is required.";
      valid = false;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount.";
      valid = false;
    }

    if (!frequency.trim()) {
      newErrors.frequency = "RecurringBill frequency is required.";
      valid = false;
    }
    if (!status.trim()) {
      newErrors.status = "RecurringBill status is required.";
      valid = false;
    }
    if (!dueDate) {
      newErrors.dueDate = "Date is required.";
      valid = false;
    }

    console.log(newErrors);

    setErrors(newErrors);
    return valid;
  };

  const handleClose = () => {
    setErrors({
      name: "",
      category: "",
      amount: "",
      dueDate: "",
      frequency: "",
      status: "",
    });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert the dueDate to local time and format it as an ISO string
      const formattedDate = dueDate?.toISOString();
      console.log(formattedDate);

      onCreateRecurringBill({
        name,
        amount: Number(amount),
        category,
        frequency: frequency.toLowerCase(),
        status: status.toLowerCase(),
        dueDate: formattedDate!, // Ensure that the date passed is in the correct format
      });

      // Reset state values
      setName("");
      setCategory("General");
      setAmount("");
      setFrequency("Monthly");
      setStatus("Due");
      setDueDate(null);

      // Reset form errors and close the modal
      setErrors({
        name: "",
        category: "",
        amount: "",
        dueDate: "",
        frequency: "",
        status: "",
      });

      onClose();
    }
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black/50 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-screen min-h-[480px] w-full flex-col items-center px-5 py-20"
      >
        <div
          ref={modalRef}
          className={`flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6 transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-5"
          }`}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Create Recurring Bill
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
              Choose a category, set the due date, specify the frequency, and
              enter the amount to ensure your recurring bills are tracked and
              paid on time, keeping your finances in check.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-5"
            noValidate
          >
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${
                    errors.name ? "border-red" : "border-beige-500"
                  }`}
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
                  onChange={(val) => {
                    setCategory(val);
                  }}
                />
                {errors.category && (
                  <span className="text-xs leading-normal text-red">
                    {errors.category}
                  </span>
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
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Frequency
                </label>
                <CustomFormSelect
                  options={["Monthly", "Weekly", "Biweekly"]}
                  value={frequency}
                  onChange={(val) => {
                    setFrequency(val);
                  }}
                />
                {errors.frequency && (
                  <span className="text-xs leading-normal text-red">
                    {errors.frequency}
                  </span>
                )}
              </div>
              <div
                className="flex flex-col gap-1"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Due Date
                </label>
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-sg"
                >
                  <DatePicker
                    value={dueDate}
                    onChange={(newDate) => setDueDate(newDate)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          sx: {
                            padding: "14px 16px",
                            borderRadius: "8px",
                          },
                        },
                        inputProps: {
                          sx: {
                            padding: "0",
                            fontFamily: "Public Sans",
                            fontSize: "14px",
                            borderRadius: "8px",
                          },
                        },
                      },
                      openPickerButton: {
                        color: "default",
                      },
                    }}
                  />
                </LocalizationProvider>
                {errors.dueDate && (
                  <span className="text-red-500 text-xs">{errors.dueDate}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Status
                </label>
                <CustomFormSelect
                  options={["Paid", "Due"]}
                  value={status}
                  onChange={(val) => {
                    setStatus(val);
                  }}
                />
                {errors.status && (
                  <span className="text-xs leading-normal text-red">
                    {errors.status}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecurringBillModal;