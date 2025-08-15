import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext"
import { useFetch } from "../../Hooks_Personalizados/UseFetch";
import type { Url } from "../Deportes/Deportes";
import { Boton } from "../../Componentes_Personalizados/BotonPrincipal";
import { RegistrarRol } from "./FormRegistrarRol";
import axios from "axios";

export function Roles({ url }: Url) {

    interface Rol {
        $id: string,
        id: number,
        rol: string,
        usuarios: string
    }

    const { token, mensaje, setMensaje } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [pagina, setPagina] = useState<number>(1);
    const [visibleCrear, setVisibleCrear] = useState(false);
    const [visibleEditar, setVisibleEditar] = useState(false);
    const [rolEditar, setRolEditar] = useState({
        id: 0,
        rol: ''
    });

    useEffect(() => {
        fetchData(url + `?page=${pagina}`, 'get', {}, token);
    }, [url, visibleCrear, visibleEditar])

    const handleNextPagina = () => {
        setPagina((prevPag: number) => prevPag + 1);
    }

    const hangleBackPagina = () => {
        setPagina((prevPagina: number) => prevPagina - 1);
    }

    const handleRedirect = async (id: number) => {
        const datos = await axios.get(`http://localhost:5170/api/Roles/${id}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : token
            }
        });
        setRolEditar(datos.data.rol);
        setVisibleEditar(!visibleEditar);
    }

    const handleVisibleCrear = () => {
        setVisibleCrear(!visibleCrear);
    }

    const handleVisibleEditar = () => {
        setVisibleEditar(!visibleEditar);
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
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Roles</p>

                        <div className={`mb-4`}>
                            <Boton icono="registrar" mensaje="Registrar" name="crear" type="button" accion={handleVisibleCrear} />
                        </div>

                        {/* Formulario para crear */}
                        {visibleCrear && <RegistrarRol visible={handleVisibleCrear} />}

                        {/* Formulario para editar */}
                        {visibleEditar && <RegistrarRol visible={handleVisibleEditar} datosEditar={rolEditar} id={rolEditar.id} />}

                        <div>
                            {data.datos.$values != 0 ? (
                                data.datos.$values.map((r: Rol, i: number) => {
                                    return (
                                        <div key={r.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Rol</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{r.rol}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Nº de usuarios</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{r.usuarios}</p>
                                            </div>
                                            <div className="mt-2 lg:mt-0 justify-center">
                                                <button title="Editar rol" onClick={() => handleRedirect(r.id)} className=" cursor-pointer bg-[#ff9900] p-1 rounded-sm text-white hover:bg-[#ffbc58]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay roles registrados</p>}
                        </div>
                        {data.totalPages > 1 && (
                            <div className="flex flex-wrap items-center">
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === data.totalPages ? 'hidden' : ''}`} onClick={handleNextPagina}>Siguiente</button>
                                <button className={`cursor-pointer bg-[#1E2939] p-1 rounded-sm text-white me-2 hover:bg-[#374151] ${data.currentPage === 1 ? 'hidden' : ''}`} onClick={hangleBackPagina}>Atrás</button>
                                <p>{data.currentItems} deportes de {data.totalItems}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    )
}