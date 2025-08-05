import { useEffect, useState } from "react";
import { useFetch } from "../../Hooks_Personalizados/UseFetch"
import { useAuth } from "../../Auth/AuthContext";
import { Activo } from "../Estados";
import type { Url } from "./Deportes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
    $id: string,
    id: number,
    idUsuario: number,
    nombre: string,
    apellidos: string
}

/**Listado con los usuarios logeados */
export function UsuariosAccesos({ url }: Url) {
    const { token } = useAuth();
    const { data, loading, error, fetchData } = useFetch();
    const [recarga, setRecargar] = useState<boolean>(false);
    const [mensaje, setMensaje] = useState<string | null>();
    const navegate = useNavigate();

    useEffect(() => {
        fetchData(url, 'get', {}, token);
        setRecargar(false);
    }, [url, recarga]);

    const handleData = (id: number) => {
        navegate(`/panel/usuarios/${id}`);
    }

    const handleEdit = async (ids: number) => {
        const idstring = ids.toString();
        const close = await axios.patch(`http://localhost:5170/api/Acceso/Sesion/${idstring}`, {}, {
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        });
        setRecargar(true);
        setMensaje(close.data.message);
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
                    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
                        <p className="mb-4 font-bold text-lg">Usuarios conectados</p>

                        {/* Aquí irán los filtros */}

                        <div>
                            {data.datos.$values != 0 ? (
                                data.datos.$values.map((u: User, i: number) => {
                                    return (
                                        <div key={u.$id} className={`mb-5 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${i === data.datos.$values.length - 1 ? '' : ' border-b-2 border-b-[#F3F4F6]'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Nombre</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.nombre}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Apellidos</p>
                                                <p className="text-base font-medium text-gray-800 break-words truncate">{u.apellidos}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mt-3 md:mt-0">Sesión</p>
                                                <Activo />
                                            </div>
                                            <div className="mb-2 flex flex-wrap lg:items-center lg:justify-center mt-2 lg:mt-0 lg:mb-0">
                                                <button onClick={() => handleData(u.idUsuario)} title="Detalles del usuario" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleEdit(u.idUsuario)} title="Cerrar sesión" className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-1 rounded-sm ms-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 8.735 8.735m0 0a.374.374 0 1 1 .53.53m-.53-.53.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 0 1 0 5.304m2.121-7.425a6.75 6.75 0 0 1 0 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 0 1-1.06-2.122m-1.061 4.243a6.75 6.75 0 0 1-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12Z" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : <p>No hay usuarios conectados</p>}
                        </div>

                    </div>
                </div>
            )}

        </>
    )

}