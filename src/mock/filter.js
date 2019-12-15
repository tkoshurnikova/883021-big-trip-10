const filterNames = [
  `everything`, `future`, `past`
];

const generateFilters = () => {
  return filterNames.map((item) => {
    return {
      title: item,
    };
  });
};

export {generateFilters};
