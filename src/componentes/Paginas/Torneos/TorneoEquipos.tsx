import { useParams } from "react-router-dom"
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useEffect } from "react";
import type { Url } from "../Deportes/Deportes";
import { useAuth } from "../../Auth/AuthContext";
import { Info } from "../Perfil/Perfil";

export function TorneoEquipos({ url }: Url) {

    const { id } = useParams();
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData(url + `/${id}`, 'get', {}, token)
    }, []);

    useEffect(() => {
        if (data) console.log(data)
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
                        {/* <p className="mb-4 font-bold text-lg">Equipos del torneo: {data.equipos.nombreTorneo}</p> */}

                        {/* Tabla */}
                        <div>
                            {data.datos.$values.length > 0 ? (
                                data.datos.$values.map((et: any, i: number) => {
                                    return (
                                        <div key={i} className={`mt-6 ${i === et.participantes.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div className={`flex flex-wrap items-center mb-2`}>
                                                <p className="text-lg">{et.nombre}</p>
                                                <Info id={et.id} url={`/panel/equipos/`} />
                                            </div>

                                            {et.participantes.$values.length > 0 ? (
                                                et.participantes.$values.map((p: any, i: number) => {
                                                    return (
                                                        <div className={`mb-5 items-center grid grid-cols-1 lg:grid-cols-[1fr_3fr]`} key={i}>
                                                            <div>
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-sm text-gray-500">Participante</p>
                                                                    <p className="text-base font-medium text-gray-800 break-words">{p.nombre} {p.apellidos}</p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-[1fr_2fr] lg:mt-0">
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-sm text-gray-500">Email</p>
                                                                    <a href={`mailto:${p.email}`} className="text-base font-medium text-gray-800 break-words">{p.email}</a>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-sm text-gray-500">Teléfono</p>
                                                                    <p className="text-base font-medium text-gray-800 break-words">{p.telefono}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : <p className="mb-5">No tiene ningún participante</p>}

                                        </div>
                                    )
                                })
                            ) : <p>No hay ningún equipo en este torneo</p>}

                            {/* {data.totalPages > 1 && (
                                <div className="flex flex-wrap items-center">
                                    <button name="siguiente" onClick={handleNextPagina} className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`}>Siguiente</button>
                                    <button name="atras" onClick={handleNextPagina} className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`}>Atrás</button>
                                    <p>{data.currentItems} deportes de {data.totalItems}</p>
                                </div>
                            )} */}

                        </div>

                    </div>
                </div>
            )}

        </>
    )
}