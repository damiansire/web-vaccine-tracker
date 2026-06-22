import React from "react";

/**
 * Lista de países seleccionables, parametrizable para uso single-select y
 * multi-select.
 *
 * Props:
 * - availablesCountries: string[] — países disponibles para elegir.
 * - searchTerm: string — filtro de texto sobre el nombre del país.
 * - mode: "single" | "multi" (default "single").
 *     "single" reemplaza la selección actual al elegir un país.
 *     "multi" agrega el país a la lista y oculta los ya seleccionados.
 * - setSelectedCountry: (name) => void — usado en modo "single".
 * - setSelectedCountries: updater de useState — usado en modo "multi".
 * - selectedCountries: string[] — selección actual (para filtrar en "multi").
 */
function SelectCountry(props) {
  const { mode = "single", selectedCountries = [] } = props;
  const isMulti = mode === "multi";

  const selectCountry = (countryName) => {
    if (isMulti) {
      props.setSelectedCountries((lastSelected) => {
        return [...lastSelected, countryName];
      });
    } else {
      props.setSelectedCountry(() => {
        return countryName;
      });
    }
  };

  return (
    <div className="w-full overflow-scroll" style={{ height: "82vh" }}>
      {props.availablesCountries
        .filter((country) => {
          const matchesSearch = country
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase());
          if (!matchesSearch) {
            return false;
          }
          if (isMulti) {
            return !selectedCountries.includes(country);
          }
          return true;
        })
        .map((countryName) => {
          return (
            <SelectOption
              key={countryName}
              countryName={countryName}
              selectCountry={selectCountry}
            />
          );
        })}
    </div>
  );
}

function SelectOption(props) {
  return (
    <div
      className="cursor-pointer w-full p-3 text-center border-black bg-gray-300 border-b hover:bg-red-300"
      onClick={() => {
        props.selectCountry(props.countryName);
      }}
    >
      {props.countryName}
    </div>
  );
}

export default SelectCountry;
