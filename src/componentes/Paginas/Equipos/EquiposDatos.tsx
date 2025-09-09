import { useEffect, useState } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { Activo, Finalizado } from "../../Componentes_Personalizados/Estados";
import { Info } from "../Perfil/Perfil";
import { FormRegistroEquipos, type Equipo } from "./FormRegistroEquipos";

export function EquiposDatos({ url }: Url) {

    const { token, mensaje, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const { id } = useParams();
    const [editar, setEditar] = useState<Equipo>({
        Nombre: '',
        Activo: true,
        Id_integrante: ''
    });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetchData(url + `${id}`, "get", {}, token);
    }, [id, visible]);

    useEffect(() => {
        if (data) {
            setEditar({
                Nombre: data.equipo.nombre,
                Activo: data.equipo.activo,
                Id_integrante: data.equipo.creador.id
            });
        }
    }, [data]);

    const handleDatosEditar = () => {
        setVisible(!visible);
    }

    useEffect(() => {
        setInterval(() => {
            setMensaje(null);
        }, 10000)
    }, [mensaje])

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

            {mensaje && (
                <div className="bg-gradient-to-l from-lime-500 via-green-500 to-emerald-500 rounded-md p-2 mb-4">
                    <p className="text-white">{mensaje}</p>
                </div>
            )}

            {data && (
                <div>
                    {/* Información básica */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Información del equipo: {data.equipo.nombre}</p>

                        <div className="grid grid-cols-3">
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-500">Contacto</p>
                                <a href={`mailto:${data.equipo.creador.email}`} className="text-base font-medium text-gray-800 break-words">{data.equipo.creador.email}</a>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-500">Estado</p>
                                {data.equipo.activo == true ? <Activo mensaje="Activo" /> : <Finalizado mensaje="No activo" />}

                            </div>
                            <div className="mt-3 lg:mt-0 flex items-center">
                                <button title="Editar" onClick={handleDatosEditar} className="cursor-pointer bg-[#ff9900] p-1 rounded-sm text-white hover:bg-[#ffbc58]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {visible && <FormRegistroEquipos visible={handleDatosEditar} datosEditar={editar} idEquipo={id} />}

                    {/* Participantes */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Participantes</p>

                        {data.equipo.participantes.$values.length > 0 ? (
                            data.equipo.participantes.$values.map((p: any, i: number) => {
                                return (
                                    <div key={i} className={`mt-4 ${i === data.equipo.participantes.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                        <div className="grid grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Nombre</p>
                                                <div className="flex flex-wrap items-center">
                                                    <p className="text-base font-medium text-gray-800 break-words">{p.nombre} {p.apellidos}</p>
                                                    <Info id={p.idIntegrante} url={`/panel/usuarios/`} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href={`mailto:${p.email}`} className="text-base font-medium text-gray-800 break-words">{p.email}</a>
                                            </div>
                                            <div className="flex flex-col mt-3 lg:mt-0">
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{p.telefono}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : <p>No tiene ningún participante registrado</p>}
                    </div>

                    {/* Torneos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Torneos</p>

                        {data.equipo.torneos.$values.length > 0 ? (
                            data.equipo.torneos.$values.map((t: any, i: any) => {
                                const partidos = (t.partidos.$values.length > 0
                                    ? t.partidos.$values
                                    : t.partidos_noequipo.$values
                                )

                                return (
                                    <div key={i} className="mb-5">
                                        <div className="flex flex-wrap items-center mt-4">
                                            <p className="text-lg">{t.nombre}</p>
                                            <Info id={t.idTorneo} url={`/panel/torneos/`} />
                                        </div>
                                        <p className="text-lg mt-3">Partidos</p>
                                        {partidos.length > 0 ? (
                                            partidos.map((p: any, i: any) => {
                                                return (
                                                    <div key={i} className={`mt-3 ${i === t.partidos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                                                            <div className="grid grid-cols-3">
                                                                <div className="flex flex-col">
                                                                    <p className="text-sm text-gray-500">Fecha</p>
                                                                    <p className="text-base font-medium text-gray-800 break-words">{p.partido.fecha}</p>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-sm text-gray-500">Equipo local</p>
                                                                    <div className="flex flex-wrap items-center">
                                                                        <p className="text-base font-medium text-gray-800 break-words">{p.partido.equipo_local_nombre}</p>
                                                                        {id != p.partido.equipo_local_id && (<Info id={p.partido.equipo_local_id} url={`/panel/equipos/`} />)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-sm text-gray-500">Equipo visitante</p>
                                                                    <div className="flex flex-wrap items-center">
                                                                        <p className="text-base font-medium text-gray-800 break-words">{p.partido.equipo_visitante_nombre}</p>
                                                                        {id != p.partido.equipo_visitante_id && (<Info id={p.partido.equipo_visitante_id} url={`/panel/equipos/`} />)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {p.partido.resultado.$values.length > 0 ? (
                                                                p.partido.resultado.$values.map((r: any, i: any) => {
                                                                    return (
                                                                        <div key={i} className="grid grid-cols-[1fr_2fr] mt-3 lg:mt-0">
                                                                            <div>
                                                                                <p className="text-sm text-gray-500">Resultado</p>
                                                                                <p className="text-base font-medium text-gray-800 break-words">{r.resultado}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm text-gray-500">Ganador</p>
                                                                                <p className="text-base font-medium text-gray-800 break-words">{r.nombre}</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            ) : <p>No hay ningún resultado registrado</p>}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : <p>No hay ningún partido disputado</p>}

                                    </div>
                                )
                            })
                        ) : <p>No está registrado en ningún torneo</p>}

                    </div>

                </div>
            )}

        </>
    )

}