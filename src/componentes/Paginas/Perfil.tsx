import { useEffect } from "react";
import { useFetch } from "../Hooks_Personalizados/UseFetch";
import { useAuth } from "../Auth/AuthContext";
import { Activo, Finalizado, NoEmpezado } from "./Estados";
import { useNavigate } from "react-router-dom";

interface Equipo {
    nombre: string
}

interface Torneo {
    id: number;
    nombre: string;
    premio: string;
    fechaInicio: string;
    fechaFin: string;
    localizacion: string;
    equipos: {
        $values: Equipo[]
    }
}

interface EquipoData {
    $id: string,
    id: number,
    nombre: string,
    activo: boolean,
    participantes: number,
    torneos: number
}

export function Perfil() {
    const { data, loading, error, fetchData } = useFetch();
    const { token, rol } = useAuth();

    useEffect(() => {
        fetchData(`http://localhost:5170/api/Usuario/Info`, 'get', {}, token)
    }, []);

    useEffect(() => {
        console.log(data)
    }, [data])

    const InfoTorneo = ({ id }: { id: number }) => {
        const navigate = useNavigate();

        const handleInfo = () => {
            navigate(`/panel/torneos/${id}`);
        }

        return (
            <>
                <svg onClick={handleInfo} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ml-2 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </>
        )
    }

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
                        <p className="mb-4 font-bold text-lg">Información personal</p>

                        <div className="grid grid-cols-1 text-start lg:grid-cols-2 ">
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <p className="text-base font-medium text-gray-800 break-words truncate">{data.user.nombre}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Apellidos</p>
                                    <p className="text-base font-medium text-gray-800 break-words truncate">{data.user.apellidos}</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 lg:mt-0">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.user.email}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <p className="text-base font-medium text-gray-800 break-words truncate">{data.user.telefono}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        {rol === 3 ? <p className="mb-4 font-bold text-lg">Torneos dónde participas</p> : <p className="mb-4 font-bold text-lg">Tus torneos</p>}
                        {
                            data.user.torneos.$values.length != 0 ? (
                                data.user.torneos.$values.map((t: Torneo) => {
                                    return (
                                        <div key={t.id} className="mt-5">
                                            <div className="flex flex-wrap items-center mb-2">
                                                <p className="text-lg">{t.nombre}</p>
                                                <InfoTorneo id={t.id} />
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                                <div className="grid grid-cols-2">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-gray-500">Premio</p>
                                                        <p className="text-base font-medium text-gray-800 break-words truncate">{t.premio}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-gray-500">Fecha</p>
                                                        <p className="text-base font-medium text-gray-800 break-words">{t.fechaInicio} / {t.fechaFin}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 mt-3 lg:mt-0">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-gray-500">Localización</p>
                                                        <p className="text-base font-medium text-gray-800 break-words">{t.localizacion}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-gray-500">Estado</p>
                                                        {(() => {
                                                            const hoy = new Date();
                                                            const inicio = new Date(t.fechaInicio);
                                                            const fin = new Date(t.fechaFin);

                                                            if (hoy < inicio) {
                                                                return <NoEmpezado />;
                                                            } else if (hoy >= inicio && hoy <= fin) {
                                                                return <Activo />;
                                                            } else {
                                                                return <Finalizado />;
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                                {t.equipos?.$values?.length > 0 && (
                                                    <div className="mt-3 ">
                                                        <p className="text-sm text-gray-500">Equipo</p>
                                                        {t.equipos.$values.map((e: any, i: number) => (
                                                            <p key={i} className="text-base font-medium text-gray-800 break-words truncate">{e.nombreEquipo}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No estás registrado/a en ningún torneo</p>
                        }
                    </div>

                    <div className="bg-white p-3 rounded-md shadow-sm">
                        {rol === 3 ? <p className="mb-4 font-bold text-lg">Equipos dónde participas</p> : <p className="mb-4 font-bold text-lg">Tus equipos</p>}

                        {data.user.equipos.$values.length != 0 ? (
                            data.user.equipos.$values.map((e: EquipoData, i: number) => {
                                return (
                                    <div key={e.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${i === data.user.equipos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                        <div>
                                            <p className="text-sm text-gray-500">Equipo</p>
                                            <p className="text-base font-medium text-gray-800 break-words">{e.nombre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nº de integrantes</p>
                                            <p className="text-base font-medium text-gray-800 break-words">{e.participantes}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mt-3 lg:mt-0">Nº de torneos</p>
                                            <p className="text-base font-medium text-gray-800 break-words">{e.torneos}</p>
                                        </div>
                                        <div className="mt-3 lg:mt-0">
                                            <p className="text-sm text-gray-500">Estado</p>
                                            <p className="text-base font-medium text-gray-800 break-words">{e.activo == true ? "Activo" : "No activo"}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : <p>No tienes ningún equipo registrado</p>}
                    </div>

                </div>
            )}
        </>
    )
}