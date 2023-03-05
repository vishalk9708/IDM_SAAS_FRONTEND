import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import "../css/selectStyle.css";

const ReactSelectAdmin = ({
  allOptions,
  placeholder,
  Name,
  isDisabled,
  Updater,
  options,
  setOptions,
  index,
  label,
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
      fontSize: "16px !important",
      fontFamily: "PoppinsLight !important",
      fontWeight: "normal !important",
      zIndex: "1000 !important",
    }),
    option: (base, state) => ({
      ...base,
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
    allOptions?.length > 1
      ? [{ label: "All Options", value: "*" }, ...allOptions]
      : allOptions;

  //console.log('Option state to prifill = ', options[index][Name]);

  const handleSelect = (selected, { action }) => {
    //console.log("handle change", action);
    if (!isDisabled) {
      switch (action) {
        case "select-option":
          {
            const all = selected.find((option) => option.value === "*");

            if (all) {
              if (options[index][Name].length == allOptions.length) {
                options[index][Name] = [];
              } else {
                options[index][Name] = allOptions;
              }
              setOptions([...options]);
            } else {
              if (!isDisabled) {
                options[index][Name] = selected;
                //console.log("options in reactSelect = ", options);
                setOptions([...options]);
              }
            }
          }
          break;
        //-------------------------------------------------------------------
        case "deselect-option":
        case "remove-value":
        case "clear":
        case "pop-value":
          {
            options[index][Name] = selected;
            setOptions([...options]);
          }
          break;
      }
    }

    //if(Name == "fund") Updater( options['fund'].map( fund => fund.value));
  };

  return (
    <div className="container">
      <label>
        {label}
        <Select
          closeMenuOnSelect={false}
          className="period"
          menuPlacement="auto"
          maxMenuHeight={270}
          placeholder={placeholder}
          //defaultValue={[colourOptions[0], colourOptions[1]]}
          isSearchable
          value={options[index][Name]}
          isMulti
          options={myOptions}
          hideSelectedOptions={false}
          styles={styles}
          onChange={handleSelect}
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

export default ReactSelectAdmin;
