import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Budget } from "../../types";
import { getThemeByCategory } from "../../utils";
import CustomFormSelect from "../CustomFormSelect";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBudget: (budget: Budget) => void;
  existingCategories: string[];
}

const CreateTransactionModal = ({
  isOpen,
  onClose,
  onCreateBudget,
  existingCategories,
}: CreateBudgetModalProps) => {
  const [category, setCategory] = useState("General");
  const [maximum, setMaximum] = useState<string>("");

  const [errors, setErrors] = useState({
    category: "",
    maximum: "",
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

  const getNextAvailableCategory = () => {
    if (!existingCategories.includes("General")) {
      return "General";
    }

    return (
      categories.find((category) => !existingCategories.includes(category)) ||
      "General"
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCategory(getNextAvailableCategory());

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
    const newErrors = { category: "", maximum: "" };

    if (!category.trim()) {
      newErrors.category = "Transaction category is required.";
      valid = false;
    }
    if (!maximum || isNaN(Number(maximum)) || Number(maximum) <= 0) {
      newErrors.maximum = "Please enter a valid amount.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleClose = () => {
    setErrors({ category: "", maximum: "" });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onCreateBudget({
        category,
        maximum: Number(maximum),
        theme: getThemeByCategory(category),
      });

      setCategory(getNextAvailableCategory());
      setMaximum("");
      setErrors({ category: "", maximum: "" });
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
                Add New Budget
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
              Choose a category and set a maximum limit to manage your budgets
              effectively and maintain better control over your spending.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Category
                </label>
                <CustomFormSelect
                  options={categories}
                  value={category}
                  onChange={setCategory}
                  existingCategories={existingCategories}
                  disabled={existingCategories.length === categories.length}
                />
                {existingCategories.includes(category) &&
                  existingCategories.length !== categories.length && (
                    <span className="text-xs leading-normal text-red">
                      A budget for this category already exists. Selecting the
                      next available category.
                    </span>
                  )}
                {existingCategories.length === categories.length && (
                  <span className="text-xs leading-normal text-red">
                    All categories are currently in use. Please delete a budget
                    to free up a category.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Amount
                </label>
                <input
                  type="number"
                  value={maximum}
                  onChange={(e) => setMaximum(e.target.value)}
                  placeholder="e.g. 100"
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${errors.amount ? "border-red" : "border-beige-500"}`}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                {errors.maximum && (
                  <span className="text-xs leading-normal text-red">
                    {errors.maximum}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={existingCategories.length === categories.length}
            >
              Add Budget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
