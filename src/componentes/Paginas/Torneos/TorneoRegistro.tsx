import axios from "axios";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Deporte {
    $id: string,
    deporte: string,
    id: number,
}

interface Torneo {
    nombre: string,
    premio: string,
    fecha_Inicio: string,
    fecha_Fin: string,
    localizacion: string,
    deporte: string,
    requisitos: string[],
    patrocinadores: string[]
}

//Éste vale tanto para requisitos como para patrocinadores
interface Datos {
    id: number
    mensaje?: string
}

type Accion = "Add" | "Remove" | "Edit"

interface AccionI {
    type: Accion,
    payload: Datos
}

const accionesRequisitos = (estado: Datos[], accion: AccionI): Datos[] => {
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

    const { token, setMensaje } = useAuth();
    const navegate = useNavigate();
    const { data, loading, error, fetchData } = useFetch();
    const [deportes, setDeportes] = useState<Deporte[]>([]);
    const [visibilidad, setVisbilidad] = useState({
        requisitos: false,
        patrocinadores: false
    });
    const hoy = new Date().toISOString().split("T")[0];
    const [errores, setErrores] = useState({
        requisitos: false,
        patrocinadores: false
    });

    //------------------------------ Requisitos ------------------------------

    const [requisitoInput, setRequisitoInput] = useState('');
    const [requisitos, setRequisitos] = useReducer(accionesRequisitos, []);

    const [patrocinadorInput, setPatrocinadorInput] = useState('');
    const [patrocinadores, setPatrocinadores] = useReducer(accionesRequisitos, []);

    const handleRequisitoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'requisitos') {
            setRequisitoInput(value);
        } else if (name === 'patrocinadores') {
            setPatrocinadorInput(value);
        }
    }

    const handleAddRequisito = (campo: 'requisitos' | 'patrocinadores') => {
        const valorCampo = campo === 'requisitos' ? requisitoInput : patrocinadorInput;

        if (valorCampo.length === 0) {
            setErrores(prev => ({
                ...prev,
                [campo]: true
            }));
            return;
        }

        //Si no tiene errores
        setErrores(prev => ({
            ...prev,
            [campo]: false
        }));

        if (campo === 'requisitos') {
            setRequisitos({
                type: "Add",
                payload: {
                    id: Date.now(),
                    mensaje: requisitoInput
                }
            });

            setRequisitoInput('');
        } else if (campo === 'patrocinadores') {
            setPatrocinadores({
                type: "Add",
                payload: {
                    id: Date.now(),
                    mensaje: patrocinadorInput
                }
            });

            setPatrocinadorInput('');
        }
    }

    const handleDeleteRequisito = (id: number, campo: 'requisitos' | 'patrocinadores') => {
        if (campo === 'requisitos') {
            setRequisitos({ type: "Remove", payload: { id: id } });
        } else if (campo === 'patrocinadores') {
            setPatrocinadores({ type: "Remove", payload: { id: id } });
        }
    }

    //------------------------------------------------------------------------

    const [torneo, setTorneo] = useState<Torneo>({
        nombre: '',
        premio: '',
        fecha_Inicio: '',
        fecha_Fin: '',
        localizacion: '',
        deporte: '',
        requisitos: [],
        patrocinadores: []
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
        const requisitosFiltrados = requisitos.filter(r => r.mensaje !== undefined).map(r => r.mensaje as string);
        const patrocinadoresFiltrados = patrocinadores.filter(r => r.mensaje !== undefined).map(r => r.mensaje as string);
        setTorneo(prev => ({ ...prev, requisitos: requisitosFiltrados, patrocinadores: patrocinadoresFiltrados })); //Guardo los requisitos sin el ID, sólo el nombre
    }, [requisitos, patrocinadores]);

    //-------------------------------------------------------------

    const handleFetch = () => {
        fetchData(url, "post", { body: torneo }, token);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleFetch();
    }

    useEffect(() => {
        if (data != null) {
            setMensaje(data.message);
            navegate('/panel/torneos');
        }
    }, [data]);

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
                                    <input type="text" name="nombre" value={torneo.nombre} required onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Localización</p>
                                    <input type="text" name="localizacion" value={torneo.localizacion} required onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
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
                                    <input type="date" name="fecha_Inicio" required min={hoy} value={torneo.fecha_Inicio} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12" />
                                </div>
                                <div>
                                    <p className="text-sm text-black">Fecha de finalización</p>
                                    <input type="date" name="fecha_Fin" required min={torneo.fecha_Inicio || hoy} value={torneo.fecha_Fin} onChange={handleChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-12/12" />
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
                                    <select name="deporte" value={torneo.deporte} required onChange={handleChange} className="bg-white border border-[#868686] rounded-sm w-10/12">
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
                                        <input type="text" name="requisitos" value={requisitoInput} onChange={handleRequisitoChange} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-8/12" />
                                        <Boton icono="añadir" title="Añadir" type="button" name="requisitos" accion={() => handleAddRequisito("requisitos")} />
                                        {errores.requisitos && (<p className="text-red-500">Debes de añadir el requisito</p>)}
                                    </div>
                                </div>
                                {requisitos.length > 0 && (
                                    requisitos.map((r: Datos, i: number) => {
                                        return (
                                            <div className="md:w-8/12" key={r.id}>
                                                <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-md shadow-sm">
                                                    <p className="font-bold">Descripción - {i + 1}:</p>
                                                    <div className="md:flex items-center gap-4">
                                                        <p className="break-all whitespace-normal">{r.mensaje}</p>
                                                        <div className="flex flex-col mt-3 lg:mt-0 justify-center ml-auto">
                                                            <Boton icono="quitar" title="Eliminar" type="button" accion={() => handleDeleteRequisito(r.id, "requisitos")} colores="bg-red-500 hover:bg-red-600 text-white" name="requisitos" />
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
                                    <div className="flex flex-wrap gap-2">
                                        <input type="text" name="patrocinadores" onChange={handleRequisitoChange} value={patrocinadorInput} className="ps-1 bg-white border border-[#868686] rounded-sm w-10/12 lg:w-8/12" />
                                        <Boton icono="añadir" title="Añadir" type="button" name="patrocinadores" accion={() => handleAddRequisito("patrocinadores")} />
                                        {errores.patrocinadores && (<p className="text-red-500">Debes de añadir el patrocinador</p>)}
                                    </div>
                                </div>
                                {patrocinadores.length > 0 && (
                                    patrocinadores.map((r: Datos, i: number) => {
                                        return (
                                            <div className="md:w-8/12" key={r.id}>
                                                <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-md shadow-sm">
                                                    <p className="font-bold">Patrocinador Nº{i + 1}:</p>
                                                    <div className="md:flex items-center gap-4">
                                                        <p className="break-all whitespace-normal">{r.mensaje}</p>
                                                        <div className="flex flex-col mt-3 lg:mt-0 justify-center ml-auto">
                                                            <Boton icono="quitar" title="Eliminar" type="button" accion={() => handleDeleteRequisito(r.id, "patrocinadores")} colores="bg-red-500 hover:bg-red-600 text-white" name="requisitos" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                    <Boton type="submit" mensaje="Guardar" colores="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" />
                </form>

            </div>
        </div>
    )
}