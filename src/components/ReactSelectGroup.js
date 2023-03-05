import React, { useState, useRef, useEffect } from "react";
import "../css/selectStyle.css";
import Select, { components } from "react-select";

function ReactSelectGroup({
  allOptions,
  Name,
  placeholder,
  options,
  setOptions,
  label,
  disabled,
}) {
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

  const groupStyles = {
    border: `2px solid lightgrey`,
    borderRadius: "0px",
  };

  const groupHeaderStyles = {
    background: "#e6e6e6",
    padding: "5px 0px",
    margin: "0px 5px",
    fontSize: "16px",
    fontFamily: "PoppinsSemiBold",
    display: "flex",
    borderRadius: "5px",
  };

  const allRegOption = {
    label: "All Regulatory Reports",
    value: "regulatory--*",
  };
  const allDailyoption = {
    label: "All Daily Reports",
    value: "daily--*",
  };

  let groupedOptions = [
    {
      label: "REGULATORY REPORTS",
      options: [allRegOption, ...allOptions.regulatoryReports],
    },
    {
      label: "DAILY REPORTS",
      options: [allDailyoption, ...allOptions.dailyReports],
    },
    {
      label: "SELECT FOR DYNAMIC REPORTS",
      options: [...allOptions.dynamicReports],
    },
  ];

  const isReportsAvailable =
    allOptions.regulatoryReports.length > 0 &&
    allOptions.dailyReports.length > 0;

  if (!isReportsAvailable) {
    groupedOptions = [
      {
        label: "Reports",
        options: [{ label: "Please Select Funds", value: "" }],
      },
    ];
  }

  const handleSelect = (selected, { action }) => {
    switch (action) {
      case "select-option":
        {
          const allReg = selected.find(
            (option) => option.value === "regulatory--*"
          );
          const allDaily = selected.find(
            (option) => option.value === "daily--*"
          );

          if (allReg) {
            const filtered = options[Name].filter((report) => {
              if (report?.value?.split("--")[0] !== "regulatory") return true;
              return !allOptions.regulatoryReports.find(
                (regReport) => (regReport.label === report.label)
              );
            });
            options[Name] = [...filtered, ...allOptions.regulatoryReports];
            setOptions({ ...options });
          } else if (allDaily) {
            const filtered = options[Name].filter((report) => {
              if (report?.value?.split("--")[0] !== "daily") return true;
              return !allOptions.dailyReports.find(
                (daily) => daily.label === report.label
              );
            });
            options[Name] = [...filtered, ...allOptions.dailyReports];
            setOptions({ ...options });
            console.log(options);
          } else {
            options[Name] = selected;
            setOptions({ ...options });
            console.log(options);
          }
        }
        break;
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
  };

  const Group = (props) => (
    <div style={groupStyles}>
      <components.Group {...props} />
    </div>
  );

  const GroupHeading = (props) => (
    <div style={groupHeaderStyles}>
      <components.GroupHeading {...props} />
    </div>
  );

  return (
    <div className="container">
      <label>
        {label}
        <Select
          closeMenuOnSelect={false}
          className="period"
          menuPlacement="auto"
          maxMenuHeight={250}
          placeholder={placeholder}
          components={{ Group, GroupHeading }}
          //defaultValue={[colourOptions[0], colourOptions[1]]}
          isSearchable
          value={options[Name]}
          isMulti
          options={groupedOptions}
          hideSelectedOptions={false}
          styles={styles}
          onChange={handleSelect}
          menuPosition="fixed"
          isDisabled={disabled}
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
}

export default ReactSelectGroup;
