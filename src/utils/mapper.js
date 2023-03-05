const mapValuesToOption = (options, values) => {
  console.log("values-", values, " funds = ", options);
  if (values.length == 1 && values[0] === "*") {
    return options;
  }

  const filtered = options.filter((option) => {
    if (values.includes(option.value)) {
      return true;
    } else {
      return false;
    }
  });

  return filtered;
};

export default mapValuesToOption;
