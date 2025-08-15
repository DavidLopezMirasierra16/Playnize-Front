import { useParams } from "react-router-dom";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Administrador/Deportes";
import { useEffect } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { Info } from "../Perfil";

export function TorneoDatos({ url }: Url) {

    const { id } = useParams();
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();

    useEffect(() => {
        fetchData(url + `${id}`, "get", {}, token);
    }, []);

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
                    {/* Información básica */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Información del torneo: {data.torneo.nombre}</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Fechas</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.fechaInicio} / {data.torneo.fechaFin}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Premio</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.premio}</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 lg:mt-0">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Deporte</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.deporte.deporte}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Localización</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.localizacion}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Contacto</p>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr]">
                            <div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Organizador</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.organizador.nombre} {data.torneo.organizador.apellidos}</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-[1fr_2fr] lg:mt-0">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href={`mailto:${data.torneo.organizador.email}`} className="text-base font-medium text-gray-800 break-words">{data.torneo.organizador.email}</a>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.organizador.telefono}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requisitos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Requisitos</p>

                        {data.torneo.requisitos.$values.length > 0 ? (
                            data.torneo.requisitos.$values.map((r: any, i: number) => {
                                return (
                                    <div key={i} className="mt-3">
                                        <p className=" break-all max-w-full md:max-w-[100%] overflow-hidden">
                                            {i + 1}.- {r.descripcion}
                                        </p>
                                    </div>
                                )
                            })
                        ) : <p>No hay ningún requisito registrado</p>}

                    </div>

                    {/* Patrocinadores */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Patrocinadores</p>

                        {data.torneo.patrocinadores.$values.length > 0 ? (
                            data.torneo.patrocinadores.$values.map((p: any, i: number) => {
                                return (
                                    <div key={i} className="mt-3">
                                        <p className=" break-all max-w-full md:max-w-[100%] overflow-hidden">
                                            {i + 1}.- {p.patrocinador}
                                        </p>
                                    </div>
                                )
                            })
                        ) : <p>No hay ningún patrocinador registrado</p>}

                    </div>

                    {/* Equipos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Equipos</p>

                        {data.torneo.torneo_equipos.$values.length > 0 ? (
                            data.torneo.torneo_equipos.$values.map((et: any, i: number) => {
                                return (
                                    <div key={i} className="mt-6">
                                        <div className="flex flex-wrap items-center mb-2">
                                            <p className="text-lg">{et.nombre}</p>
                                            <Info id={et.id} url={`/panel/equipos/`} />
                                        </div>

                                        {et.participantes.$values.length > 0 ? (
                                            et.participantes.$values.map((p: any, i: number) => {
                                                return (
                                                    <div className={`mb-5 items-center grid grid-cols-1 lg:grid-cols-[1fr_3fr] ${i === et.participantes.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`} key={i}>
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
                                        ) : <p className="font-bold">No tiene ningún participante</p>}

                                    </div>
                                )
                            })
                        ) : <p>No hay ningún equipo registrado</p>}

                    </div>


                </div>
            )}

        </>
    )
}