import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import { useEffect, useState } from "react";
import { Activo, Finalizado, NoEmpezado } from "../../Componentes_Personalizados/Estados";
import { EditarUser } from "../../Componentes_Personalizados/FormEditarUser";

export interface EditarDatos {
    datos: FormEditar,
    visible: () => void,
    id: number,
    mensaje: (msg: string) => void
}

export interface FormEditar {
    Nombre: string,
    Apellidos: string,
    Email: string,
    Telefono: string
}

export function UsuarioDetalle() {

    interface Sesion {
        $id: string,
        id: number,
        creacion: string,
        activo: boolean
    }

    const { id } = useParams();
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const navigate = useNavigate();
    let rol;
    const [visible, setVisible] = useState<boolean>(false);
    const [mensaje, setMensaje] = useState<string | null>();
    const [formEditar, setFormEditar] = useState<FormEditar>({
        Nombre: "",
        Apellidos: "",
        Email: "",
        Telefono: ""
    });

    useEffect(() => {
        fetchData(`http://localhost:5170/api/Usuario/${id}`, 'get', {}, token);
    }, [visible]);

    useEffect(() => {
        if (data) {
            setFormEditar({
                Nombre: data.user.nombre,
                Apellidos: data.user.apellidos,
                Email: data.user.email,
                Telefono: data.user.telefono
            });
        }
    }, [data]);

    const handleVisible = () => {
        setVisible(!visible);
        if (!visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

    }

    const handleDataEquipo = (id: number) => {
        navigate(`/panel/equipos/${id}`);
    }

    const handleDataTorneo = (id: number) => {
        navigate(`/panel/torneos/${id}`);
    }

    useEffect(() => {
        if (mensaje) {
            setInterval(() => {
                setMensaje(null);
            }, 7000);
        }
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

                    {/* Información personal */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Información del usuario: {data.user.nombre} {data.user.apellidos}</p>

                        <div>
                            <p className="mb-2">Datos personales y de contacto</p>

                            <div className="grid grid-cols-1 text-start lg:grid-cols-[2.5fr_2fr_0.5fr]">
                                <div className="grid grid-cols-2">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-gray-500">Nombre</p>
                                        <p className="text-base font-medium text-gray-800 break-words">{data.user.nombre}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-gray-500">Apellidos</p>
                                        <p className="text-base font-medium text-gray-800 break-words">{data.user.apellidos}</p>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 lg:mt-0">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-base font-medium text-gray-800 break-words">{data.user.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="text-base font-medium text-gray-800 break-words">{data.user.telefono}</p>
                                    </div>
                                </div>
                                <div className="mt-3 lg:mt-0 flex items-center">
                                    <button title="Editar" onClick={handleVisible} className=" cursor-pointer bg-[#ff9900] p-1 rounded-sm text-white hover:bg-[#ffbc58]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {visible && <EditarUser datos={formEditar} visible={handleVisible} id={data.user.id} mensaje={setMensaje} />}

                    {/* Sesion y rol */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Sesión</p>

                        <div className={`grid grid-cols-1 ${data.user.sesion.$values != 0 ? 'lg:grid-cols-[3fr_1fr]' : 'lg:grid-cols-[1fr_3fr] items-end'}`}>
                            {data.user.sesion.$values != 0 ? (
                                data.user.sesion.$values.map((s: Sesion) => {
                                    const fechaCompleta = s.creacion;
                                    const fecha = new Date(fechaCompleta).toLocaleDateString(); //Dias
                                    const hora = new Date(fechaCompleta).toLocaleTimeString(); //Horas
                                    return (
                                        <div key={s.$id} className="grid grid-cols-3">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-gray-500">Primer inicio de sesión</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{fecha}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-gray-500">Hora inicio de sesión</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{hora}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-gray-500">Estado de la sesión</p>
                                                <p className="text-base font-medium text-gray-800 break-words">{s.activo == true ? "Activa" : "No activa"}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">Primer inicio de sesión</p>
                                    <p className="text-base font-medium text-gray-800 break-words">Todavía no ha iniciado sesion</p>
                                </div>
                            )
                            }
                            {
                                data.user.roles.$values.map((r: any) => {
                                    rol = r.rol;
                                    return (
                                        <div key={r.$id} className="mt-2 flex flex-col gap-1 lg:mt-0">
                                            <p className="text-sm text-gray-500">Permiso</p>
                                            <p className="text-base font-medium text-gray-800 break-words">{r.rol}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* Torneos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">{rol != "Participantes" ? "Sus torneos" : "Torneos dónde participa"}</p>

                        <div>
                            {data.user.torneos.$values != 0 ? (
                                data.user.torneos.$values.map((t: any) => {
                                    return (
                                        <div key={t.$id} className="mt-5">
                                            <div className="flex flex-wrap items-center mb-2">
                                                <p className="text-lg">{t.nombre}</p>
                                                <svg onClick={() => handleDataTorneo(t.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ml-2 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                </svg>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                                <div className="grid grid-cols-2">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm text-gray-500">Premio</p>
                                                        <p className="text-base font-medium text-gray-800 break-words">{t.premio}</p>
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
                                                                return <NoEmpezado mensaje="No empezado" />;
                                                            } else if (hoy >= inicio && hoy <= fin) {
                                                                return <Activo mensaje="En curso" />;
                                                            } else {
                                                                return <Finalizado mensaje="Finalizado" />;
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>{rol != "Participantes" ? "No ha registrado ningún evento" : "Todavía no se ha registrado ni ha participado en ningún evento"}</p>
                            }
                        </div>
                    </div>

                    {/* Equipos */}
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">{rol != "Participantes" ? "Sus equipos" : "Equipos a los que pertenece"}</p>

                        <div>
                            {data.user.equipos.$values != 0 ? (
                                data.user.equipos.$values.map((e: any) => {
                                    let torneos: string[] = [];
                                    e.torneos.$values.map((t: any) => {
                                        torneos = [...torneos, t.nombre];
                                    })

                                    return (
                                        <div key={e.$id} className="mt-5">
                                            <div className="flex flex-wrap items-center mb-2">
                                                <p className="text-lg">{e.nombre}</p>
                                                <svg onClick={() => handleDataEquipo(e.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ml-2 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                </svg>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_2fr]">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-gray-500">Estado</p>
                                                    <p className="text-base font-medium text-gray-800 break-words">{e.activo == true ? "Activo" : "No activo"}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm text-gray-500">Participantes</p>
                                                    <p className="text-base font-medium text-gray-800 break-words">{e.participantes.$values.length}</p>
                                                </div>
                                                <div className="flex flex-col gap-1 mt-3 lg:mt-0">
                                                    <p className="text-sm text-gray-500">Torneos dónde participa el equipo</p>
                                                    <p className="text-base font-medium text-gray-800 break-words">
                                                        {torneos.length != 0 ? torneos.join(", ") : "No se ha registrado en ningún torneo"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>{rol != "Participantes" ? "No ha registrado ningún equipo" : "Todavía no se ha registrado en ningún equipo"}</p>}

                        </div>

                    </div>


                </div>
            )}

        </>
    )
}