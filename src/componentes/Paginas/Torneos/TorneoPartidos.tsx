import { useParams } from "react-router-dom"
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import axios from "axios";

export function TorneoPartidos({ url }: Url) {

    interface Partido {
        id: number,
        fecha: string,
        idLocal: number,
        nombreLocal: string,
        idVisitante: number,
        nombreVisitante: string,
        resultado: {
            $values: Resultado[];
        };
    }

    interface Resultado {
        resultado: string,
        ganador: number
    }

    const { id } = useParams();
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [partidos, setPartidos] = useState<any>([]);
    const [equiposSelect, setEquiposSelect] = useState([]);
    const [visibilidad, setVisible] = useState({
        filtros: false,
        registro: false
    })
    const [pagina, setPagina] = useState<number>(1);

    const [filtros, setFiltros] = useState({
        equipo: ''
    })

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', pagina.toString());

        if (filtros.equipo?.trim()) params.append('equipo', filtros.equipo.trim());


        const fetchEquipos = async () => {
            try {
                const equipos = await axios.get(`http://localhost:5170/api/Equipos/Torneo/${id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : ''
                    }
                })

                setEquiposSelect(equipos.data.equipos.$values)
            } catch (error) {
                console.error(error);
            }
        }

        fetchData(url + `/${id}` + `?${params.toString()}`, "get", {}, token);
        fetchEquipos();

    }, []);


    useEffect(() => {
        if (data) {
            const equipos = data.datos?.$values?.[0].equipo_resultados.$values.length > 0 ? data.datos?.$values?.[0].equipo_resultados.$values : []
            const noequipos = data.datos?.$values?.[0].noequipo_resultados.$values.length > 0 ? data.datos?.$values?.[0].noequipo_resultados.$values : []

            let datosPartidos: any[] = [];
            if (equipos.length > 0) {
                datosPartidos = equipos;
            } else if (noequipos.length > 0) {
                datosPartidos = noequipos;
            }

            setPartidos(datosPartidos);
            console.log(data);
        }
    }, [data])

    const handleVisible = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { name } = e.currentTarget;

        //El nombre es una clave del tipo visibilidad
        const key = name as keyof typeof visibilidad;
        setVisible(prev => ({
            ...prev, [key]: !prev[key]
        }));
    }

    const handleChangeFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setFiltros(prev => ({
            ...prev, [name]: value
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

    // const handleNextPagina = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     // const { name } = e.currentTarget;


    // }

    useEffect(() => {
        if (data) console.log(data.datos.$values)
    }, [data])

    return (
        <>
            {error ? (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                    <div className="bg-white text-red-600 p-6 rounded-xl shadow-lg text-center w-full max-w-sm mx-auto">
                        <p className="font-semibold text-lg">Error</p>
                        <p className="mt-2">{error}</p>
                    </div>
                </div>
            ) : loading ? (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-10">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : null}

            {data && (
                <div>
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        {/* <p className="mb-4 font-bold text-lg">Partidos del torneo: {data.datos.$values?.[0].nombre}</p> */}

                        {/* Botones */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div>
                                <Boton icono="filtrar" mensaje="Filtrar" name="filtros" type="button" accion={handleVisible} />
                            </div>
                            <div>
                                <Boton icono="registrar" mensaje="Registrar" name="registro" type="button" />
                            </div>
                        </div>

                        {/* Filtros */}
                        {visibilidad.filtros && (
                            <form onSubmit={handleSubmit}>
                                <div className={`mb-4 grid grid-cols-1 gap-2 text-center sm:text-start sm:grid-cols-2 sm:gap-0 md:grid-cols-3 xl:grid-cols-5 bg-white p-3 rounded-md shadow-sm max-w-6xl}`}>
                                    <div>
                                        <p className="text-sm text-gray-500">Equipo</p>
                                        <select name="equipo" value={filtros.equipo} className="border border-[#868686] rounded-sm" onChange={handleChangeFiltro}>
                                            <option value="0">{equiposSelect.length > 0 ? "Seleccione" : "No hay equipos"}</option>
                                            {equiposSelect.map((e: any, i: number) => {
                                                return (
                                                    <option key={i} value={e.id}>{e.nombre}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha</p>
                                        <input type="date" name="" id="" className="ps-1 border border-[#868686] rounded-sm"/>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Tabla */}
                        <div>
                            {partidos.length > 0 ? (
                                partidos.map((p: Partido, i: number) => {
                                    return (
                                        <div key={i} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-4 ${i === partidos.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'} `}>
                                            <div>
                                                <p className="text-sm text-gray-500">Equipo local</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.nombreLocal}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Equipo visitante</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.nombreVisitante}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Fecha</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.fecha}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="text-sm text-gray-500">Resultado</p>
                                                {p.resultado.$values.length > 0 ? (
                                                    p.resultado.$values.map((r: Resultado, k: number) => {
                                                        return (
                                                            <div key={k}>
                                                                <div>
                                                                    <p className="text-base font-medium text-gray-800 break-words">{r.resultado}</p>
                                                                </div>
                                                                {/* <div>
                                                                    <p className="text-sm text-gray-500">Ganador</p>
                                                                    <p>{r.ganador}</p>
                                                                </div> */}
                                                            </div>
                                                        )
                                                    })
                                                ) : <p className="text-base font-medium text-gray-800 break-words">Sin jugar</p>}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay partidos registrados en éste torneo</p>}
                        </div>
                        {/* {data.totalPages > 1 && (
                            <div className="flex flex-wrap items-center">
                                <button name="siguiente" onClick={handleNextPagina} className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`}>Siguiente</button>
                                <button name="atras" onClick={handleNextPagina} className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`}>Atrás</button>
                                <p>{data.currentItems} deportes de {data.totalItems}</p>
                            </div>
                        )} */}
                    </div>
                </div>
            )}

        </>
    )
}