import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Pot } from "../../types";

interface AddToPotProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToPot: (pot: Pot) => void;
  selectedPot: Pot | null;
}

const AddToPot = ({
  isOpen,
  onClose,
  onAddToPot,
  selectedPot,
}: AddToPotProps) => {
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({ amount: "" });
  const modalRef = useRef<HTMLDivElement | null>(null);

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

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { amount: "" };

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount.";
      valid = false;
    } else if (
      selectedPot &&
      Number(amount) > selectedPot.target - selectedPot.total
    ) {
      newErrors.amount = `Amount exceeds the remaining balance to reach the target of P${selectedPot.target}.`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleClose = () => {
    setAmount("");
    setErrors({ amount: "" });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (selectedPot) {
        onAddToPot({
          ...selectedPot,
          total: selectedPot.total + Number(amount),
        });
      }

      setAmount("");
      setErrors({ amount: "" });
      onClose();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = Number(e.target.value);
    const maxAmount = selectedPot
      ? selectedPot.target - selectedPot.total
      : Infinity;

    if (inputAmount > 0 && inputAmount <= maxAmount) {
      setErrors({ amount: "" });
    }

    if (inputAmount <= maxAmount) {
      setAmount(e.target.value);
    } else {
      setErrors({ amount: `Amount cannot exceed P${maxAmount.toFixed(2)}` });
    }
  };

  const currentProgress = selectedPot
    ? Math.min((selectedPot.total / selectedPot.target) * 100, 100)
    : 0;

  const projectedProgress =
    selectedPot && amount ? (Number(amount) / selectedPot.target) * 100 : 0;

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
                Add to '{selectedPot && selectedPot.name}'
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
              Add money to your pot to keep it separate from your main balance.
              As soon as you add this money, it will be deducted from your
              current balance.
            </p>

            {selectedPot && (
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm leading-normal text-grey-500">
                    New Amount
                  </span>
                  <span className="text-[2rem] font-bold leading-[1.2] text-grey-900">
                    P{(selectedPot.total + Number(amount)).toFixed(2)}
                  </span>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <div className="relative h-2 w-full overflow-hidden rounded-lg bg-beige-100">
                    <div
                      className={`h-full bg-grey-900 transition-all duration-300 ${!amount ? "rounded-r-lg" : ""}`}
                      style={{ width: `${Math.min(currentProgress, 100)}%` }}
                    ></div>
                    <div
                      className={`absolute top-0 h-full rounded-r-lg bg-green transition-all duration-300 ${selectedPot.total === 0 ? "rounded-l-lg" : ""}`}
                      style={{
                        width: `calc(${Math.min(projectedProgress, 100)}% - 2px)`,
                        left: `calc(${Math.min(currentProgress, 100)}% + 2px)`,
                      }}
                    ></div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`text-xs leading-normal ${amount ? "text-green" : "text-grey-500"}`}
                    >
                      {(currentProgress + projectedProgress).toFixed(2)}%
                    </span>
                    <span className="text-xs leading-normal text-grey-500">
                      Target of P{selectedPot.target}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold leading-normal text-grey-500">
                Amount to Add
              </label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="e.g. 100"
                max={
                  selectedPot
                    ? selectedPot.target - selectedPot.total
                    : undefined
                }
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
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white"
            >
              Confirm Addition
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToPot;
