import React from "react";
import styles from "./Dropdown.module.css";

// Assuming `mode` is now passed to the component to determine how to render
export const DropdownOption = React.memo(
  ({ option, onChange, isSelected, mode, onClick }) => {
    return mode === "multi" ? (
      <li
        className={`${styles.dropdownListItem} ${
          isSelected && mode === "multi" ? styles.selected : ""
        }`}
        onClick={onChange}
      >
        <label>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onChange}
            className={styles.checkbox}
          />
          {option}
        </label>
      </li>
    ) : (
      <li
        className={`${styles.dropdownListItem} ${
          isSelected && mode === "multi" ? styles.selected : ""
        }`}
        onClick={onClick}
      >
        {/* Render just the option text if not in multi-select mode */}
        {option}
      </li>
    );
  }
);

DropdownOption.displayName = "DropdownOption";
