const filterNames = [
  `everything`, `future`, `past`
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      title: it,
    };
  });
};

export {generateFilters};
