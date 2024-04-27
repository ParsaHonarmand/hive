/** @jsxImportSource react */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DropdownOption } from "./dropdownOption";
import styles from "./Dropdown.module.css";

// Dropdown component which takes a label, mode, and options as props
// label is what we want to display as the dropdown label
// mode can be either "single" or "multi" for single or multi-select mode
// options is an array that we want to display as dropdown options (can be string or number)
export const Dropdown = ({
  label = "Options",
  mode = "single",
  options = [],
}) => {
  // Reference to the dropdown container to check if clicked outside
  const dropdownRef = useRef(null);

  // State to manage the dropdown open/close state and selected option(s)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    mode === "multi" ? [] : ""
  );

  // Function to toggle the dropdown open/close state
  const toggling = () => setIsOpen(!isOpen);

  // Function to handle the option clicked based on the mode
  // For single select mode, set the selected option and close the dropdown
  // For multi-select mode, add or remove the option from the selected options
  // useCallback so that we don't create a new function on every render
  const onOptionClicked = useCallback(
    (value) => () => {
      if (mode === "single") {
        setSelectedOption(value);
        setIsOpen(false);
      } else {
        // For multi-select mode, toggle the option
        setSelectedOption((prev) => {
          const currentIndex = prev.indexOf(value);
          if (currentIndex === -1) {
            return [...prev, value];
          } else {
            return prev.filter((item) => item !== value);
          }
        });
      }
    },
    [mode]
  );

  // Function to handle the select all option for multi-select mode
  // useCallback so that we don't create a new function on every render
  const onToggleSelectAll = useCallback(() => {
    if (selectedOption.length === options.length) {
      setSelectedOption([]);
    } else {
      setSelectedOption([...options]);
    }
  }, [selectedOption, options]);

  // Function to handle the click outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Limit the display of selected options to prevent overflow
  // adds ellipses if we have more than 35 characters
  const displaySelectedOptions = () => {
    if (mode === "multi") {
      if (selectedOption.length > 0) {
        const text = selectedOption.join(", ");
        return text.length > 35 ? text.slice(0, 32) + "..." : text;
      }
      return "Select Options";
    } else {
      return selectedOption || "Select Option";
    }
  };

  // Add or remove the event listener based on the isOpen state
  // triggers whenever isOpen is modified
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

  // Render the options with appropriate checks depending on the mode
  // useMemo to memoize the dropdownOptions array so that it doesn't re-render unnecessarily
  const dropdownOptions = useMemo(
    () =>
      options.map((option) => (
        <DropdownOption
          key={option}
          option={option}
          onChange={onOptionClicked(option)}
          isSelected={
            Array.isArray(selectedOption) && selectedOption.includes(option)
          }
          mode={mode}
          onClick={onOptionClicked(option)}
        />
      )),
    [options, selectedOption, onOptionClicked, mode]
  );

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <label className={styles.dropdownLabel}>{label}</label>
      <button onClick={toggling} className={styles.dropdownButton}>
        {displaySelectedOptions()}
        {/* Unicode down/up arrow, rotates when open */}
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.up : ""}`}>
          &#9660;
        </span>{" "}
      </button>
      {/* if  dropdown is open show list of options */}
      {isOpen && (
        <ul className={styles.dropdownList}>
          {/* for multi mode, we want to have a Select All button */}
          {mode === "multi" && (
            <li
              className={`${styles.dropdownListItem} ${
                selectedOption.length === options.length ? styles.selected : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selectedOption.length === options.length}
                  onChange={onToggleSelectAll}
                  className={styles.checkbox}
                />
                Select All
              </label>
            </li>
          )}
          {dropdownOptions}
        </ul>
      )}
    </div>
  );
};
