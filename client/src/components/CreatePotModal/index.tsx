import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Pot } from "../../types";
import { getColorByName } from "../../utils";
import CustomFormSelect from "../CustomFormSelect";

interface CreatePotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePot: (pot: Pot) => void;
  existingColors: string[];
}

const colors = [
  "Green",
  "Yellow",
  "Cyan",
  "Navy",
  "Red",
  "Purple",
  "Turquoise",
  "Brown",
  "Magenta",
  "Blue",
  "Grey",
  "Army",
  "Pink",
  "Gold",
  "Orange",
];

const potPlaceholders = [
  "Emergency Fund",
  "Vacation Savings",
  "New Car Fund",
  "Home Renovation",
  "Wedding Fund",
  "Holiday Gifts",
  "Education Savings",
  "Health & Wellness",
  "Pet Expenses",
  "Gadget Upgrade",
];

const CreateTransactionModal = ({
  isOpen,
  onClose,
  onCreatePot,
  existingColors,
}: CreatePotModalProps) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [theme, setTheme] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");

  const [errors, setErrors] = useState({
    name: "",
    target: "",
    theme: "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

  const getNextAvailableColor = () => {
    if (!existingColors.includes("Green")) {
      return "Green";
    }

    const availableColor = colors.find(
      (color) => !existingColors.includes(color),
    );

    return availableColor || "Green";
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const randomPlaceholder =
        potPlaceholders[Math.floor(Math.random() * potPlaceholders.length)];
      setPlaceholder(randomPlaceholder);
      const nextColor = getNextAvailableColor();
      setColor(nextColor);
      setTheme(getColorByName(nextColor)); // Set theme based on initial color

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

  useEffect(() => {
    if (color) {
      setTheme(getColorByName(color));
    }
  }, [color]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", target: "", theme: "" };

    if (!name.trim()) {
      newErrors.name = "Pot name is required.";
      valid = false;
    }

    if (!theme.trim()) {
      newErrors.theme = "Pot theme is required.";
      valid = false;
    }

    if (!target || isNaN(Number(target)) || Number(target) <= 0) {
      newErrors.target = "Please enter a valid amount.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleClose = () => {
    setErrors({ name: "", target: "", theme: "" });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onCreatePot({
        name,
        total: 0,
        target: Number(target),
        theme,
      });

      setName("");
      setColor(getNextAvailableColor());
      setTarget("");
      setErrors({ name: "", target: "", theme: "" });
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
                Add New Pot
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
                  Pot Name
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

                {errors.name ? (
                  <span className="text-xs leading-normal text-red">
                    {errors.name}
                  </span>
                ) : (
                  <span className="self-end text-xs text-grey-500">
                    {30 - name.length} of 30 characters left
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Target
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 100"
                  className={`w-full rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-beige-500 focus:outline-none ${errors.target ? "border-red" : "border-beige-500"}`}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                {errors.target && (
                  <span className="text-xs leading-normal text-red">
                    {errors.target}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold leading-normal text-grey-500">
                  Theme
                </label>
                <CustomFormSelect
                  options={colors}
                  value={color}
                  onChange={(selectedColor) => {
                    setColor(selectedColor);
                    setTheme(getColorByName(selectedColor)); // Ensure theme updates with color change
                  }}
                  existingColors={existingColors}
                  isColorTag
                />
                {existingColors.includes(color) && (
                  <span className="text-xs leading-normal text-red">
                    A theme for this pot already exists. Selecting the next
                    available category.
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-grey-900 py-4 text-sm font-bold leading-normal text-white"
            >
              Add Pot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
