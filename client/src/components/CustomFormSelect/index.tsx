import { useState } from "react";
import iconCaretDown from "../../assets/images/icon-caret-down.svg";

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown = ({ options, value, onChange }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="border-beige flex w-full items-center justify-between rounded-lg border px-5 py-3 text-sm leading-normal text-grey-900 placeholder:text-grey-500 focus:outline-none"
      >
        {value}
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
              className={`cursor-pointer py-3 text-sm leading-normal text-grey-900 ${
                i !== options.length - 1 ? "border-b" : ""
              } ${option === value ? "font-bold" : ""}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
