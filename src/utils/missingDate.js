const getZeroDataPoint = (date) => {
  return {
    daily_vaccinations: null,
    daily_vaccinations_per_million: null,
    date: date,
    people_fully_vaccinated: null,
    people_fully_vaccinated_per_hundred: null,
    people_vaccinated: null,
    people_vaccinated_per_hundred: null,
    total_dose_vaccinations: null,
    vaccine_type: null,
  };
};

export const normalizeCountries = (allContries) => {
  const { minDate, maxDate } = getMaxAndMinDatesInContries(allContries);
  let allDates = generateAllDates(minDate, maxDate);
  allContries = allContries.map((country) =>
    setMissingDates(country, allDates)
  );
  return allContries;
};

//TODO: Refactor
const setMissingDates = (country, allDates) => {
  let countryDate = country.data.map((dataPoint) => dataPoint.date);
  let missingDate = allDates.filter((date) => !countryDate.includes(date));
  missingDate.forEach((date) => {
    country.data.push(getZeroDataPoint(date));
  });
  return country;
};

const getMaxAndMinDatesInContries = (allContries) => {
  let datesArrayOfArray = allContries.map((country) =>
    country.data.map((x) => x.date)
  );

  let initial = [];
  datesArrayOfArray.forEach((element) => (initial = initial.concat(element)));
  let finalDates = Array.from(new Set(initial));
  let finalDatesSorted = finalDates.slice().sort(function (a, b) {
    return new Date(a) - new Date(b);
  });
  let minDate, maxDate;
  if (finalDatesSorted.length === 1) {
    minDate = finalDatesSorted[0];
    maxDate = finalDatesSorted[0];
  } else {
    minDate = finalDatesSorted[0];
    maxDate = finalDatesSorted[finalDatesSorted.length - 1];
  }
  return { minDate: minDate, maxDate: maxDate };
};

const generateAllDates = (minDate, maxDate) => {
  minDate = stringToDate(minDate);
  maxDate = stringToDate(maxDate);
  let allDate = [];
  while (minDate <= maxDate) {
    allDate.push(new Date(minDate));
    nextDay(minDate);
  }
  return allDate.map((date) => dateToString(date));
};

const stringToDate = (stringDate) => {
  let dateObj = new Date(stringDate);
  return new Date(dateObj.setDate(dateObj.getDate() + 1));
};

const dateToString = (date) => {
  let year = date.getFullYear();
  let month =
    date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "-" + month + "-" + day;
};

const nextDay = (dateObj) => {
  return new Date(dateObj.setDate(dateObj.getDate() + 1));
};
