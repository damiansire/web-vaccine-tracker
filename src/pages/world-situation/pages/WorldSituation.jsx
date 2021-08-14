import React, { useState, useEffect } from "react";
import CountriesMap from "../../country-statistics/components/CountriesMap";
import RankingTypesButtons from "../../ranking/dummy-components/RankingTypesButtons";
import ColorDefinition from '../components/ColorDefinition';
import TableRanking from '../../ranking/components/TableRanking'
import { getLastDataCountries } from "../../../adapters/rankings"

import { useLocation } from "wouter";


const WorldSituation = () => {
    const rankingTablesOptions = [
        {
            title: "Porcentaje de la poblacion Inmunisada",
            buttonText: "Poblacion Inmunisada",
            usedOnlyTodayData: false,
            attribute: "people_vaccinated_per_hundred",
        },
        {
            title: "Porcentaje de la poblacion vacunada",
            buttonText: "Poblacion vacunada",
            usedOnlyTodayData: false,
            attribute: "people_fully_vaccinated_per_hundred",
        },
        {
            title: "Vacunas aplicadas hoy por millon",
            buttonText: "Vacunados hoy",
            usedOnlyTodayData: false,
            attribute: "daily_vaccinations_per_million",
        },
    ];
    const [selectedOption, selectOption] = useState(rankingTablesOptions[0]);
    const [data, setData] = useState([]);
    const [location, setLocation] = useLocation();

    const setOptionHandle = (option) => {
        selectOption(option);
    };

    async function fetchData() {
        let lastData = await getLastDataCountries();
        setData(lastData)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const selectCountryByName = (event) => {
        setLocation(`/country/${event}`);
        console.log(location)
    }
    return (
        <div className="min-h-full">
            <div>
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-2 grid grid-cols-12">

                        <div className="grid grid-cols-12 col-span-12 ">
                            <div className="col-span-6">
                                <RankingTypesButtons
                                    isRanking={false}
                                    rankingTablesOptions={rankingTablesOptions}
                                    selectOption={setOptionHandle}
                                ></RankingTypesButtons>
                            </div>
                            <div className="col-span-6 text-center text-3xl self-center" >
                                {selectedOption.title}
                            </div>
                        </div>
                        <div className="col-span-12 col-start-1">
                            <CountriesMap selectCountryByName={selectCountryByName} size="xxl" />
                        </div>
                    </div>
                    <div className="col-span-3">

                        <div className=" text-center p-5">
                            <ColorDefinition />
                        </div>
                        <div>
                            {(
                                <TableRanking
                                    data={data
                                    }
                                    attribute={selectedOption.attribute}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorldSituation
