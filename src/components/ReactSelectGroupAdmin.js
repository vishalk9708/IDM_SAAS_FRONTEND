import React, { useState, useRef, useEffect } from "react";
import "../css/selectStyle.css";
import Select, { components } from "react-select";

function ReactSelectGroupAdmin({
  allOptions,
  Name,
  placeholder,
  options,
  setOptions,
  isDisabled,
  index,
  label,
}) {
  const isReportsAvailable =
    allOptions != null &&
    allOptions != undefined &&
    Object.keys(allOptions).length > 0;

  //console.log("report Availablity = ", allOptions);

  // React.useMemo(() => {

  //   //console.log("useMemo get executed");
  //   let flag = false;

  //   if(isReportsAvailable && !isDisabled)
  //   {
  //   //console.log('allOtions = ', allOptions);

  //   allOptions?.forEach( report => {
  //     if( report.value === 'regulatory--*')
  //     {
  //       flag = true;
  //       //console.log('yes all reg option')
  //       options[index][Name] = options[index][Name]?.filter( option => !(option.value === 'regulatory--*'));
  //       options[index][Name] = [ ...options[index][Name],...allOptions.regulatoryReports];
  //     }
  //     if( report?.value === 'daily--*')
  //     {
  //       flag = true;
  //       //console.log('yes all daily option')
  //       options[index][Name] = options[index][Name]?.filter( option => !(option.value === 'daily--*'));
  //       options[index][Name] = [...options[index][Name],...allOptions.DailyReports];
  //     }
  //   });

  //   if(flag)
  //   setOptions([...options]);
  // }

  // },[])

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
  const allDailyoption = { label: "All Daily Reports", value: "daily--*" };

  let groupedOptions = [];

  if (!isReportsAvailable) {
    groupedOptions = [
      {
        label: "Reports",
        options: [{ label: "Please Select Funds", value: "" }],
      },
    ];
  } else {
    groupedOptions = [
      {
        label: "REGULATORY REPORTS",
        options: [allRegOption, ...allOptions?.regulatoryReports],
      },
      {
        label: "DAILY REPORTS",
        options: [allDailyoption, ...allOptions?.dailyReports],
      },
      {
        label: "SELECT FOR DYNAMIC REPORTS",
        options: [...allOptions?.dynamicReports],
      },
    ];
  }

  const handleSelect = (selected, { action }) => {
    // console.log("handle change", action);

    if (!isDisabled) {
      switch (action) {
        case "select-option":
          {
            console.log("options :", options[index][Name]);
            const allReg =
              selected[selected.length - 1].value == "regulatory--*";
            const allDaily = selected[selected.length - 1].value == "daily--*";

            if (allReg) {
              const filtered = options[index][Name].filter((report) => {
                return report?.value?.split("--")[0] == "regulatory";
                //return !(allOptions.regulatoryReports.find(regReport => regReport.label === report.label));
              });

              options[index][Name] = [
                ...filtered,
                ...allOptions.regulatoryReports,
              ];
              setOptions([...options]);
            } else if (allDaily) {
              const filtered = options[index][Name].filter((report) => {
                //  return !(allOptions.dailyReports.find(daily => daily.label === report.label));
                return report?.value?.split("--")[0] == "daily";
              });
              options[index][Name] = [...filtered, ...allOptions.dailyReports];
              setOptions([...options]);
            } else {
              options[index][Name] = selected;
              setOptions([...options]);
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
  };

  //----------------------------------------------------------------------

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
          value={options[index][Name]}
          isMulti
          options={groupedOptions}
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
}

export default ReactSelectGroupAdmin;
