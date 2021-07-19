import React from 'react'
import CountriesMap from "../../country-statistics/components/CountriesMap";
import ColorDefinition from '../components/ColorDefinition';

const WorldSituation = () => {
    const selectCountryByName = (event) => { alert("no implementado") }
    return (
        <div className="min-h-full">
            <div>
                <div className="grid grid-cols-12">
                    <div className="col-start-2 col-span-8">
                        <CountriesMap selectCountryByName={selectCountryByName} size="xxl" />
                    </div>
                    <div className="col-span-3 text-center p-5">
                        <ColorDefinition />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorldSituation
