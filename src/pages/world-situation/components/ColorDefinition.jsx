import React from 'react'

const ColorDefinition = () => {
    return (
        <div>
            <table class="table-auto">
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Significado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bg-green-600"> Verde </td>
                        <td> Si los vacunados con todas las dosis son  mas del 70% </td>
                    </tr>
                    <tr>
                        <td className="bg-yellow-300"> Amarillo </td>
                        <td>   Si los vacunados con todas las dosis son  mas del 50% </td> </tr>

                    <tr>
                        <td className="bg-yellow-600"> Naranja </td>
                        <td>  Si los vacunados con todas las dosis son  mas del 35% </td> </tr>

                    <tr>
                        <td className="bg-red-600"> Rojo </td>
                        <td>  Si los vacunados con todas las dosis son mas del 15%  </td> </tr>

                    <tr>
                        <td className="bg-black text-white"> Negro </td>
                        <td>  Si los vacunados con todas las dosis son menos del 15%  </td> </tr>

                    <tr>
                        <td className="bg-blue-600"> Azul </td>
                        <td> Tenemos un problema con los datos, entonces no lo estamos mostrando todavia. </td> </tr>

                </tbody>
            </table>


        </div>
    )
}

export default ColorDefinition
