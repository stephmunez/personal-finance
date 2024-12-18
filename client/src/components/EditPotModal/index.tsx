import { FormEvent, useEffect, useRef, useState } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Pot } from "../../types";
import { getColorByName, getNameByColor } from "../../utils";
import CustomFormSelect from "../CustomFormSelect";

interface EditPotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPot: (pot: Pot) => void;
  selectedPot: Pot | null;
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

const EditPotModal = ({
  isOpen,
  onClose,
  onEditPot,
  selectedPot,
  existingColors,
}: EditPotModalProps) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [total, setTotal] = useState("");
  const [theme, setTheme] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");

  const [errors, setErrors] = useState({
    name: "",
    target: "",
    theme: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && selectedPot) {
      document.body.style.overflow = "hidden";
      const randomPlaceholder =
        potPlaceholders[Math.floor(Math.random() * potPlaceholders.length)];
      setPlaceholder(randomPlaceholder);

      setName(selectedPot.name);
      setTarget(selectedPot.target.toString());
      setTotal(selectedPot.total.toString());
      setTheme(selectedPot.theme);
      setColor(getNameByColor(selectedPot.theme) || "");
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, selectedPot]);

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

  useEffect(() => {
    if (color) {
      setTheme(getColorByName(color));
    }
  }, [color]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", target: "", total: "", theme: "" };

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
      onEditPot({
        _id: selectedPot?._id || "",
        name,
        total: Number(total),
        target: Number(target),
        theme,
      });

      setErrors({ name: "", target: "", theme: "" });
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
        className="flex h-screen min-h-[480px] w-full flex-col items-center justify-center px-5 py-20"
      >
        <div
          ref={modalRef}
          className={`flex w-full max-w-96 flex-col gap-5 rounded-xl bg-white px-5 py-6 transition-transform duration-300 md:max-w-[560px] md:p-8 ${
            isOpen ? "translate-y-0" : "translate-y-5"
          }`}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Edit Pot
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
              You can easily update your pot details to keep your savings on
              track and reach your financial goals faster.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-5"
            noValidate
          >
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
                  Category
                </label>
                <CustomFormSelect
                  options={colors}
                  value={color}
                  onChange={(selectedColor) => {
                    setColor(selectedColor);
                    setTheme(getColorByName(selectedColor));
                  }}
                  existingColors={existingColors}
                  isColorTag
                />
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

export default EditPotModal;
