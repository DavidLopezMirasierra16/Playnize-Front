import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { Info } from "../Perfil/Perfil";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { FormRegistro } from "../../Componentes_Personalizados/FormRegistro";

export function TorneoDatos({ url }: Url) {

    type Pagina = "partidos" | "equipos";

    const { id } = useParams();
    const { token, rol, mensaje, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const navegate = useNavigate();
    const [visible, setVisible] = useState({
        requisitos: false,
        patrocinadores: false,
        partido: false
    });

    useEffect(() => {
        fetchData(url + `${id}`, "get", {}, token);
    }, [visible]);

    const FormatoPremio = (precio: string) => {
        //Intentamos convertir el valor a un número.
        const numericValue = Number(precio);

        if (!isNaN(numericValue) && precio !== null && precio !== '') {
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR'
            }).format(numericValue);
        } else {
            return precio; //Si no es un numero, lo devolvemos
        }
    }

    const handleVisible = (e?: React.MouseEvent<HTMLButtonElement> | string) => {
        if (!e) return;
        let name: string;

        if (typeof e === "string") {
            name = e;
        } else if (e) {
            name = e.currentTarget.name;
        } else {
            return;
        }
        setVisible(prev => ({
            //keyof typeof prev -> significa “todas las claves posibles de prev = "requisitos" | "patrocinadores" | "equipos"
            //Usa el valor de la variable name como la clave de este objeto, name es una de las claves de prev
            //TypeScript se quejaría de que name podría ser cualquier string, y no necesariamente una de las claves del estado.
            ...prev, [name]: !prev[name as keyof typeof prev]
        }));
    }

    const handleRedirect = (id: number, type: Pagina) => {
        navegate(`/panel/torneo/${type}/${id}`)
    }

    useEffect(() => {
        if (mensaje) {
            setInterval(() => {
                setMensaje(null);
            }, 7000);
        }
    }, [mensaje]);

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
                        <p className="mb-4 font-bold text-lg">Información del torneo: {data.torneo.nombre}</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Fechas</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{data.torneo.fechaInicio} / {data.torneo.fechaFin}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Premio</p>
                                    <p className="text-base font-medium text-gray-800 break-words">{FormatoPremio(data.torneo.premio)}</p>
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
                        <div className="flex flex-col mb-4">
                            <p className="mb-1 font-bold text-lg">Requisitos</p>
                            {rol != 3 && (
                                <div>
                                    <Boton mensaje="Agregar requisitos" name="requisitos" accion={handleVisible} />
                                </div>
                            )}
                        </div>

                        {visible.requisitos && <FormRegistro name="requisitos" mensaje="requisitos" visible={handleVisible} id={data.torneo.id}
                            url="http://localhost:5170/api/Requisitos" />}

                        {data.torneo.requisitos.$values.length > 0 ? (
                            data.torneo.requisitos.$values.map((r: any, i: number) => {
                                return (
                                    <div key={r.id} className="mt-3">
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
                        <div className="flex flex-col mb-4">
                            <p className="mb-1 font-bold text-lg">Patrocinadores</p>
                            {rol != 3 && (
                                <div>
                                    <Boton mensaje="Agregar patrocinador" name="patrocinadores" accion={handleVisible} />
                                </div>
                            )}
                        </div>

                        {visible.patrocinadores && <FormRegistro name="patrocinadores" mensaje="patrocinadores" visible={handleVisible} id={data.torneo.id}
                            url="http://localhost:5170/api/Patrocinadores" />}

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

                    {/* Partidos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <div className="flex flex-col">
                            <p className="mb-1 font-bold text-lg">Partidos</p>
                            <div className="flex flex-wrap gap-2 items-center">
                                <p>Consulta todos los partidos de este torneo</p>
                                <svg onClick={() => handleRedirect(data.torneo.id, "partidos")} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </div>

                        </div>
                    </div>

                    {/* Equipos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <div className="flex flex-col">
                            <p className="mb-1 font-bold text-lg">Equipos</p>
                            <div className="flex flex-wrap gap-2 items-center">
                                <p>Consulta todos los equipos de este torneo</p>
                                <svg onClick={() => handleRedirect(data.torneo.id, "equipos")} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </div>

                        </div>
                    </div>

                </div>
            )}

        </>
    )
}