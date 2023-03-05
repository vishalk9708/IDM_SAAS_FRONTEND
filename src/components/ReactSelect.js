import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import "../css/selectStyle.css";

const ReactSelect = ({
  allOptions,
  placeholder,
  Name,
  Updater,
  options,
  setOptions,
  label,
  disabled,
}) => {
  const styles = {
    control: (base) => ({
      ...base,
      fontFamily: "PoppinsSemiBold !important",
      fontWeight: "normal !important",
      fontSize: "12px !important",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      fontFamily: "PoppinsLight !important",
      fontWeight: "normal !important",
      zIndex: "1000 !important",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "16px !important",
      cursor: "pointer",
      color: state.isSelected ? "#ecf0f3" : "#333333",
      "&:hover": {
        // Overwrittes the different states of border
        backgroundColor: state.isSelected ? "#29337d" : "#e0e0e0",
        color: state.isSelected ? "#ecf0f3" : "#333333",
      },
    }),
  };

  const myOptions =
    allOptions.length > 1
      ? [{ label: "Select All", value: "*" }, ...allOptions]
      : allOptions;

  const handleSelect = (selected, { action }) => {
    //console.log("handle change", action);

    switch (action) {
      case "select-option":
        {
          const all = selected.find((option) => option.value === "*");

          if (all) {
            if (options[Name].length == allOptions.length) {
              options[Name] = [];
            } else {
              options[Name] = allOptions;
            }
            setOptions({ ...options });
          } else {
            options[Name] = selected;
            setOptions({ ...options });
          }
        }
        break;
      //-------------------------------------------------------------------
      case "deselect-option":
      case "remove-value":
      case "clear":
      case "pop-value":
        {
          options[Name] = selected;
          setOptions({ ...options });
        }
        break;
    }

    if (Name == "fund") Updater(options["fund"].map((fund) => fund.value));
  };

  return (
    <div className="container">
      <label style={{ marginBottom: "-20px" }}>
        {label}
        <Select
          closeMenuOnSelect={false}
          className="period"
          // menuPlacement = 'auto'
          maxMenuHeight={270}
          placeholder={placeholder}
          //defaultValue={[colourOptions[0], colourOptions[1]]}
          isSearchable
          value={options[Name]}
          isMulti
          options={myOptions}
          hideSelectedOptions={false}
          styles={styles}
          onChange={handleSelect}
          isDisabled={disabled}
          menuPosition="fixed"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "#ecf0f3",
              primary: "#29337d",
              neutral0: "#ecf0f3",
            },
          })}
        />
      </label>
    </div>
  );
};

export default ReactSelect;
