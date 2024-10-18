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
        className="flex w-full items-center justify-between rounded-md border border-gray-300 p-2"
      >
        {value}
        <img src={iconCaretDown} alt="caret down icon" />
      </button>
      {isOpen && (
        <ul className="absolute left-0 top-full z-10 max-h-40 w-full overflow-y-auto border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
