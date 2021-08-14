import React, { useState, useEffect } from "react";

import {
    getAvailablesCountries
} from "../../../adapters/countries.js";

import {
    getSourcesForCountry
} from "../../../adapters/data-sources";

import SelectCountry from "../SelectCountryComponent/SelectCountry";


const InformationSources = () => {

    const [countrySource, setCountrySource] = useState([]);
    const [availablesCountries, setAvailablesCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("Argentina");

    useEffect(() => {
        getAvailablesCountries().then((data) => {
            setAvailablesCountries(data);
        });
    }, []);

    useEffect(() => {
        getSourcesForCountry(selectedCountry).then((sources) => {
            setCountrySource(sources);
            console.log(sources);
        })
    }, [selectedCountry])



    return (
        <div className="grid grid-cols-12 gap-4 h-screen">
            <div className="col-span-3 col-start-3 border-4 border-indigo-400">
                <div>
                    <h1 className="text-center text-3xl"> Seleccion el pais</h1>
                </div>

                <div className="relative my-2 text-center">
                    <input
                        type="search"
                        className="bg-purple-white shadow rounded border-1 p-3 focus:bg-white focus:border-blue-400"
                        placeholder="Buscar pais..."
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                        }}
                    />
                    <svg
                        version="1.1"
                        className="h-4 text-dark inline ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 52.966 52.966"
                    >
                        <path
                            d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
                        />
                    </svg>
                </div>
                <SelectCountry
                    availablesCountries={availablesCountries}
                    setSelectedCountry={setSelectedCountry}
                    searchTerm={searchTerm}
                />
            </div>
            <div className="col-span-6 border-4 border-indigo-400">
                <h1 className="text-center text-3xl"> Fuentes de informacion</h1>
                <h2 className="text-center text-2xl my-2">Pais seleccionado: <span className="extrabold"> {selectedCountry} </span></h2>
                <ul>
                    {countrySource.map(url => { return <li className="border-2 border-green-300 py-5 mx-1 my-5 text-center"><a href={url} rel="noreferrer" target="_blank">{url}</a></li> })}
                </ul>
            </div>
        </div >
    );
};

export default InformationSources;

