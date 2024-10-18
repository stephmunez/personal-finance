import React, { useEffect, useRef, useState } from "react";

interface CustomSelectProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: () => void;
  placeholder?: string;
  placeholderImage?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  isOpen,
  setIsOpen,
  placeholder = "Select an option",
  placeholderImage,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen();
  };

  const toggleDropdown = () => {
    setIsOpen();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    option: string,
  ) => {
    if (e.key === "Enter") {
      handleSelect(option);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      className="relative"
      role="combobox"
      aria-expanded={isOpen}
      aria-controls="options-list"
      ref={dropdownRef} // Attach the ref to the wrapper div
    >
      <button
        className="flex items-center justify-center"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-label="Select an option"
      >
        {windowWidth < 767 && placeholderImage ? (
          <img
            src={placeholderImage}
            alt={placeholder}
            className="placeholder-image"
          />
        ) : (
          value || placeholder
        )}
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 z-10 mt-2 max-h-80 overflow-auto rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)]"
          role="listbox"
        >
          {options.map((option, i) => (
            <li
              key={i}
              className={`cursor-pointer py-3 text-sm leading-normal text-grey-900 ${
                i !== options.length - 1 ? "border-b" : ""
              } ${option === value ? "font-bold" : ""}`}
              role="option"
              tabIndex={0}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;