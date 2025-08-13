import axios from "axios";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Administrador/Deportes";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useState } from "react";
import type { Torneo } from "./Torneos";

interface Deporte {
    $id: string,
    deporte: string,
    id: number
}

export function TorneoRegistro({ url }: Url) {

    const { token } = useAuth();
    const { loading, error } = useFetch();
    const [deportes, setDeportes] = useState<Deporte[]>([]);
    const [torneo, setTorneo] = useState<Torneo>({
        nombre: '',
        premio: '',
        fechaInicio: '',
        fechaFin: '',
        localizacion: '',
        deporte: ''
    });

    const handleSelect = async () => {
        const dep = await axios.get(`http://localhost:5170/api/Deportes/Select`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : token
            }
        });
        setDeportes(dep.data.deportes.$values);
    }

    useEffect(() => {
        handleSelect();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTorneo(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(torneo);
    }

    return (
        <div>
            <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                <p className="mb-4 font-bold text-lg">Formulario de Registro de un Torneo</p>

                {error ? (
                    <div className="bg-linear-to-r from-rose-500 via-pink-500 to-red-500 rounded-md p-2 mb-4">
                        <p className="text-white">{error}</p>
                    </div>
                ) : loading ? (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="bg-gray-100 rounded-md shadow-sm p-3">
                    <div className="mb-6 flex flex-col gap-3 text-center sm:text-start sm:gap-2 lg:gap-3">
                        {/* Nombre y dirección */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-md font-bold whitespace-nowrap">Información personal</p>
                                <hr className="flex-grow border-t border-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                <div>
                                    <p className="text-sm text-black">Nombre del torneo</p>
                                    <input type="text" name="nombre" value={torneo.nombre} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Localización</p>
                                    <input type="text" name="localizacion" value={torneo.localizacion} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
                                </div>
                            </div>
                        </div>
                        {/* Fechas */}
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-md font-bold whitespace-nowrap">Duración</p>
                                <hr className="flex-grow border-t border-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                <div>
                                    <p className="text-sm text-black">Fecha de inicio</p>
                                    <input type="date" name="fechaInicio" value={torneo.fechaInicio} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Fecha de finalización</p>
                                    <input type="date" name="fechaFin" value={torneo.fechaFin} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
                                </div>
                            </div>
                        </div>
                        {/* Deporte y premio */}
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-md font-bold whitespace-nowrap">Datos adicionales</p>
                                <hr className="flex-grow border-t border-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:w-8/12">
                                <div>
                                    <p className="text-sm text-black">Premio</p>
                                    <input type="text" name="premio" value={torneo.premio} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Deporte</p>
                                    <select name="deporte" value={torneo.deporte} onChange={handleChange} className="bg-white border border-[#868686] rounded-sm w-10/12">
                                        {deportes.map((deporte, i) => (
                                            <option key={i} value={deporte.id}>
                                                {deporte.deporte}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Boton type="submit" mensaje="Guardar" colores="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" />
                </form>

            </div>
        </div>
    )
}