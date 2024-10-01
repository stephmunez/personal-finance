import React, { useEffect, useState } from "react";

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

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="relative"
      role="combobox"
      aria-expanded={isOpen}
      aria-controls="options-list"
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
          className="absolute right-0 mt-2 max-h-80 overflow-auto rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.25)]"
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer py-3 ${
                index !== options.length - 1 ? "border-b" : ""
              }`}
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
