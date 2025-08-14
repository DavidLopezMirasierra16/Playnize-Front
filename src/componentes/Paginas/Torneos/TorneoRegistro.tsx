import axios from "axios";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Administrador/Deportes";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useReducer, useState } from "react";

interface Deporte {
    $id: string,
    deporte: string,
    id: number,
}

interface Torneo {
    nombre: string,
    premio: string,
    fechaInicio: string,
    fechaFin: string,
    localizacion: string,
    deporte: string,
    requisitos: string[]
}

interface Requisitos {
    id: number
    requisito?: string
}

type Accion = "Add" | "Remove" | "Edit"

interface AccionI {
    type: Accion,
    payload: Requisitos
}

const accionesRequisitos = (estado: Requisitos[], accion: AccionI): Requisitos[] => {
    switch (accion.type) {
        case "Add":
            return [...estado, accion.payload];
        case "Remove":
            return estado.filter(e => e.id != accion.payload.id)
        default:
            return estado
    }
}

export function TorneoRegistro({ url }: Url) {

    const { token } = useAuth();
    const { loading, error } = useFetch();
    const [deportes, setDeportes] = useState<Deporte[]>([]);
    const [visibilidad, setVisbilidad] = useState({
        requisitos: false,
        patrocinadores: false
    });
    const hoy = new Date().toISOString().split("T")[0];

    //------------------------------ Requisitos ------------------------------

    const [requisitoInput, setRequisitoInput] = useState('');
    const [requisitos, setRequisitos] = useReducer(accionesRequisitos, []);

    const handleRequisitoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequisitoInput(e.target.value);
    }

    const handleAddRequisito = () => {
        setRequisitos({
            type: "Add",
            payload: {
                id: Date.now(),
                requisito: requisitoInput
            }
        });
        setRequisitoInput('');
    }

    const handleDeleteRequisito = (id: number) => {
        setRequisitos({ type: "Remove", payload: { id: id } });
    }

    //------------------------------------------------------------------------

    const [torneo, setTorneo] = useState<Torneo>({
        nombre: '',
        premio: '',
        fechaInicio: '',
        fechaFin: '',
        localizacion: '',
        deporte: '',
        requisitos: []
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

    const handleVisible = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { name } = e.currentTarget;

        //Afirmamos que "name" es una de las claves de nuestro objeto 'visibilidad'.
        const key = name as keyof typeof visibilidad;
        setVisbilidad(prev => ({ ...prev, [key]: !prev[key] }));
    }

    useEffect(() => {
        const requisitosFiltrados = requisitos.filter(r => r.requisito !== undefined).map(r => r.requisito as string);
        setTorneo(prev => ({ ...prev, requisitos: requisitosFiltrados })); //Guardo los requisitos sin el ID, sólo el nombre
    }, [requisitos]);

    //-------------------------------------------------------------

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
                                <p className="text-md font-bold whitespace-nowrap">Información</p>
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
                                    <input type="date" name="fechaInicio" min={hoy} value={torneo.fechaInicio} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Fecha de finalización</p>
                                    <input type="date" name="fechaFin" min={torneo.fechaInicio || hoy} value={torneo.fechaFin} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
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
                                    <input type="text" name="premio" value={torneo.premio} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" placeholder="Omite rellenar el campo si no hay premio" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Deporte</p>
                                    <select name="deporte" value={torneo.deporte} onChange={handleChange} className="bg-white border border-[#868686] rounded-sm w-10/12">
                                        <option value="0">Selecciona una opcion</option>
                                        {deportes.map((deporte, i) => (
                                            <option key={i} value={deporte.id}>
                                                {deporte.deporte}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <button name="requisitos" onClick={handleVisible} type="button" className="w-20 cursor-pointer p-1 rounded-sm bg-[#1E2939] hover:bg-[#374151] text-white">Requisitos</button>
                            <button name="patrocinadores" onClick={handleVisible} type="button" className="w-28 cursor-pointer p-1 rounded-sm bg-[#1E2939] hover:bg-[#374151] text-white">Patrocinadores</button>
                        </div>

                        {/* Requisitos */}
                        {visibilidad.requisitos && (
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-md font-bold whitespace-nowrap">Requisitos</p>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Descripción</p>
                                    <div className="flex flex-wrap gap-2">
                                        <input type="text" name="requisitos" required value={requisitoInput} onChange={handleRequisitoChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-8/12" />
                                        <Boton icono="añadir" title="Añadir" type="button" name="requisitos" accion={handleAddRequisito} />
                                    </div>
                                </div>
                                {requisitos.length > 0 && (
                                    requisitos.map((r: Requisitos, i: number) => {
                                        return (
                                            <div className="md:w-8/12" key={r.id}>
                                                <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-md shadow-sm">
                                                    <p className="font-bold">Descripción - {i + 1}:</p>
                                                    <div className="md:flex items-center gap-4">
                                                        <p className="break-all whitespace-normal">{r.requisito}</p>
                                                        <div className="flex flex-col mt-3 lg:mt-0 justify-center ml-auto">
                                                            <Boton icono="quitar" title="Eliminar" type="button" accion={() => handleDeleteRequisito(r.id)} colores="bg-red-500 hover:bg-red-600 text-white" name="requisitos" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}
                        {/* Patrocinadores */}
                        {visibilidad.patrocinadores && (
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-md font-bold whitespace-nowrap">Patrocinadores</p>
                                    <hr className="flex-grow border-t border-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Nombre</p>
                                    <input type="text" className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-8/12" />
                                </div>
                            </div>
                        )}
                    </div>
                    <Boton type="submit" mensaje="Guardar" colores="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" />
                </form>

            </div>
        </div>
    )
}