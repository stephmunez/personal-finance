import { useEffect, useRef, useState } from "react";
import iconCaretDown from "../../assets/images/icon-caret-down.svg";
import { getColorByName } from "../../utils";

interface CustomFormSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  existingCategories?: string[];
  isColorTag?: boolean;
}

const CustomFormSelect = ({
  options,
  value,
  onChange,
  existingCategories,
  isColorTag,
}: CustomFormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-beige-500 px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-grey-500 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {isColorTag && (
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: `${getColorByName(value)}` }}
            ></span>
          )}
          <span> {value}</span>
        </div>

        <img
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          src={iconCaretDown}
          alt="caret down icon"
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)]">
          {options.map((option, i) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer py-3 text-sm leading-normal ${
                i !== options.length - 1 ? "border-b" : ""
              } ${option === value ? "font-bold" : ""} ${existingCategories?.includes(option) ? "pointer-events-none text-grey-500" : "pointer-events-auto text-grey-900"}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomFormSelect;
